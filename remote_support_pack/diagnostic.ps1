<#
Remote Support Pack - diagnostic.ps1
Collects system diagnostics and creates a report.
Usage examples in README.md
#>

param(
    [string]$OutputDir = "RSP_Report",
    [switch]$PerformCleanup,
    [switch]$Zip
)

$timestamp = (Get-Date -Format "yyyyMMdd_HHmmss")
$baseOut = Join-Path -Path (Resolve-Path .).ProviderPath -ChildPath $OutputDir
$out = Join-Path -Path $baseOut -ChildPath $timestamp
New-Item -Path $out -ItemType Directory -Force | Out-Null

function Log { param($name,$obj) $obj | Out-File -FilePath (Join-Path $out $name) -Encoding UTF8 }

"Starting Remote Support Pack diagnostics at $(Get-Date)" | Out-File -FilePath (Join-Path $out "run.log") -Append

Log "computerinfo.txt" (Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,OsName,OsArchitecture,CsName,OsBuildNumber)

try { Get-CimInstance -ClassName Win32_OperatingSystem | Select-Object Caption,BuildNumber,LastBootUpTime | Log "os.txt" } catch {}

try { Get-Volume | Format-List * | Out-File (Join-Path $out "volumes.txt") -Encoding UTF8 } catch {}

try { Get-Process | Sort-Object CPU -Descending | Select-Object -First 50 | Out-File (Join-Path $out "processes.txt") -Encoding UTF8 } catch {}

try { Get-Service | Sort-Object Status | Out-File (Join-Path $out "services.txt") -Encoding UTF8 } catch {}

try { Get-NetAdapter -ErrorAction SilentlyContinue | Format-List * | Out-File (Join-Path $out "network_adapters.txt") -Encoding UTF8 } catch {}

try { Get-EventLog -LogName System -Newest 200 | Out-File (Join-Path $out "system_events.txt") -Encoding UTF8 } catch { }
try { Get-EventLog -LogName Application -Newest 200 | Out-File (Join-Path $out "application_events.txt") -Encoding UTF8 } catch { }

# Disk usage summary
Get-PSDrive -PSProvider FileSystem | Select-Object Name,Used,Free | Out-File (Join-Path $out "disk_usage.txt") -Encoding UTF8

# Simple connectivity checks
$hostsToTest = @('8.8.8.8','google.com')
$connectivity = foreach ($h in $hostsToTest) {
    Test-NetConnection -ComputerName $h -InformationLevel Quiet
}
$connectivity | Out-File (Join-Path $out "connectivity.txt") -Encoding UTF8

# Optional cleanup (safe default: only delete temp files older than 7 days when PerformCleanup is used)
if ($PerformCleanup) {
    "Performing cleanup run at $(Get-Date)" | Out-File (Join-Path $out "run.log") -Append
    try {
        $tempPath = $env:TEMP
        Get-ChildItem -Path $tempPath -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        "Cleanup: removed old temp files" | Out-File (Join-Path $out "run.log") -Append
    } catch {
        "Cleanup errors: $_" | Out-File (Join-Path $out "run.log") -Append
    }
}

# Create a compressed report if requested
if ($Zip) {
    $zipPath = "$baseOut\RSP_Report_$timestamp.zip"
    try {
        Compress-Archive -Path $out\* -DestinationPath $zipPath -Force
        "Created zip at $zipPath" | Out-File (Join-Path $out "run.log") -Append
    } catch {
        "Zip failed: $_" | Out-File (Join-Path $out "run.log") -Append
    }
}

"Diagnostics completed at $(Get-Date)" | Out-File (Join-Path $out "run.log") -Append

Write-Output "Report generated: $out"

# End of script
