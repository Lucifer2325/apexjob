# Examples

Ready-to-use scripts that extend Remote Support Pack for common scenarios.

---

## Scripts Included

### 1. `monthly_check.ps1`
**Purpose**: Automated monthly diagnostics with report archival

**Use Case**: 
- Run every 1st of the month at 3 AM via Task Scheduler
- Collect historical diagnostics
- Automatically clean up old reports

**Setup**:
```powershell
# 1. Edit the script and set your paths
$ReportPath = "C:\IT_Reports\Monthly_Diagnostics"
$ArchiveAfterDays = 90

# 2. Open Task Scheduler (taskschd.msc)
# 3. Create Basic Task
#    - Name: "Monthly System Diagnostic"
#    - Trigger: Monthly, 1st of month, 3 AM
#    - Action: Run script with full path
#    - Run with highest privileges: YES

# 4. Or run manually:
.\monthly_check.ps1 -ReportPath "C:\IT_Reports" -ArchiveAfterDays 90
```

**Output**: Monthly timestamped ZIP reports in the report directory

---

### 2. `slack_integration.ps1`
**Purpose**: Post alerts to Slack when critical issues are detected

**Use Case**:
- Monitor disk space, CPU, errors
- Alert support team immediately on issues
- Integrate with existing Slack workflows

**Setup**:
```powershell
# 1. Create Slack Incoming Webhook
#    Go to: https://api.slack.com/apps
#    Create New App → Incoming Webhooks
#    Copy webhook URL

# 2. Set environment variable (secure way to store webhook)
$env:SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# 3. Run the script
.\slack_integration.ps1

# 4. Or schedule it:
#    Task Scheduler: Run after diagnostic completes
#    Trigger: On event log entry (System events)
```

**Alerts Triggered**:
- 🔴 Disk space > 90% used
- 🟠 CPU usage > 80%
- 🟡 Event log errors detected

**Output**: Slack message in your channel

---

### 3. `gdrive_upload.ps1`
**Purpose**: Automatically upload reports to Google Drive

**Use Case**:
- Centralized report storage across multiple machines
- Easy sharing with clients
- Backup reports in cloud
- Access reports from anywhere

**Setup**:
```powershell
# 1. Install rclone
#    Download: https://rclone.org/downloads/
#    Run installer

# 2. Configure rclone for Google Drive
rclone config
#    - Name your remote: "google_drive"
#    - Type: "Google Drive"
#    - Follow OAuth flow to authorize

# 3. Create folder in Google Drive
#    "RSP_Reports" (or your preferred name)

# 4. Run the script
.\gdrive_upload.ps1 -ReportPath "C:\IT_Reports" -GoogleDrivePath "RSP_Reports"

# 5. Or schedule it (after monthly_check.ps1 runs)
```

**Options**:
```powershell
# Upload and delete local copy
.\gdrive_upload.ps1 -DeleteLocalAfterUpload

# Upload to specific Google Drive folder
.\gdrive_upload.ps1 -GoogleDrivePath "Clients/ClientName/Reports"
```

**Output**: Reports uploaded to Google Drive, listed for verification

---

## Combining Examples

### Scenario: Complete Automated Workflow

```
3:00 AM - Run monthly_check.ps1
        ↓ (collects diagnostics)
        ↓
3:15 AM - Analyze for critical issues
        ↓ (if critical issues found)
        ↓ → Send Slack alert via slack_integration.ps1
        ↓ (if no issues, continue)
        ↓
3:30 AM - Upload to Google Drive via gdrive_upload.ps1
        ↓
3:35 AM - All done! Reports archived in cloud
```

**Task Scheduler Setup**:
```
Task 1: Monthly Diagnostic
├─ Time: 1st of month, 3:00 AM
├─ Script: monthly_check.ps1
└─ Run with: Highest privileges

Task 2: Slack Alert (5 min after Task 1)
├─ Time: 1st of month, 3:05 AM
├─ Script: slack_integration.ps1
└─ Run with: System account (for webhook access)

Task 3: Google Drive Backup (10 min after Task 1)
├─ Time: 1st of month, 3:10 AM
├─ Script: gdrive_upload.ps1 -GoogleDrivePath "Backups"
└─ Run with: Highest privileges
```

---

## Security Considerations

### Credentials & Secrets

**DO NOT** hardcode credentials in scripts. Instead, use one of these approaches:

**Option 1: Environment Variables** (Recommended)
```powershell
$slackWebhook = $env:SLACK_WEBHOOK_URL
# Set via:
# setx SLACK_WEBHOOK_URL "https://hooks.slack.com/services/..."
# (requires PowerShell restart or $env: resets)
```

**Option 2: Secure Config File**
```powershell
# config.ps1 (add to .gitignore)
$config = @{
    SlackWebhookUrl = "https://hooks.slack.com/services/..."
    GoogleDriveFolder = "RSP_Reports"
}
. .\config.ps1  # Source it in script
```

**Option 3: Vault / Key Manager**
```powershell
# Use Windows Credential Manager
$cred = Get-StoredCredential -Target "RSP_Slack"
$slackWebhook = $cred.Password | ConvertFrom-SecureString -AsPlainText
```

### Report Sensitivity

Reports may contain:
- ✅ Safe: OS version, disk space, process names
- ⚠️ Review: Event log entries (may have sensitive info)
- ❌ Never: Passwords, API keys, personal files

**Before sharing reports**:
1. Remove or redact event log entries
2. Encrypt ZIP files with password
3. Use secure transfer (not email)
4. Delete after retention period

---

## Troubleshooting

### `rclone` not found
```powershell
# Verify installation
Get-Command rclone
# If not found, reinstall from https://rclone.org/downloads/
# Add to PATH if needed
```

### Slack webhook not working
```powershell
# Check webhook URL
$env:SLACK_WEBHOOK_URL

# Test manually
$json = @{ text = "Test" } | ConvertTo-Json
Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_URL -Method Post -Body $json
```

### Google Drive sync fails
```powershell
# Verify rclone auth
rclone config show google_drive

# Test connection
rclone ls google_drive:

# Re-authorize if needed
rclone config reconnect google_drive
```

### Task Scheduler not running scripts
- [ ] Script is in path without spaces
- [ ] PowerShell execution policy allows script execution
- [ ] Task runs with "Highest privileges" enabled
- [ ] Service account has access to report paths
- [ ] Check Task Scheduler → View → Show All Tasks

---

## Customization

Feel free to modify these scripts for your needs:

1. **Adjust alert thresholds** (e.g., disk > 85% instead of 90%)
2. **Add more checks** (memory usage, service status, etc.)
3. **Change email/Slack message format**
4. **Add logging** to track execution
5. **Integrate with other tools** (Azure, Splunk, etc.)

See [CONTRIBUTING.md](../CONTRIBUTING.md) to share improvements!

---

## Next Steps

1. Test each script in a safe environment first
2. Review reports for sensitive data
3. Set up Task Scheduler (Windows) or cron (Linux)
4. Monitor the first run manually
5. Then automate and forget!

---

## Questions or Issues?

- See [DEVELOPMENT.md](../DEVELOPMENT.md) for deeper technical setup
- Open an issue on [GitHub](https://github.com/YOUR-ORG/remote-support-pack/issues)
- Check [SECURITY.md](../SECURITY.md) for security best practices

---

**Happy automating!** 🤖
