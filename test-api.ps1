# Testar login
$loginBody = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

$loginData = $loginResponse.Content | ConvertFrom-Json
Write-Host "✅ Login successful!" -ForegroundColor Green
Write-Host "Token: $($loginData.token)" -ForegroundColor Cyan
$token = $loginData.token

# Testar criar evento
$eventBody = @{
    title = "Missa de Domingo"
    date = (Get-Date).AddDays(7).ToString("o")
    location = "Igreja Principal"
    description = "Missa solene do domingo"
    acceptsRegistration = $true
} | ConvertTo-Json

$eventResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/events" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{Authorization = "Bearer $token"} `
    -Body $eventBody

$eventData = $eventResponse.Content | ConvertFrom-Json
Write-Host "✅ Event created!" -ForegroundColor Green
Write-Host "Event ID: $($eventData.id)" -ForegroundColor Cyan

# Testar listar eventos
$eventsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/events" `
    -Method Get `
    -Headers @{Authorization = "Bearer $token"}

$eventsData = $eventsResponse.Content | ConvertFrom-Json
Write-Host "✅ Listed events!" -ForegroundColor Green
Write-Host "Total events: $($eventsData.Count)" -ForegroundColor Cyan

# Testar inscrição pública (sem autenticação)
$inscriptionBody = @{
    eventId = $eventData.id
    name = "João Silva"
    email = "joao@example.com"
    phone = "(11) 99999-9999"
} | ConvertTo-Json

$inscriptionResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/inscriptions" `
    -Method Post `
    -ContentType "application/json" `
    -Body $inscriptionBody

$inscriptionData = $inscriptionResponse.Content | ConvertFrom-Json
Write-Host "✅ Public inscription created!" -ForegroundColor Green
Write-Host "Inscription ID: $($inscriptionData.id)" -ForegroundColor Cyan
