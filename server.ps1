# Servidor estático local para WEBESCENO
param([int]$Port = 8080)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "No se pudo iniciar el servidor en el puerto $Port. Comprueba permisos o si el puerto está en uso."
    exit 1
}

Write-Host "=========================================================="
Write-Host "   WEBESCENO - Servidor de Prototipado Escenográfico 3D   "
Write-Host "   Accede a la plataforma en: $prefix"
Write-Host "   Presiona Ctrl+C para detener el servidor"
Write-Host "=========================================================="

$baseDir = $PSScriptRoot
if (-not $baseDir) { $baseDir = Get-Location }

$mimeTypes = @{
    ".html"   = "text/html; charset=utf-8"
    ".htm"    = "text/html; charset=utf-8"
    ".css"    = "text/css; charset=utf-8"
    ".js"     = "application/javascript; charset=utf-8"
    ".mjs"    = "application/javascript; charset=utf-8"
    ".json"   = "application/json; charset=utf-8"
    ".png"    = "image/png"
    ".jpg"    = "image/jpeg"
    ".jpeg"   = "image/jpeg"
    ".gif"    = "image/gif"
    ".svg"    = "image/svg+xml"
    ".ico"    = "image/x-icon"
    ".woff"   = "font/woff"
    ".woff2"  = "font/woff2"
    ".ttf"    = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $rawPath = $request.RawUrl.Split('?')[0]
        if ($rawPath -eq "/" -or $rawPath -eq "") { 
            $rawPath = "/index.html" 
        }
        
        $safePath = [System.Uri]::UnescapeDataString($rawPath.TrimStart('/'))
        $filePath = Join-Path $baseDir $safePath
        
        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }
            
            $response.ContentType = $mime
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
            
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<html><body><h2>404 - Archivo no encontrado</h2><p>$safePath</p></body></html>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
