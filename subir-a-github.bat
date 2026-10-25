@echo off
title WEBESCENO - Subir a GitHub
echo ========================================================
echo    WEBESCENO - Subir archivos al repositorio de GitHub
echo    Repositorio: https://github.com/quirogaanaliavanesa-gif/webesceno
echo ========================================================
echo.
echo Para subir a GitHub sin contrasena, necesitas un
echo Personal Access Token (PAT) con permisos de "repo".
echo Puedes generarlo en: https://github.com/settings/tokens
echo.
set /p TOKEN="Ingresa tu Personal Access Token (o presiona Enter si ya tienes credenciales): "

if "%TOKEN%"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1"
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0push-to-github.ps1" -Token "%TOKEN%"
)

pause
