try {
    $isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if (-Not $isAdmin) {
        Write-Host "Requesting Admin privileges..." -ForegroundColor Yellow
        $args = "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$PSCommandPath`""
        Start-Process powershell.exe -Verb RunAs -ArgumentList $args
        Exit
    }

    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "SETUP NETWORK SHARE FOR DROPZONE_XRAY" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan

    $SharePath = "C:\Clinic_MVP\Dropzone_XRay"

    if (-Not (Test-Path $SharePath)) {
        New-Item -Path $SharePath -ItemType Directory -Force | Out-Null
        Write-Host "Directory created: $SharePath" -ForegroundColor Green
    } else {
        Write-Host "Directory already exists: $SharePath" -ForegroundColor Green
    }

    Write-Host "Configuring Windows Firewall..." -ForegroundColor Cyan
    $rules = @("@FirewallAPI.dll,-28502", "@FirewallAPI.dll,-28505")
    foreach ($rule in $rules) {
        netsh advfirewall firewall set rule group="$rule" new enable=Yes 2>$null | Out-Null
    }

    Write-Host "Creating SMB Share..." -ForegroundColor Cyan
    $existing = Get-SmbShare -Name "Dropzone_XRay" -ErrorAction SilentlyContinue
    if (-not $existing) {
        New-SmbShare -Name "Dropzone_XRay" -Path $SharePath -FullAccess "*S-1-5-11" | Out-Null
        Write-Host "Share created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Share already exists." -ForegroundColor Yellow
    }

    Write-Host "Setting NTFS permissions..." -ForegroundColor Cyan
    $Acl = Get-Acl $SharePath
    $sid = New-Object System.Security.Principal.SecurityIdentifier("S-1-5-11")
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow")
    $Acl.SetAccessRule($rule)
    Set-Acl $SharePath $Acl
    Write-Host "NTFS permissions applied successfully!" -ForegroundColor Green

    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "DONE! PATH FOR OTHER LAPTOPS:" -ForegroundColor White
    Write-Host "\\$env:COMPUTERNAME\Dropzone_XRay" -ForegroundColor Yellow
    Write-Host "=============================================" -ForegroundColor Cyan

} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "Press Enter to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
