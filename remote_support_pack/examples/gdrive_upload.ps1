<#
Example: Google Drive Upload
Upload RSP reports to Google Drive for centralized storage & sharing.

Prerequisites:
1. Install Google Drive client or use rclone
   - Download: https://rclone.org/downloads/
   - Setup: rclone config

2. Configure rclone:
   rclone config
   - Name: google_drive
   - Type: Google Drive
   - Follow OAuth flow to authorize
   - Save config

3. Test rclone:
   rclone ls google_drive:

Then run this script to auto-upload reports.

#>

param(
    [string]$ReportPath = "C:\IT_Reports",
    [string]$GoogleDrivePath = "RSP_Reports",  # Folder in Google Drive
    [switch]$DeleteLocalAfterUpload
)

# Verify rclone is installed
$rclonePath = "C:\Program Files\rclone\rclone.exe"
if (-not (Test-Path $rclonePath)) {
    Write-Error "rclone not found at $rclonePath"
    Write-Output "Download rclone: https://rclone.org/downloads/"
    exit 1
}

# Find latest ZIP report
$latestReport = Get-ChildItem -Path $ReportPath -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if (-not $latestReport) {
    Write-Error "No ZIP reports found in $ReportPath"
    exit 1
}

# Upload to Google Drive
Write-Output "Uploading $($latestReport.Name) to Google Drive..."

try {
    & $rclonePath copy $latestReport.FullName "google_drive:$GoogleDrivePath" -P
    Write-Output "✓ Upload completed successfully"
    
    # Optional: Delete local copy after successful upload
    if ($DeleteLocalAfterUpload) {
        Remove-Item -Path $latestReport.FullName -Force
        Write-Output "✓ Local copy deleted"
    }
} catch {
    Write-Error "Upload failed: $_"
    exit 1
}

# List recent uploads
Write-Output "Recent reports in Google Drive:"
& $rclonePath ls "google_drive:$GoogleDrivePath" -R | Select-Object -Last 5

Write-Output "`nUpload task completed at $(Get-Date)"
