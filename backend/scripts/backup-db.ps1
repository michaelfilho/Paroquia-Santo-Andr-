param(
  [string]$DbPath = "..\db\paroquia.db",
  [string]$BackupDir = "..\db\backups"
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$dbFullPath = Resolve-Path (Join-Path $scriptRoot $DbPath)
$backupFullDir = Join-Path $scriptRoot $BackupDir

if (-not (Test-Path $dbFullPath)) {
  throw "Banco nao encontrado: $dbFullPath"
}

if (-not (Test-Path $backupFullDir)) {
  New-Item -ItemType Directory -Path $backupFullDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFile = Join-Path $backupFullDir ("paroquia-$timestamp.db")

Copy-Item -Path $dbFullPath -Destination $backupFile -Force

Write-Host "Backup criado: $backupFile"
