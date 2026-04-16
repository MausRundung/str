$Path = "."
$Files = $false; $Routes = $false; $Imports = $false; $Sockets = $false; $Database = $false; $Exports = $false; $SummaryOnly = $false; $CheckUnused = $false
$ExportFile = $null

# --- ARGUMENT PARSING ---
foreach ($arg in $args) {
    if ($arg -match '^-f$') { $Files = $true }
    elseif ($arg -match '^-r$') { $Routes = $true }
    elseif ($arg -match '^-i$') { $Imports = $true }
    elseif ($arg -match '^-s$') { $Sockets = $true }
    elseif ($arg -match '^-d$') { $Database = $true }
    elseif ($arg -match '^-e$') { $Exports = $true }
    elseif ($arg -match '^-u$') { $CheckUnused = $true }
    elseif ($arg -match '^-SummaryOnly$') { $SummaryOnly = $true }
    elseif ($arg -match '^help$') { $Path = "help" }
    elseif ($arg -eq '--') { $ExportFile = "filestructure.md" }
    elseif ($arg -match '^--(.+)') { $ExportFile = $matches[1] + ".md" }
    elseif (-not $arg.StartsWith('-')) { $Path = $arg }
}

if ($Path -eq "help") {
    Write-Host "`n=== POLYGLOT ARCHITECT v4.1 (ULTRA-FAST DEEP SCAN) ===" -ForegroundColor Yellow
    Write-Host "Usage: str [Path] [Flags][--exportname]" -ForegroundColor Cyan
    Write-Host "`nFLAGS:" -ForegroundColor Gray
    Write-Host "  -f    Files (Show all files)"
    Write-Host "  -r    Routes (API Endpoints & File-based routing)"
    Write-Host "  -i    Imports (Deep module extraction & destructured mapping)"
    Write-Host "  -e    Exports (Functions, Classes, Structs, Hooks)"
    Write-Host "  -d    Database (Models, Schemas, Services, ORMs)"
    Write-Host "  -u    Unused (Cross-references imports to find unused variables!)"
    exit
}

try { $rootPath = (Resolve-Path $Path).Path } catch { Write-Error "Invalid Path"; exit }

# Strict Exclusions
$dirRegex = '(?i)[\\/](\.git|node_modules|\.next|\.nuxt|\.svelte-kit|dist|build|vendor|venv|\.venv|__pycache__|target|obj|bin|coverage|\.vs|out)([\\/]|$)'
$fileRegex = '(?i)(\.exe|\.dll|\.pyc|\.png|\.jpg|\.jpeg|\.gif|\.ico|\.svg|\.woff|\.woff2|\.ttf|\.sqlite|\.db|\.pdf|\.zip|\.tar|\.gz|package-lock\.json|yarn\.lock|pnpm-lock\.yaml|\.min\.js|\.map|\.stl|\.fbx)$'

$showAll = -not ($Files -or $Routes -or $Imports -or $Sockets -or $Database -or $Exports -or $SummaryOnly -or $CheckUnused)
$OutputLog = [System.Collections.Generic.List[string]]::new()

function Log ($text, $color="Gray") { Write-Host $text -ForegroundColor $color; $OutputLog.Add($text) }
function LogInline ($label, $labelColor, $value, $valueColor) {
    Write-Host "[$label] " -NoNewline -ForegroundColor $labelColor
    Write-Host $value -ForegroundColor $valueColor
    $OutputLog.Add("    [$label] $value")
}

Log "`n=== ADVANCED ARCHITECTURE SCAN: $($rootPath) ===" "Cyan"
if ($CheckUnused) { Log "[-] Unused Import Detection ENABLED" "Yellow" }

# --- 1. ULTRA-FAST DIRECTORY TRAVERSAL ---
$filesToProcess =[System.Collections.Generic.List[string]]::new()
$dirsToProcess =[System.Collections.Generic.Queue[string]]::new()
$dirsToProcess.Enqueue($rootPath)

while ($dirsToProcess.Count -gt 0) {
    $currentDir = $dirsToProcess.Dequeue()
    try {
        foreach ($sub in [System.IO.Directory]::GetDirectories($currentDir)) {
            if ($sub -notmatch $dirRegex) { $dirsToProcess.Enqueue($sub) }
        }
        foreach ($file in [System.IO.Directory]::GetFiles($currentDir)) {
            if ($file -notmatch $fileRegex) { $filesToProcess.Add($file) }
        }
    } catch { }
}

# --- 2. DEEP PARSING LOGIC ---
$data =[System.Collections.Generic.List[PSCustomObject]]::new()

foreach ($filePath in $filesToProcess) {
    $fileInfo = [System.IO.FileInfo]::new($filePath)
    if ($fileInfo.Length -gt 1048576) { continue } # SKIP FILES > 1MB
    
    $ext = $fileInfo.Extension.ToLower()
    $fileName = $fileInfo.Name.ToLower()
    $relPath = $filePath.Replace($rootPath, "").Replace("\", "/")
    
    $info = [PSCustomObject]@{
        Name = $fileInfo.Name; FullName = $filePath; RelPath = $relPath; Lines = 0
        Imports =[System.Collections.Generic.HashSet[string]]::new()
        Routes =[System.Collections.Generic.HashSet[string]]::new()
        Db =[System.Collections.Generic.HashSet[string]]::new()
        Exports =[System.Collections.Generic.HashSet[string]]::new()
        Meta =[System.Collections.Generic.HashSet[string]]::new()
        Unused =[System.Collections.Generic.HashSet[string]]::new()
    }

    $content = Get-Content $filePath -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    $info.Lines = ($content -split '\r?\n').Count

    # -- FILE-BASED ROUTING --
    if ($relPath -match '/(app|pages|routes)/.*\.(tsx|jsx|js|ts|svelte|vue)$' -and $fileName -match '^(page|route|\+page|\+server|\+layout|layout|index)\.') {
        $info.Routes.Add("[File Route] $relPath") | Out-Null
    }

    # -- STRUCTURED DATA (JSON / YAML) --
    if ($ext -eq ".json") {
        try {
            $json = $content | ConvertFrom-Json
            if ($fileName -eq "package.json") {
                if ($json.dependencies) { $json.dependencies.psobject.properties.name | ForEach-Object { $info.Imports.Add("npm:$_") | Out-Null } }
                if ($json.devDependencies) { $json.devDependencies.psobject.properties.name | ForEach-Object { $info.Imports.Add("npm-dev:$_") | Out-Null } }
                $info.Meta.Add("Version: $($json.version)") | Out-Null
            }
        } catch {}
    }
    elseif ($ext -match "ya?ml") {
        foreach ($m in [regex]::Matches($content, 'image:\s*(?<val>[^\s]+)')) { $info.Imports.Add("Docker:$($m.Groups['val'].Value)") | Out-Null }
        foreach ($m in [regex]::Matches($content, '(?m)^[ \t]*(?<val>[a-zA-Z0-9_-]+):[ \t]*\n[ \t]+image:')) { $info.Db.Add("Service:$($m.Groups['val'].Value)") | Out-Null }
    }

    # -- CODE PARSING (REGEX) --
    $clean = $content -replace '(?m)//.*$', '' -replace '(?m)#.*$', ''

    switch -Regex ($ext) {
        '\.(js|ts|tsx|jsx|vue|svelte)$' {
            foreach ($m in [regex]::Matches($clean, '(?ms)^[ \t]*import\s+(?<imports>[^''";]+?)\s+from\s+[''"](?<module>[^''"]+)[''"]')) {
                $module = $m.Groups['module'].Value
                $impBlock = $m.Groups['imports'].Value -replace '[\{\}\s]', ' '
                foreach ($imp in ($impBlock -split ',' | Where-Object { $_.Trim() })) {
                    $token = ($imp.Trim() -split '\s+as\s+')[-1].Trim() 
                    if ($token -eq '*') { $info.Imports.Add("$module (*)") | Out-Null; continue }
                    
                    $info.Imports.Add("$module ($token)") | Out-Null
                    if ($CheckUnused) {
                        $safeToken = [regex]::Escape($token)
                        $restOfFile = $clean.Replace($m.Value, "")
                        if (-not[regex]::IsMatch($restOfFile, "\b$safeToken\b")) { $info.Unused.Add($token) | Out-Null }
                    }
                }
            }
            foreach ($m in [regex]::Matches($clean, '(?i)(?:const|let|var)\s+(?<imports>\{[^}]+\}|[a-zA-Z0-9_]+)\s*=\s*require\([''"](?<module>[^''"]+)[''"]\)')) {
                $module = $m.Groups['module'].Value
                $impBlock = $m.Groups['imports'].Value -replace '[\{\}\s]', ' '
                foreach ($imp in ($impBlock -split ',' | Where-Object { $_.Trim() })) { $info.Imports.Add("$module ($($imp.Trim()))") | Out-Null }
            }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*export\s+(?:default\s+)?(?:async\s+)?(?:const|let|var|function|class|type|interface|enum)\s+(?<val>[a-zA-Z0-9_]+)')) { $info.Exports.Add($m.Groups['val'].Value) | Out-Null }
            
            # BUG FIX: Removed `(?i)` case-insensitivity to stop "user", "username", "userId" from registering as hooks!
            foreach ($m in [regex]::Matches($clean, '\buse[A-Z][a-zA-Z0-9_]*\b')) { $info.Exports.Add("[Hook] $($m.Value)") | Out-Null }
            
            foreach ($m in [regex]::Matches($clean, '(?i)(?:app|router|server|fastify)\.(?<method>get|post|put|delete|patch|all)\([''"](?<route>[^''"]+)[''"]')) { $info.Routes.Add("[$($m.Groups['method'].Value.ToUpper())] $($m.Groups['route'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, '\b(?:model|enum|type)\s+(?<val>[A-Z]\w+)\s*\{')) { $info.Db.Add("Model: $($m.Groups['val'].Value)") | Out-Null }
        }
        
        '\.(py|pyi)$' {
            foreach ($m in [regex]::Matches($clean, '(?ms)^[ \t]*from\s+(?<module>[a-zA-Z0-9_.]+)\s+import\s+(?:\((?<named>[^)]+)\)|(?<inline>[^\r\n]+))')) {
                $module = $m.Groups['module'].Value
                $impBlock = if ($m.Groups['named'].Success) { $m.Groups['named'].Value } else { $m.Groups['inline'].Value }
                foreach ($imp in ($impBlock -split ',' | Where-Object { $_.Trim() })) {
                    $token = ($imp.Trim() -split '\s+as\s+')[-1].Trim()
                    $info.Imports.Add("$module ($token)") | Out-Null
                    if ($CheckUnused) {
                        $safeToken =[regex]::Escape($token)
                        $restOfFile = $clean.Replace($m.Value, "")
                        if (-not [regex]::IsMatch($restOfFile, "\b$safeToken\b")) { $info.Unused.Add($token) | Out-Null }
                    }
                }
            }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*import\s+(?<val>[a-zA-Z0-9_., ]+)')) {
                $m.Groups['val'].Value -split ',' | ForEach-Object { $info.Imports.Add($_.Trim()) | Out-Null }
            }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*(?:async\s+)?def\s+(?<val>[a-zA-Z0-9_]+)\(')) { $info.Exports.Add("def $($m.Groups['val'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*class\s+(?<val>[a-zA-Z0-9_]+)')) { $info.Exports.Add("class $($m.Groups['val'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, '@(?:app|router|blueprint)\.(?<method>get|post|put|delete|route)\([''"](?<route>[^''"]+)[''"]')) { $info.Routes.Add("[$($m.Groups['method'].Value.ToUpper())] $($m.Groups['route'].Value)") | Out-Null }
        }
        
        '\.(cs)$' {
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*using\s+(?<val>[a-zA-Z0-9_.]+);')) { $info.Imports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?m)public\s+(?:static\s+)?(?:class|struct|interface|record|enum)\s+(?<val>[a-zA-Z0-9_]+)')) { $info.Exports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '\[Http(?<method>Get|Post|Put|Delete|Patch)(?:\([''"](?<route>[^''"]*)[''"]\))?\]')) { $info.Routes.Add("[$($m.Groups['method'].Value.ToUpper())] $($m.Groups['route'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, 'DbSet<(?<val>\w+)>')) { $info.Db.Add("DbSet: $($m.Groups['val'].Value)") | Out-Null }
        }

        '\.(go)$' {
            foreach ($m in [regex]::Matches($clean, '(?ms)import\s*\((?<imports>[^)]+)\)')) { 
                foreach ($imp in ($m.Groups['imports'].Value -split '\n' | Where-Object { $_.Trim() })) { $info.Imports.Add($imp.Trim() -replace '"', '') | Out-Null }
            }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*import\s+[''"](?<val>[^''"]+)[''"]')) { $info.Imports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?m)^func\s+(?<val>[A-Z][a-zA-Z0-9_]*)\b')) { $info.Exports.Add("func $($m.Groups['val'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, 'http\.HandleFunc\([''"](?<route>[^''"]+)[''"]|\.(?<method>GET|POST|PUT|DELETE|PATCH)\([''"](?<route>[^''"]+)[''"]')) { 
                $method = if ($m.Groups['method'].Success) { $m.Groups['method'].Value } else { "ANY" }
                $info.Routes.Add("[$method] $($m.Groups['route'].Value)") | Out-Null 
            }
        }

        '\.(rs)$' {
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*use\s+(?<val>[a-zA-Z0-9_:]+)(?:;|\{)')) { $info.Imports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*pub\s+(?:fn|struct|enum|trait)\s+(?<val>[a-zA-Z0-9_]+)')) { $info.Exports.Add($m.Groups['val'].Value) | Out-Null }
        }

        '\.(php)$' {
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*use\s+(?<val>[a-zA-Z0-9_\\]+);')) { $info.Imports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?m)^[ \t]*(?:public\s+)?(?:class|function)\s+(?<val>[a-zA-Z0-9_]+)')) { $info.Exports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, 'Route::(?<method>get|post|put|delete|any|match)\([''"](?<route>[^''"]+)[''"]')) { $info.Routes.Add("[$($m.Groups['method'].Value.ToUpper())] $($m.Groups['route'].Value)") | Out-Null }
        }

        '\.(ps1|psm1)$' {
            foreach ($m in [regex]::Matches($clean, '(?m)^\s*(?:\.|using\s+module|Import-Module)\s+(?<val>[^\s\r\n;]+)')) { $info.Imports.Add($m.Groups['val'].Value) | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?i)(?m)^function\s+(?<val>[a-zA-Z0-9_-]+)')) { $info.Exports.Add("func $($m.Groups['val'].Value)") | Out-Null }
            foreach ($m in [regex]::Matches($clean, '(?i)Invoke-(RestMethod|WebRequest).*?(?:-Uri|-Url)\s+[''"]?(?<val>http[^''"\s]+)')) { $info.Routes.Add("[API CALL] $($m.Groups['val'].Value)") | Out-Null }
        }
    }
    
    $data.Add($info)
}

# --- 3. VISUAL RENDERING ---
foreach ($entry in $data) {
    $hasAny = ($entry.Imports.Count + $entry.Routes.Count + $entry.Db.Count + $entry.Exports.Count + $entry.Unused.Count) -gt 0
    if ($showAll -or $Files -or $hasAny) {
        Log "`nFILE: $($entry.RelPath) ($($entry.Lines) lines)" "White"
        
        if ($entry.Meta.Count -gt 0) { LogInline "META   " "Cyan" ($entry.Meta -join ", ") "Gray" }
        if ($entry.Db.Count -gt 0) { LogInline "DATA   " "Yellow" ($entry.Db -join ", ") "Gray" }
        if ($entry.Routes.Count -gt 0) { LogInline "ROUTES " "Green" ($entry.Routes -join " | ") "Gray" }
        
        if ($entry.Exports.Count -gt 0) { 
            # Sort so that Hooks are naturally grouped at the end
            $expArr = $entry.Exports | Sort-Object | Select-Object -First 15
            $suffix = if ($entry.Exports.Count -gt 15) { " (+$(($entry.Exports.Count - 15)) more)" } else { "" }
            LogInline "EXPORTS" "DarkYellow" (($expArr -join ", ") + $suffix) "Gray" 
        }
        
        if ($entry.Imports.Count -gt 0) { 
            $impArr = $entry.Imports | Sort-Object | Select-Object -First 15
            $suffix = if ($entry.Imports.Count -gt 15) { " (+$(($entry.Imports.Count - 15)) more)" } else { "" }
            LogInline "IMPORTS" "DarkGray" (($impArr -join ", ") + $suffix) "DarkCyan" 
        }
        
        if ($CheckUnused -and $entry.Unused.Count -gt 0) {
            LogInline "UNUSED " "Red" ($entry.Unused -join ", ") "DarkRed"
        }
    }
}

# BUG FIX: String Formatting corrected to avoid argument injection parsing errors in PowerShell
Log "`n$('-' * 70)" "Cyan"
$totalLines = ($data | Measure-Object -Property Lines -Sum).Sum
$fileCount = $data.Count
Log "Deep Scan Complete" "Green"
Log "Files Analyzed: $fileCount | Total Lines of Code: $totalLines" "White"
Log "$('-' * 70)`n" "Cyan"

# --- INTERRUPTIBLE VIEWER SERVER ---
$scriptDir = $PSScriptRoot; if ([string]::IsNullOrEmpty($scriptDir)) { $scriptDir = (Get-Location).Path }
$port = 45000; $listener = New-Object System.Net.HttpListener; $serverStarted = $false
while (-not $serverStarted -and $port -lt 45100) { try { $listener.Prefixes.Clear(); $listener.Prefixes.Add("http://localhost:$port/"); $listener.Start(); $serverStarted = $true } catch { $port++ } }

if (-not $listener.IsListening) { Write-Host "`n> Error: Could not bind to local port." -ForegroundColor Red; exit }

$url = "http://localhost:$port/"; Write-Host "`n> VIEWER SERVER READY: " -ForegroundColor Green -NoNewline; Write-Host $url -ForegroundColor Cyan; Write-Host "  (Press Ctrl+C to stop)`n" -ForegroundColor Gray
Start-Process $url

try {
    while ($listener.IsListening) {
        $contextAsync = $listener.BeginGetContext($null, $null)
        while (-not $contextAsync.IsCompleted) {
            if (-not $listener.IsListening) { break }
            Start-Sleep -Milliseconds 100
        }

        if ($contextAsync.IsCompleted) {
            $context = $listener.EndGetContext($contextAsync)
            $request = $context.Request; $response = $context.Response
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $reqPath = $request.Url.LocalPath; if ($reqPath -eq "/") { $reqPath = "/index.html" }

            if ($reqPath -eq "/str-data.js") {
                $rawText = $OutputLog -join "`n"; $bt =[string][char]96
                $safeText = $rawText.Replace('\', '\\').Replace($bt, "\$bt").Replace('$', '\$')
                $content = "window.STR_AUTO_DATA = $bt$safeText$bt;"; $buffer =[System.Text.Encoding]::UTF8.GetBytes($content)
                $response.ContentType = "application/javascript"; $response.ContentLength64 = $buffer.Length; $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } else {
                $filePath = Join-Path -Path $scriptDir -ChildPath $reqPath.TrimStart('/')
                if (Test-Path $filePath -PathType Leaf) {
                    $ext =[System.IO.Path]::GetExtension($filePath)
                    switch ($ext) { ".html" { $response.ContentType = "text/html" } ".js" { $response.ContentType = "application/javascript" } ".css" { $response.ContentType = "text/css" } default { $response.ContentType = "application/octet-stream" } }
                    $buffer =[System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $buffer.Length; $response.OutputStream.Write($buffer, 0, $buffer.Length)
                } else { $response.StatusCode = 404 }
            }
            $response.OutputStream.Close()
        }
    }
} catch [System.Management.Automation.PipelineStoppedException] {
} catch {
    Write-Host "`n> Server logic error: $_" -ForegroundColor Red
} finally {
    if ($null -ne $listener) { $listener.Stop(); $listener.Close(); Write-Host "`n> Server stopped." -ForegroundColor Gray }
}