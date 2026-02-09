param(
  [string]$DbPath = "..\db\paroquia.db",
  [string]$BackupDir = "..\db\backups"
)

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$script = Join-Path $scriptRoot "backup-db.ps1"

& $script -DbPath $DbPath -BackupDir $BackupDir
