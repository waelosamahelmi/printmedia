$ErrorActionPreference = 'Stop'

# Resolve project root from this script location.
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

$dbPort = 3306
$appPort = 3000
$dbExe = "C:\Program Files\MariaDB 12.2\bin\mariadbd.exe"
$dbDataDir = "C:\Program Files\MariaDB 12.2\data"

function Test-PortListening {
  param([int]$Port)
  $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
  return $null -ne $conn
}

function Get-PortOwner {
  param([int]$Port)
  $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($null -eq $conn) {
    return $null
  }

  $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
  if ($null -eq $proc) {
    return [PSCustomObject]@{ Pid = $conn.OwningProcess; Name = 'unknown' }
  }

  return [PSCustomObject]@{ Pid = $proc.Id; Name = $proc.ProcessName }
}

Write-Host "[dev:local] Project: $projectRoot"

if (Test-PortListening -Port $dbPort) {
  Write-Host "[dev:local] MariaDB already listening on port $dbPort"
} else {
  if (-not (Test-Path $dbExe)) {
    Write-Error "MariaDB executable not found at: $dbExe"
  }

  Write-Host "[dev:local] Starting MariaDB on port $dbPort..."
  Start-Process -FilePath $dbExe -ArgumentList @(
    "--datadir=$dbDataDir",
    "--port=$dbPort",
    "--bind-address=127.0.0.1"
  ) | Out-Null

  Start-Sleep -Seconds 2
  if (-not (Test-PortListening -Port $dbPort)) {
    Write-Error "MariaDB did not start on port $dbPort"
  }

  Write-Host "[dev:local] MariaDB started"
}

Write-Host "[dev:local] Starting Next.js dev server..."
if (Test-PortListening -Port $appPort) {
  $owner = Get-PortOwner -Port $appPort
  if ($null -ne $owner -and $owner.Name -ieq 'node') {
    Write-Host "[dev:local] Port $appPort used by stale node process ($($owner.Pid)); stopping it"
    Stop-Process -Id $owner.Pid -Force
    Start-Sleep -Seconds 1
  } else {
    Write-Host "[dev:local] Port $appPort is used by another process; starting Next.js on 3001"
    $appPort = 3001
  }
}

if ($appPort -eq 3000) {
  npm run dev -- -p 3000
} else {
  npm run dev -- -p 3001
}
