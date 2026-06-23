Write-Host "Starting laptop optimization for server role..." -ForegroundColor Green

# Disable Sleep (Standby) and Display timeout on AC power
powercfg -x -standby-timeout-ac 0
powercfg -x -monitor-timeout-ac 0
Write-Host "[x] Sleep mode and display timeout disabled on AC power." -ForegroundColor Cyan

# Disable Hibernation
powercfg -h off
Write-Host "[x] Hibernation disabled." -ForegroundColor Cyan

Write-Host "Laptop is now optimized for 24/7 server uptime." -ForegroundColor Green
Write-Host "Agents will run stably in the background." -ForegroundColor Yellow
