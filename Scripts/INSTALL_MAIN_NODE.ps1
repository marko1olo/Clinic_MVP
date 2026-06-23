try {
    # 1. Admin check
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-Not $isAdmin) {
        Write-Host "Requesting Administrator rights..." -ForegroundColor Yellow
        $myArgs = "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`""
        Start-Process powershell.exe -Verb RunAs -ArgumentList $myArgs
        Exit
    }

    $MVP_Dir = "C:\Clinic_MVP"
    if ($PSScriptRoot -ne $MVP_Dir) {
        Write-Host "Warning: Please ensure Clinic_MVP is at C:\Clinic_MVP" -ForegroundColor Yellow
    }

    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "AUTOMATIC SETUP MAIN LAPTOP" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan

    # 2. Network Share
    Write-Host "1. Setting up Dropzone_XRay network share..." -ForegroundColor Yellow
    & "$MVP_Dir\setup_network_share.ps1"

    # 3. Python Libs
    Write-Host "2. Installing Python AI/MQTT dependencies..." -ForegroundColor Yellow
    Set-Location "$MVP_Dir\ShadowAnalyst"
    pip install -r requirements.txt | Out-Null
    Write-Host "Dependencies installed." -ForegroundColor Green

    # 4. Autostart
    Write-Host "3. Adding ShadowAnalyst to Windows Startup..." -ForegroundColor Yellow
    $WshShell = New-Object -comObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\ShadowAnalyst.lnk")
    $Shortcut.TargetPath = "pythonw.exe"
    $Shortcut.Arguments = "$MVP_Dir\ShadowAnalyst\gui\app.py"
    $Shortcut.WorkingDirectory = "$MVP_Dir\ShadowAnalyst"
    $Shortcut.WindowStyle = 1
    $Shortcut.Save()
    Write-Host "Added to autostart." -ForegroundColor Green

    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "INSTALLATION COMPLETED SUCCESSFULLY!" -ForegroundColor White
    Write-Host "This laptop is ready to receive and analyze X-rays."
    Write-Host "=============================================" -ForegroundColor Cyan

} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Press Enter to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
