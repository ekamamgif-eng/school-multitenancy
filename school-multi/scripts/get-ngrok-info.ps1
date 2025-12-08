$response = Invoke-RestMethod -Uri http://127.0.0.1:4040/api/tunnels

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   NGROK TUNNEL INFORMATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

if ($response.tunnels.Count -eq 0) {
    Write-Host "No active tunnels found!" -ForegroundColor Red
} else {
    foreach ($tunnel in $response.tunnels) {
        Write-Host "Tunnel Name: $($tunnel.name)" -ForegroundColor Green
        Write-Host "Public URL:  $($tunnel.public_url)" -ForegroundColor Yellow
        Write-Host "Protocol:    $($tunnel.proto)" -ForegroundColor White
        Write-Host "Local:       $($tunnel.config.addr)" -ForegroundColor White
        Write-Host "Region:      $($tunnel.region)" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host "========================================`n" -ForegroundColor Cyan
