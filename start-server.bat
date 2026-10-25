@echo off
title WEBESCENO - Servidor de Prototipado Teatral
echo ======================================================
echo    Iniciando servidor local de WEBESCENO en puerto 8080...
echo ======================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
