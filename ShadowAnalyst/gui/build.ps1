Set-Location C:\Clinic_MVP\ShadowAnalyst\gui
C:\Users\Admin\AppData\Local\Programs\Python\Python313\python.exe -m PyInstaller --name ShadowAnalyst `
            --onedir `
            --windowed `
            --add-data "static;static" `
            --add-data "templates;templates" `
            --add-data "config.json;." `
            --add-data "database.py;." `
            --add-data "8024.pt;." `
            --add-data "..\dentalimage.md;." `
            --add-data "..\dentalimage_critic.md;." `
            --hidden-import uvicorn.logging `
            --hidden-import uvicorn.loops `
            --hidden-import uvicorn.loops.auto `
            --hidden-import uvicorn.protocols `
            --hidden-import uvicorn.protocols.http `
            --hidden-import uvicorn.protocols.http.auto `
            --hidden-import uvicorn.protocols.websockets `
            --hidden-import uvicorn.protocols.websockets.auto `
            --hidden-import uvicorn.lifespan `
            --hidden-import uvicorn.lifespan.on `
            --hidden-import pydicom.encoders.gdcm `
            --hidden-import pydicom.encoders.pylibjpeg `
            --hidden-import edge_tts `
            --hidden-import sqlite3 `
            --hidden-import watchdog `
            --collect-all ultralytics `
            --collect-all torch `
            app.py

Write-Host "Zipping the directory..."
Compress-Archive -Path "dist\ShadowAnalyst" -DestinationPath "C:\Clinic_MVP\ShadowAnalyst_AI.zip" -Force
Write-Host "Build complete! Zip archive is at C:\Clinic_MVP\ShadowAnalyst_AI.zip"
