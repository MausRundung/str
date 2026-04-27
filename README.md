# str

Windows-friendly project architecture scanner + local viewer.

`str` scans a folder, extracts useful signals (imports, exports, routes, models, unused imports), prints a terminal report, and starts a local viewer UI in your browser.

## Install (recommended for end users)

1. Download the ZIP for the project and extract it.
2. Run `setup.bat` (it will prompt for Administrator).
3. Open a new terminal and run:

```powershell
str help
```

By default, `setup.bat` installs to `%ProgramFiles%\str` and adds that folder to the system PATH so `str` works everywhere.

## Install (PowerShell, current user)

If you don’t want an admin prompt, you can install to your user profile:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\str.ps1 install
```

## Usage

Scan the current folder:

```powershell
str .
```

Show only routes:

```powershell
str . -r
```

Detect unused imports (best-effort):

```powershell
str . -u
```

Full file dump to `export.md`:

```powershell
str . ff
```

## Flags

Run:

```powershell
str help
```

## Uninstall

If you installed with `setup.bat` (machine install):

```powershell
str uninstall --machine
```

If you installed to your user profile (default PowerShell install):

```powershell
str uninstall
```

Notes:
- For `--machine`, run the terminal as Administrator (needed to remove from `%ProgramFiles%` and update system PATH).
- If you installed to a custom folder, include it: `str uninstall --machine --dir C:\Tools\str`

## Troubleshooting

- If `str` isn’t found after install, open a new terminal (PATH changes apply to new shells).
- If you see an execution policy error, use `setup.bat` or the PowerShell commands shown above (they run with `-ExecutionPolicy Bypass` for this tool).
