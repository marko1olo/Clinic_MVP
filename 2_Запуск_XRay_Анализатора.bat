@echo off
title ShadowAnalyst - X-Ray AI App Launcher
echo ===================================================
echo Starting ShadowAnalyst Graphical User Interface...
echo ===================================================
echo.
echo [VPN] SSH SOCKS5 tunnel auto-activates on Groq API block.
echo.
"C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe" "C:\Clinic_MVP\ShadowAnalyst\gui\app.py"
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to start ShadowAnalyst application.
    echo Please make sure python is installed and dependencies are met.
    pause
)
