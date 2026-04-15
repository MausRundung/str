$Path = "."
$Files = $false; $Routes = $false; $Imports = $false; $Sockets = $false; $Database = $false; $Exports = $false; $SummaryOnly = $false
$ExportFile = $null

# --- MANUAL ARGUMENT PARSING ---
foreach ($arg in $args) {
    if ($arg -match '^-f$') { $Files = $true }
    elseif ($arg -match '^-r$') { $Routes = $true }
    elseif ($arg -match '^-i$') { $Imports = $true }
    elseif ($arg -match '^-s$') { $Sockets = $true }
    elseif ($arg -match '^-d$') { $Database = $true }
    elseif ($arg -match '^-e$') { $Exports = $true }
    elseif ($arg -match '^-SummaryOnly$') { $SummaryOnly = $true }
    elseif ($arg -match '^help$') { $Path = "help" }
    elseif ($arg -eq '--') { $ExportFile = "filestructure.md" }
    elseif ($arg -match '^--(.+)') { $ExportFile = $matches[1] + ".md" }
    elseif (-not $arg.StartsWith('-')) { $Path = $arg }
}

# --- HELP MENU ---
if ($Path -eq "help") {
    Write-Host "`n=== POLYGLOT ARCHITECT HELP ===" -ForegroundColor Yellow
    Write-Host "Usage: str [Path] [Flags][--exportname]" -ForegroundColor Cyan
    Write-Host "`nFLAGS:" -ForegroundColor Gray
    Write-Host "  -f    Files: Shows all file names in the tree."
    Write-Host "  -r    Routes: Extracts API endpoints AND Handler functions."
    Write-Host "  -i    Imports: Lists ALL dependencies (External & Local)."
    Write-Host "  -s    Sockets: Shows Real-time events."
    Write-Host "  -d    Database: Shows Models (SQL, Prisma, etc)."
    Write-Host "  -e    Exports: Shows Interfaces, Types, Classes, and Exported Constants."
    Write-Host "  -SummaryOnly  Shows only the final system map."
    Write-Host "`nEXPORTING FOR AI: --some-name (creates some-name.md)"
    exit
}

# --- INITIALIZATION ---
try { $rootPath = Resolve-Path $Path } catch { Write-Error "Invalid Path"; exit }

$dirRegex = '(?i)[\\/](node_modules|\.git|\.vscode|\.idea|\.next|dist|build|out|target|bin|obj|venv|\.venv|__pycache__|uploads)([\\/]|$)'
$fileRegex = '(?i)(\.sqlite|\.db|\.exe|package-lock\.json|yarn\.lock|Cargo\.lock)$'

$showAll = -not ($Files -or $Routes -or $Imports -or $Sockets -or $Database -or $Exports -or $SummaryOnly)
$OutputLog = New-Object System.Collections.Generic.List[string]

function Log ($text, $color="Gray") {
    Write-Host $text -ForegroundColor $color
    $OutputLog.Add($text)
}
function LogInline ($label, $labelColor, $value, $valueColor) {
    Write-Host "    [$label]  " -NoNewline -ForegroundColor $labelColor
    Write-Host $value -ForegroundColor $valueColor
    $OutputLog.Add("    [$label]  $value")
}

Log "`n=== ANALYZING ARCHITECTURE: $($rootPath) ===" "Cyan"

# --- EXTENSIVE LANGUAGE-SPECIFIC REGEX PATTERNS ---
$langPatterns = @{
    js = @{
        routes = @(
            '(?i)\b(?<var>[a-zA-Z0-9_]+)\.(?<method>get|post|put|delete|patch|use|all)\s*\(\s*[''"](?<route>\/[^''"]*|\*[^''"]*)[''"](?:[^()]*?,\s*(?<handler>[a-zA-Z0-9_.]+)\s*\))?',
            '(?m)^[ \t]*export\s+(?:async\s+)?function\s+(?<method>GET|POST|PUT|DELETE|PATCH)\b'
        )
        imports = @(
            '(?ms)\bimport\s+[^''"]*?[''"](?<val>[^''"]+)[''"]',
            '(?ms)\bexport\s+[^''"]*?from\s+[''"](?<val>[^''"]+)[''"]',
            '(?ms)\b(?:await\s+)?import\([''"](?<val>[^''"]+)[''"]\)',
            '\brequire\([''"](?<val>[^''"]+)[''"]\)'
        )
        contexts = @(
            '\buseContext\((?<val>\w+)\)',
            '\buse(?<val>\w+(?:Context|Store))\(\)',
            '(?<!\.)\binject\([''"](?<val>[^''"]+)[''"]\)',
            '(?<!\.)\bgetContext\([''"](?!(?:2d|webgl))(?<val>[^''"]+)[''"]\)'
        )
        db = @( '\bmodel\s+(?<val>\w+)\s*\{' )
        interfaces = @(
            '(?ms)\b(?:export\s+)?(?:interface|type)\s+(?<val>[a-zA-Z0-9_]+)'
        )
        exports = @(
            '(?m)\bexport\s+(?:default\s+)?(?:async\s+)?(?:abstract\s+)?(?:const|let|var|function|class|enum)\s+(?<val>[a-zA-Z0-9_]+)',
            '(?m)\bexport\s+default\s+(?!(?:async|abstract|const|let|var|function|class|enum)\b)(?<val>[a-zA-Z0-9_]+)'
        )
    }
    py = @{
        routes = @('@(?<var>[a-zA-Z0-9_]+)\.(?<method>get|post|put|delete|patch|route)\s*\(\s*[''"](?<route>[^''"]+)[''"]', '\bpath\(\s*[''"](?<route>[^''"]*)[''"](?:[^)]*,\s*(?<handler>[a-zA-Z0-9_.]+)\s*)?\)')
        imports = @('(?m)^[ \t]*from\s+(?<val>[a-zA-Z0-9_.]+)\s+import', '(?m)^[ \t]*import\s+(?<val>[a-zA-Z0-9_.]+)(?:\s+as\s+[a-zA-Z0-9_]+)?\s*$')
        db = @('(?m)^[ \t]*class\s+(?<val>\w+)\(Base\)', '(?m)^[ \t]*class\s+(?<val>\w+)\(models\.Model\)')
    }
    cs = @{
        routes = @('\[Http(?<method>Get|Post|Put|Delete|Patch)(?:\s*\(\s*[''"](?<route>[^''"]*)[''"]\s*\))?\]')
        imports = @('(?m)^[ \t]*(?:using|namespace)\s+(?<val>[a-zA-Z0-9_.]+);')
        db = @('DbSet<(?<val>\w+)>')
    }
    any = @{
        db = @('(?i)CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?<val>\w+)')
    }
}

# --- DATA COLLECTION ---
$data = Get-ChildItem -Path $rootPath -Recurse -Attributes !Hidden | Where-Object { 
    $_.FullName -notmatch $dirRegex -and $_.FullName -notmatch $fileRegex
} | ForEach-Object {
    $item = $_
    $info =[PSCustomObject]@{
        FullName = $item.FullName; Type = if ($item.PSIsContainer) { "Directory" } else { "File" }
        Lines = 0; Imports = @(); Routes = @(); Sockets = @(); DbTables = @(); Contexts = @(); Interfaces = @(); Exports = @()
    }

    $ext = $item.Extension
    if ($ext -and $info.Type -eq "File") {
        $lang = ""
        if ($ext -in @(".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte")) { $lang = "js" }
        elseif ($ext -eq ".py") { $lang = "py" }
        elseif ($ext -eq ".cs") { $lang = "cs" }
        
        $content = Get-Content $item.FullName -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $info.Lines = ($content -split '\r?\n').Count
            
            $patterns = if ($lang) { $langPatterns[$lang] } else { @{} }
            
            if (($showAll -or $Imports) -and $patterns.imports) { foreach($p in $patterns.imports) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.Imports += $v } } } }
            if (($showAll -or $Database) -and $patterns.db) { foreach($p in $patterns.db) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.DbTables += $v } } } }
            if ($patterns.contexts) { foreach($p in $patterns.contexts) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.Contexts += $v } } } }
            if ($showAll -or $Database) { foreach($p in $langPatterns.any.db) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.DbTables += $v } } } }

            # EXPORTS & INTERFACES
            if (($showAll -or $Exports) -and $patterns.interfaces) { foreach($p in $patterns.interfaces) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.Interfaces += $v } } } }
            if (($showAll -or $Exports) -and $patterns.exports) { foreach($p in $patterns.exports) { foreach($m in [regex]::Matches($content, $p)) { $v = $m.Groups['val'].Value.Trim(); if ($v) { $info.Exports += $v } } } }

            # ROUTES (WITH HANDLERS)
            if (($showAll -or $Routes) -and $patterns.routes) {
                foreach ($pat in $patterns.routes) {
                    foreach($match in [regex]::Matches($content, $pat)) {
                        $method  = if ($match.Groups['method'].Success) { $match.Groups['method'].Value.ToUpper() } else { "ANY" }
                        $route   = if ($match.Groups['route'].Success)  { $match.Groups['route'].Value } else { "/" }
                        $handler = if ($match.Groups['handler'].Success) { $match.Groups['handler'].Value } else { "" }
                        
                        if ($method -eq 'REQUEST') { $method = 'ANY' }
                        if ($route -match "^https?://") { continue }
                        if ($route -match "^/?io$") { continue }
                        
                        if ($method -match "^(GET|POST|PUT|DELETE|PATCH)$" -and $pat -match "export") {
                            $route = "(Next.js Endpoint)"
                        } elseif ($route -eq '' -or -not $route.StartsWith('/')) {
                            $route = "/$route"
                        }

                        $routeStr = "[$method] $route"
                        if ($handler) { $routeStr += " -> $handler" }

                        $info.Routes += $routeStr
                    }
                }
            }

            # SOCKETS
            if ($showAll -or $Sockets) {
                foreach($match in [regex]::Matches($content, '\.(?<event>on|emit)\s*\(\s*[''"](?<name>[^''"]+)[''"]')) {
                    $info.Sockets += "$($match.Groups['event'].Value): $($match.Groups['name'].Value)"
                }
            }
        }
    }
    return $info
}

# --- VISUAL RENDERING ---
if (-not $SummaryOnly) {
    foreach ($entry in $data) {
        if ($entry.Type -eq "Directory") {
            if ($showAll -or $Files) { Log "`n[DIR] $($entry.FullName.Replace($rootPath.Path, 'ROOT'))" "Blue" }
        } else {
            $hasRoutes = $entry.Routes.Count -gt 0; $hasSockets = $entry.Sockets.Count -gt 0
            $hasDb = $entry.DbTables.Count -gt 0; $hasImports = $entry.Imports.Count -gt 0
            $hasExports = $entry.Exports.Count -gt 0; $hasInterfaces = $entry.Interfaces.Count -gt 0

            if ($showAll -or $Files -or ($Routes -and $hasRoutes) -or ($Sockets -and $hasSockets) -or ($Database -and $hasDb) -or ($Imports -and $hasImports) -or ($Exports -and ($hasExports -or $hasInterfaces))) {
                
                Log "  FILE: $($entry.FullName.Replace($rootPath.Path, '')) ($($entry.Lines) lines)" "Gray"
                
                if (($showAll -or $Database) -and $hasDb) { LogInline "TABLES" "Yellow" (($entry.DbTables | Select-Object -Unique) -join ", ") "White" }
                if (($showAll -or $Routes) -and $hasRoutes) { LogInline "ROUTES" "Green" (($entry.Routes | Select-Object -Unique) -join "  ") "White" }
                if (($showAll -or $Sockets) -and $hasSockets) { LogInline "SOCKET" "Magenta" (($entry.Sockets | Select-Object -Unique) -join ", ") "White" }
                if ($entry.Contexts) { LogInline "STATE " "Cyan" (($entry.Contexts | Select-Object -Unique) -join ", ") "White" }
                
                if (($showAll -or $Exports) -and $hasInterfaces) { LogInline "TYPES " "DarkMagenta" (($entry.Interfaces | Select-Object -Unique) -join ", ") "White" }
                if (($showAll -or $Exports) -and $hasExports) { LogInline "EXPORTS" "DarkYellow" (($entry.Exports | Select-Object -Unique) -join ", ") "White" }
                
                if (($showAll -or $Imports) -and $hasImports) {
                    $ext = $entry.Imports | Select-Object -Unique
                    if ($ext) { LogInline "IMPORTS" "DarkGray" ($ext -join ", ") "DarkCyan" }
                }
            }
        }
    }
}

# --- FOOTER SUMMARY ---
Log "`n============================================================" "Cyan"
$allTables = ($data.DbTables | Where-Object {$_} | Select-Object -Unique | Sort-Object) -join ", "
if($allTables) { LogInline "MODELS" "Yellow" $allTables "White" }

$allContexts = ($data.Contexts | Where-Object {$_} | Select-Object -Unique | Sort-Object) -join ", "
if($allContexts) { LogInline "STATE " "Cyan" $allContexts "White" }

$totalLines = ($data | Measure-Object -Property Lines -Sum).Sum
Log "Done. Scanned $(($data | Where-Object {$_.Type -eq 'File'}).Count) files. (Total Lines: $totalLines)" "Green"
Log "============================================================`n" "Cyan"

# --- AI EXPORT LOGIC ---
if ($ExportFile) {
    $finalOutput = '```text' + "`n" + ($OutputLog -join "`n") + "`n" + '```'
    Set-Content -Path $ExportFile -Value $finalOutput
    
    $successMsg = '> EXPORT SUCCESS: Saved map to ' + $ExportFile
    Write-Host $successMsg -ForegroundColor Green
    Write-Host '  (Ready to be pasted into ChatGPT/Claude)' -ForegroundColor Gray
}

# --- AUTO-VIEWER LINK ---
$scriptDir = $PSScriptRoot
if ([string]::IsNullOrEmpty($scriptDir)) { $scriptDir = (Get-Location).Path }

$htmlPath = Join-Path -Path $scriptDir -ChildPath "index.html"
if (Test-Path $htmlPath) {
    $jsDataPath = Join-Path -Path $scriptDir -ChildPath "str-data.js"
    $rawText = $OutputLog -join "`n"
    $bt = [string][char]96
    
    # Securely escape backslashes, backticks, and dollar signs for JS template literal evaluation
    $safeText = $rawText.Replace('\', '\\').Replace($bt, "\$bt").Replace('$', '\$')
    $jsContent = "window.STR_AUTO_DATA = $bt$safeText$bt;"
    
    try {
        Set-Content -Path $jsDataPath -Value $jsContent -Encoding UTF8 -ErrorAction Stop
        $localUri = "file:///" + ($htmlPath -replace '\\', '/')
        Write-Host "> VIEWER READY: " -ForegroundColor Green -NoNewline
        Write-Host $localUri -ForegroundColor Cyan
        Write-Host "  (Ctrl+Click to open in browser)`n" -ForegroundColor Gray
    } catch {
        Write-Host "> Could not create auto-viewer link (Check file permissions for $scriptDir)`n" -ForegroundColor DarkGray
    }
}