<#
Example: Monthly Scheduled Diagnostic
Use this script with Windows Task Scheduler to run RSP monthly
and store reports in a centralized location.

Setup:
1. Save this script to C:\IT_Tools\monthly_check.ps1
2. Open Task Scheduler
3. Create basic task:
   - Name: "Monthly System Diagnostic"
   - Trigger: Monthly (e.g., 1st of each month at 3 AM)
   - Action: Run PowerShell script
   - Script: C:\IT_Tools\monthly_check.ps1
   - Run with highest privileges: YES

#>

param(
    [string]$ReportPath = "C:\IT_Reports\Monthly_Diagnostics",
    [string]$ArchiveAfterDays = 90
)

# Ensure paths exist
if (-not (Test-Path $ReportPath)) {
    New-Item -Path $ReportPath -ItemType Directory -Force | Out-Null
}

# Run diagnostic
$diagnostic = Join-Path -Path $PSScriptRoot -ChildPath "diagnostic.ps1"

if (Test-Path $diagnostic) {
    & $diagnostic -OutputDir $ReportPath -Zip
    Write-Output "Monthly diagnostic completed: $(Get-Date)"
} else {
    Write-Error "diagnostic.ps1 not found at $diagnostic"
    exit 1
}

# Archive old reports (optional: clean up after 90 days)
$cutoffDate = (Get-Date).AddDays(-$ArchiveAfterDays)
Get-ChildItem -Path $ReportPath -Filter "*.zip" | Where-Object {
    $_.LastWriteTime -lt $cutoffDate
} | ForEach-Object {
    Remove-Item -Path $_.FullName -Force
    Write-Output "Archived: $($_.Name)"
}

Write-Output "Task completed at $(Get-Date)"

# Log execution for monitoring
Add-Content -Path "$ReportPath\task_log.txt" -Value "Completed: $(Get-Date)"
