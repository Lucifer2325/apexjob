<#
Example: Slack Webhook Integration
Post diagnostic alerts to Slack when critical issues are found.

Setup:
1. Create a Slack Incoming Webhook:
   - Go to https://api.slack.com/apps
   - Create New App → From scratch
   - App name: "System Diagnostics Bot"
   - Pick your workspace
   - Go to "Incoming Webhooks" → Add New Webhook
   - Copy the webhook URL
   - Save it to config.ps1

2. Save config.ps1 with your webhook:
   $SlackWebhookUrl = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

3. Run: .\slack_integration.ps1

NOTE: Never commit config.ps1 to GitHub (contains webhook URL)
#>

# Configuration (store in separate file or environment variable)
$config = @{
    SlackWebhookUrl = $env:SLACK_WEBHOOK_URL  # Set via environment variable
    ReportPath      = "C:\IT_Reports"
}

if (-not $config.SlackWebhookUrl) {
    Write-Error "SLACK_WEBHOOK_URL environment variable not set"
    exit 1
}

# Run diagnostic
$diagnostic = Join-Path -Path $PSScriptRoot -ChildPath "..\diagnostic.ps1"
& $diagnostic -OutputDir $config.ReportPath -Zip

# Get latest report
$latestReport = Get-ChildItem -Path $config.ReportPath -Filter "*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

# Parse report for critical issues
$reportPath = $latestReport.FullName -replace '\.zip$', ''
$criticalIssues = @()

# Check disk space
if (Test-Path "$reportPath\disk_usage.txt") {
    $diskContent = Get-Content "$reportPath\disk_usage.txt"
    if ($diskContent -match "([0-9.]+)%") {
        $usedPercent = [decimal]($matches[1])
        if ($usedPercent -gt 90) {
            $criticalIssues += "🔴 Disk space critical: ${usedPercent}% used"
        }
    }
}

# Check processes
if (Test-Path "$reportPath\processes.txt") {
    $processContent = Get-Content "$reportPath\processes.txt"
    if ($processContent -match "svchost.*\s([0-9]+)%") {
        $cpuPercent = [decimal]($matches[1])
        if ($cpuPercent -gt 80) {
            $criticalIssues += "🟠 High CPU detected: ${cpuPercent}% by svchost"
        }
    }
}

# Send to Slack
if ($criticalIssues.Count -gt 0) {
    $slackMessage = @{
        text = "System Diagnostic Alert on $($env:COMPUTERNAME)"
        blocks = @(
            @{
                type = "header"
                text = @{
                    type = "plain_text"
                    text = "System Health Alert"
                }
            }
            @{
                type = "section"
                text = @{
                    type = "mrkdwn"
                    text = ($criticalIssues -join "`n")
                }
            }
            @{
                type = "context"
                elements = @(
                    @{
                        type = "mrkdwn"
                        text = "Report: $($latestReport.Name) | Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
                    }
                )
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri $config.SlackWebhookUrl -Method Post -Body $slackMessage -ContentType 'application/json'
        Write-Output "Slack notification sent successfully"
    } catch {
        Write-Error "Failed to send Slack notification: $_"
    }
} else {
    Write-Output "No critical issues detected"
}
