@echo off
title Демонстрация загрузки рентген-снимка
echo ===================================================
echo [ДЕМО] Копируем тестовый снимок в папку Dropzone_XRay...
echo ===================================================

if not exist "C:\Clinic_MVP\Dropzone_XRay" mkdir "C:\Clinic_MVP\Dropzone_XRay"

:: Берем случайный тестовый снимок (xray_1.jpg)
copy "C:\Clinic_MVP\Sample_Images\xray_1.jpg" "C:\Clinic_MVP\Dropzone_XRay\demo_test_xray.jpg" /Y

echo.
echo Снимок "demo_test_xray.jpg" успешно загружен в сеть!
echo Теперь Анализатор (если он запущен) должен его подхватить,
echo отправить в ИИ и через несколько секунд показать всплывающее окно!
echo.
pause
