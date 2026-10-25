# Script de sincronización con GitHub para WEBESCENO
param(
    [string]$Token = ""
)

$gitExe = "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
if (-not (Test-Path $gitExe)) {
    $gitExe = "git"
}

$repoUrl = "https://github.com/quirogaanaliavanesa-gif/webesceno.git"

if ($Token -ne "") {
    $authUrl = "https://$($Token)@github.com/quirogaanaliavanesa-gif/webesceno.git"
    Write-Host "Configurando URL remota con autenticación por Token..."
    & $gitExe remote set-url origin $authUrl
} else {
    Write-Host "Utilizando URL remota estándar de GitHub..."
    & $gitExe remote set-url origin $repoUrl
}

Write-Host "Añadiendo archivos pendientes..."
& $gitExe add .

Write-Host "Creando commit..."
& $gitExe commit -m "feat: actualizacion de plataforma WEBESCENO" -q

Write-Host "Subiendo rama main a GitHub..."
& $gitExe push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "   ¡Archivos subidos exitosamente a GitHub!             " -ForegroundColor Green
    Write-Host "   Repositorio: $repoUrl" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Yellow
    Write-Host "   GitHub requiere autenticación (Token de Acceso Personal)" -ForegroundColor Yellow
    Write-Host "   Ejecuta: .\push-to-github.ps1 -Token TU_TOKEN_DE_GITHUB" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Yellow
}
