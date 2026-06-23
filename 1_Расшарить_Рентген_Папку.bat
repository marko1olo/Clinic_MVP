@echo off
title Share Dropzone_XRay Folder
echo Starting share setup...
powershell -ExecutionPolicy Bypass -File "C:\Clinic_MVP\setup_network_share.ps1"
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Share configuration failed.
    pause
)
