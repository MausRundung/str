@echo off
setlocal EnableExtensions

set "SCRIPT_DIR=%~dp0"
set "INSTALL_DIR=%ProgramFiles%\str"
if not "%~1"=="" set "INSTALL_DIR=%~1"

fltmc >nul 2>&1
if errorlevel 1 (
  echo Requesting administrator privileges...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%ComSpec%' -ArgumentList '/c \"\"%~f0\" \"%INSTALL_DIR%\"\"' -Verb RunAs"
  exit /b
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
echo Installed. Open a new terminal and run: str help
pause
