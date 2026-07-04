# Kill any running processes
Write-Host "Killing any running ShadowAnalyst processes..."
Get-Process | Where-Object { $_.Name -like "*Shadow*" -or $_.MainWindowTitle -like "*Shadow*" } | ForEach-Object {
    Write-Host "  Killing PID $($_.Id): $($_.Name)"
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

# Remove dist/build directories
Write-Host "Cleaning build folders..."
if (Test-Path "C:\Clinic_MVP\ShadowAnalyst\gui\build") {
    Remove-Item "C:\Clinic_MVP\ShadowAnalyst\gui\build" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "C:\Clinic_MVP\ShadowAnalyst\gui\dist") {
    Remove-Item "C:\Clinic_MVP\ShadowAnalyst\gui\dist" -Recurse -Force -ErrorAction SilentlyContinue
}

# Compile with PyInstaller
Write-Host "Running PyInstaller..."
Set-Location "C:\Clinic_MVP\ShadowAnalyst\gui"
$py = "C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe"
& $py -m PyInstaller --clean ShadowAnalyst.spec

# Copy to root
if ($LASTEXITCODE -eq 0) {
    Write-Host "Copying build to root..."
    Copy-Item "C:\Clinic_MVP\ShadowAnalyst\gui\dist\ShadowAnalyst.exe" "C:\Clinic_MVP\ShadowAnalyst.exe" -Force
    Write-Host "Successfully rebuilt and copied to C:\Clinic_MVP\ShadowAnalyst.exe"
} else {
    Write-Host "PyInstaller failed with exit code $LASTEXITCODE"
}
