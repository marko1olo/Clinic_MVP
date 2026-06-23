@echo off
color 0A

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/k %~dpnx0' -Verb RunAs"
    exit /b
)

echo ==========================================================
echo Setting up network share for Dropzone_XRay...
echo ==========================================================

if not exist "C:\Clinic_MVP\Dropzone_XRay" mkdir "C:\Clinic_MVP\Dropzone_XRay"

netsh advfirewall firewall set rule group="Обнаружение сети" new enable=Yes >nul 2>&1
netsh advfirewall firewall set rule group="Общий доступ к файлам и принтерам" new enable=Yes >nul 2>&1
netsh advfirewall firewall set rule group="Network Discovery" new enable=Yes >nul 2>&1
netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes >nul 2>&1

net share Dropzone_XRay="C:\Clinic_MVP\Dropzone_XRay" /GRANT:Everyone,FULL >nul 2>&1
net share Dropzone_XRay="C:\Clinic_MVP\Dropzone_XRay" /GRANT:Все,FULL >nul 2>&1

icacls "C:\Clinic_MVP\Dropzone_XRay" /grant *S-1-1-0:(OI)(CI)F /T /C /Q >nul

echo.
echo ==========================================================
echo DONE! SHARE IS READY.
echo Path: \\%COMPUTERNAME%\Dropzone_XRay
echo ==========================================================
echo.
pause
