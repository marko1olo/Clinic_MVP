# rebuild.ps1 - Kill processes, clear locked files, rebuild EXE

Write-Host "[1] Killing any running ShadowAnalyst processes..."
Get-Process | Where-Object { $_.Name -like "*Shadow*" -or $_.MainWindowTitle -like "*Shadow*" } | ForEach-Object {
    Write-Host "  Killing PID $($_.Id): $($_.Name)"
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

Write-Host "[2] Removing locked EXE files..."
$targets = @(
    "C:\Clinic_MVP\ShadowAnalyst\gui\dist\ShadowAnalyst.exe",
    "C:\Clinic_MVP\ShadowAnalyst.exe"
)
foreach ($f in $targets) {
    if (Test-Path $f) {
        try {
            Remove-Item $f -Force -ErrorAction Stop
            Write-Host "  Deleted: $f"
        } catch {
            Write-Host "  Failed to delete $f - trying with cmd..."
            cmd /c "del /F /Q `"$f`"" 2>$null
        }
    }
}

Write-Host "[3] Removing build/dist folders..."
Remove-Item "C:\Clinic_MVP\ShadowAnalyst\gui\build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "C:\Clinic_MVP\ShadowAnalyst\gui\dist"  -Recurse -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

Write-Host "[4] Starting PyInstaller build..."
$py = "C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe"
& $py -m PyInstaller --clean ShadowAnalyst.spec
$exitCode = $LASTEXITCODE

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "[5] Build SUCCESS. Copying to root..."
    Copy-Item "C:\Clinic_MVP\ShadowAnalyst\gui\dist\ShadowAnalyst.exe" "C:\Clinic_MVP\ShadowAnalyst.exe" -Force
    $size = [math]::Round((Get-Item "C:\Clinic_MVP\ShadowAnalyst.exe").Length / 1MB, 1)
    Write-Host "  Done! C:\Clinic_MVP\ShadowAnalyst.exe — $size MB"
} else {
    Write-Host ""
    Write-Host "[ERROR] Build FAILED with exit code $exitCode"
    exit $exitCode
}
