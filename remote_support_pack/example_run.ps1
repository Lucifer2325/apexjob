# Example run script for Remote Support Pack

# Run with zip output
.\diagnostic.ps1 -OutputDir RSP_Report -Zip

# Run with cleanup (be careful, deletes temp files older than 7 days)
#.\diagnostic.ps1 -OutputDir RSP_Report -PerformCleanup -Zip

Write-Output "Done. Check the RSP_Report folder."