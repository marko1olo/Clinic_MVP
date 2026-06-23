@echo off
title ShadowAnalyst EXE Builder
echo ===================================================
echo   ShadowAnalyst Compact Executable Builder
echo ===================================================
echo.
echo [INFO] Excluded: PyTorch, Pandas, Matplotlib, SciPy, Qt, and other bloat.
echo [INFO] Bundled: FastAPI backend + Webview frontend.
echo.

:: Clean up previous build/dist folders if present
if exist build (
    echo [CLEAN] Removing old build directory...
    rd /s /q build
)
if exist dist (
    echo [CLEAN] Removing old dist directory...
    rd /s /q dist
)

echo [BUILD] Running PyInstaller build using ShadowAnalyst.spec...
"C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe" -m PyInstaller --clean ShadowAnalyst.spec

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] PyInstaller build failed!
    echo Please make sure pyinstaller is installed: pip install pyinstaller
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   BUILD COMPLETED SUCCESSFULLY!
echo ===================================================
echo.

if exist dist\ShadowAnalyst.exe (
    copy /y dist\ShadowAnalyst.exe .
    echo [INFO] Copied generated ShadowAnalyst.exe to main root directory.
    for %%I in (dist\ShadowAnalyst.exe) do (
        set /a size_mb=%%~zI / 1024 / 1024
        echo Executable: dist\ShadowAnalyst.exe
        echo Final Size: ~%%~zI bytes ^(!size_mb! MB^)
    )
) else (
    echo [WARNING] Could not find dist\ShadowAnalyst.exe! Check output logs.
)

pause
