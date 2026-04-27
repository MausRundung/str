@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "INSTALL_DIR=%ProgramFiles%\str"
if not "%~1"=="" set "INSTALL_DIR=%~1"

fltmc >nul 2>&1
if errorlevel 1 (
  echo Requesting administrator privileges...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -Verb RunAs -FilePath '%~f0' -ArgumentList @('%INSTALL_DIR%')"
  exit /b 0
)

if not exist "%SCRIPT_DIR%str.ps1" (
  echo ERROR: str.ps1 not found next to setup.bat
  pause
  exit /b 1
)

echo Installing to: %INSTALL_DIR%
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%str.ps1" install --machine --dir "%INSTALL_DIR%" --force
if errorlevel 1 (
  echo.
  echo ERROR: install failed
  pause
  exit /b 1
)

echo.
echo Finalizing...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$dst='%INSTALL_DIR%'.Trim().TrimEnd('\');" ^
  "if(-not (Test-Path -LiteralPath $dst -PathType Container)){ New-Item -ItemType Directory -Path $dst -Force | Out-Null }" ^
  "if(Test-Path -LiteralPath (Join-Path $dst 'str.ps1') -PathType Leaf){ Move-Item -LiteralPath (Join-Path $dst 'str.ps1') -Destination (Join-Path $dst 'str-main.ps1') -Force }" ^
  "if(-not (Test-Path -LiteralPath (Join-Path $dst 'str-main.ps1') -PathType Leaf)){ throw 'Missing str-main.ps1 in install directory.' }" ^
  "$cmd='@echo off`r`npowershell -NoProfile -ExecutionPolicy Bypass -File \"%%~dp0str-main.ps1\" %%*`r`n';" ^
  "Set-Content -LiteralPath (Join-Path $dst 'str.cmd') -Value $cmd -Encoding ASCII -Force;" ^
  "$current=[Environment]::GetEnvironmentVariable('Path',[EnvironmentVariableTarget]::Machine);" ^
  "if(-not $current){ $current='' }" ^
  "$parts=$current -split ';' | ForEach-Object { $_.Trim().TrimEnd('\') } | Where-Object { $_ };" ^
  "if(-not ($parts | Where-Object { $_ -ieq $dst })){" ^
  "  $new=($current.TrimEnd(';')+';'+$dst).Trim(';');" ^
  "  [Environment]::SetEnvironmentVariable('Path',$new,[EnvironmentVariableTarget]::Machine);" ^
  "}" ^
  "try{" ^
  "  Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition '[System.Runtime.InteropServices.DllImport(^"user32.dll^", SetLastError=true, CharSet=System.Runtime.InteropServices.CharSet.Auto)] public static extern System.IntPtr SendMessageTimeout(System.IntPtr hWnd, int Msg, System.IntPtr wParam, string lParam, int fuFlags, int uTimeout, out System.IntPtr lpdwResult);' -ErrorAction SilentlyContinue | Out-Null;" ^
  "  $HWND_BROADCAST=[IntPtr]0xffff; $WM_SETTINGCHANGE=0x001A; $SMTO_ABORTIFHUNG=0x0002; $result=[IntPtr]::Zero;" ^
  "  [Win32.NativeMethods]::SendMessageTimeout($HWND_BROADCAST,$WM_SETTINGCHANGE,[IntPtr]::Zero,'Environment',$SMTO_ABORTIFHUNG,2000,[ref]$result) | Out-Null;" ^
  "}catch{}"
if errorlevel 1 (
  echo.
  echo ERROR: finalization failed
  pause
  exit /b 1
)

echo Installed.
echo %PATH% | find /I "%INSTALL_DIR%" >nul 2>&1
if errorlevel 1 set "PATH=%PATH%;%INSTALL_DIR%"
echo Open a new terminal and run: str help
pause
