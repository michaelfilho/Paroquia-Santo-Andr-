param(
  [string]$HostIp = "192.168.1.221",
  [int]$FrontendPort = 5173,
  [int]$BackendPort = 3000
)

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"

if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
  Write-Error "package.json não encontrado na raiz do projeto: $projectRoot"
  exit 1
}

if (-not (Test-Path (Join-Path $backendPath "package.json"))) {
  Write-Error "package.json do backend não encontrado em: $backendPath"
  exit 1
}

$backendCommand = "Set-Location '$backendPath'; `$env:PORT='$BackendPort'; `$env:FRONTEND_URL='http://${HostIp}:$FrontendPort'; npm run dev"
$frontendCommand = "Set-Location '$projectRoot'; `$env:VITE_API_BASE_URL='/api'; npx vite"

$startBackend = $true
$backendConn = Get-NetTCPConnection -LocalPort $BackendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($backendConn) {
  try {
    $health = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$BackendPort/api/health" -TimeoutSec 3
    if ($health.StatusCode -ge 200 -and $health.StatusCode -lt 300) {
      Write-Host "Backend já está ativo na porta $BackendPort (PID $($backendConn.OwningProcess))."
      $startBackend = $false
    }
  } catch {
    Write-Warning "A porta $BackendPort já está em uso (PID $($backendConn.OwningProcess))."
    Write-Warning "Feche o processo que está usando essa porta ou altere -BackendPort."
    $startBackend = $false
  }
}

$startFrontend = $true
$frontendConn = Get-NetTCPConnection -LocalPort $FrontendPort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($frontendConn) {
  Write-Host "Frontend já está ativo na porta $FrontendPort (PID $($frontendConn.OwningProcess))."
  $startFrontend = $false
}

if ($startBackend) {
  Start-Process powershell -ArgumentList @('-NoExit', '-Command', $backendCommand) | Out-Null
  Start-Sleep -Seconds 1
}

if ($startFrontend) {
  Start-Process powershell -ArgumentList @('-NoExit', '-Command', $frontendCommand) | Out-Null
}

Write-Host "Backend iniciando em http://${HostIp}:$BackendPort"
Write-Host "Frontend iniciando em http://${HostIp}:$FrontendPort"
Write-Host "Acesse no celular: http://${HostIp}:$FrontendPort"