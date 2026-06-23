# ShadowAnalyst Launcher
# Запускает приложение. При блокировке Groq API — автоматически поднимается
# SSH SOCKS5 туннель внутри приложения (не нужно запускать вручную).
# Этот скрипт просто удобный ярлык запуска.

$ErrorActionPreference = "Continue"
$AppDir = "C:\Clinic_MVP\ShadowAnalyst\gui"
$Python  = "C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe"

Write-Host "=== ShadowAnalyst X-Ray Analyzer ===" -ForegroundColor Cyan
Write-Host "VPN туннель активируется автоматически при блокировке Groq API" -ForegroundColor Green
Write-Host ""

Set-Location $AppDir
& $Python app.py
