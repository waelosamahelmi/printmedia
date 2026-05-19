param(
  [string]$Out = "tmp/incoming/1_puzzle_A4_15_auto.svg",
  [int]$Cols = 5,
  [int]$Rows = 3,
  [switch]$CutOnly
)

Set-Location "$PSScriptRoot\.."
$cutFlag = ""
if ($CutOnly) { $cutFlag = "--cut-only" }

python scripts/generate_puzzle_svg.py --out "$Out" --width 210 --height 297 --cols $Cols --rows $Rows $cutFlag
Write-Output "Generated: $Out"
