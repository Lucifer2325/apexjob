# Development Guide

This guide helps contributors set up a development environment for Remote Support Pack.

---

## Prerequisites

### Required
- **Windows 10 (build 14393+)** or Windows Server 2016+
- **PowerShell 5.1+** (included with Windows 10+, or [install manually](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows))
- **Administrator privileges** (for testing diagnostics and cleanup)
- **Git for Windows** ([download](https://git-scm.com/download/win))

### Optional
- **VS Code** with PowerShell extension for editing
- **Pester** (PowerShell testing framework) for unit tests
- **Docker** (if testing cross-version)

---

## Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/YOUR-ORG/remote-support-pack.git
cd remote-support-pack
```

### 2. Verify PowerShell Version

```powershell
$PSVersionTable.PSVersion
# Should show 5.1 or higher
```

### 3. Set Execution Policy (Temporary)

```powershell
# For current session only (safer)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Verify
Get-ExecutionPolicy -Scope Process
```

---

## Development Workflow

### 1. Create a Feature Branch

```powershell
git checkout -b feature/my-feature
# Example: git checkout -b feature/add-slack-integration
```

### 2. Edit & Test Locally

```powershell
# Edit diagnostic.ps1 or create new files
# Test your changes:
.\diagnostic.ps1 -OutputDir test_report

# Verify output
Get-ChildItem test_report
```

### 3. Test Scenarios

**Scenario 1: Read-Only (Default)**
```powershell
# Should collect diagnostics without modifying system
.\diagnostic.ps1 -OutputDir test_report
```

**Scenario 2: With Cleanup**
```powershell
# Should remove temp files older than 7 days
.\diagnostic.ps1 -OutputDir test_report -PerformCleanup
```

**Scenario 3: With Compression**
```powershell
# Should create ZIP file
.\diagnostic.ps1 -OutputDir test_report -Zip

# Verify ZIP
Get-ChildItem test_report -Filter *.zip
```

### 4. Code Review Checklist

Before committing:

- [ ] **No Credentials**: Search for passwords, API keys, tokens
  ```powershell
  Select-String -Path *.ps1 -Pattern "password|api[_-]?key|secret|token" -IgnoreCase
  ```

- [ ] **Security**: No external API calls, no telemetry
  ```powershell
  Select-String -Path *.ps1 -Pattern "http|curl|invoke-webrequest" -IgnoreCase
  ```

- [ ] **Error Handling**: Try-catch blocks around risky operations
  ```powershell
  # Example
  try { Get-Item -Path $path }
  catch { Write-Host "Error: $_" }
  ```

- [ ] **Documentation**: Comments for complex logic
  ```powershell
  # Example
  # Collects top 50 CPU-consuming processes
  Get-Process | Sort-Object CPU -Descending | Select-Object -First 50
  ```

- [ ] **Testing**: Ran on multiple Windows versions if possible

### 5. Commit & Push

```powershell
git add .
git commit -m "feat: add slack integration for alerts"
git push origin feature/my-feature
```

**Commit Message Format:**
```
type(scope): subject

body (optional)

fixes #123
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore

---

## Testing

### Manual Testing

```powershell
# Test 1: Basic run
.\diagnostic.ps1 -OutputDir reports

# Test 2: With cleanup
.\diagnostic.ps1 -OutputDir reports -PerformCleanup

# Test 3: With zip
.\diagnostic.ps1 -OutputDir reports -Zip

# Test 4: Non-admin mode (should fail gracefully)
powershell.exe -NoProfile -Command ".\diagnostic.ps1"
```

### Automated Testing (Optional)

If you have Pester installed:

```powershell
# Install Pester
Install-Module -Name Pester -Force -SkipPublisherCheck

# Run tests (example)
Invoke-Pester -Path .\tests\ -Verbose
```

---

## Debugging

### Enable Verbose Output

```powershell
$VerbosePreference = "Continue"
.\diagnostic.ps1 -OutputDir debug_report -Verbose
```

### Check Logs

```powershell
# View generated logs
Get-Content debug_report\*\run.log

# View error details
Get-Content debug_report\*\*.txt | Select-String -Pattern "Error|Failed" -IgnoreCase
```

### PowerShell Debugging

```powershell
# Set breakpoint
Set-PSBreakpoint -Script .\diagnostic.ps1 -Line 50

# Debug with ISE or VS Code
# Open diagnostic.ps1 → Press F5 to debug
```

---

## Cross-Version Testing

### Windows 7 / 2008 R2 Compatibility

Test on older Windows versions if modifying core functions:

```powershell
# Features NOT available in older Windows:
# - Get-CimInstance (use Get-WmiObject instead)
# - Get-Volume (use Get-Disk + Get-Partition)
# - Test-NetConnection (use Test-Connection)

# Example fallback:
if ($PSVersionTable.PSVersion -lt [version]'6.0') {
    $os = Get-WmiObject -Class Win32_OperatingSystem
} else {
    $os = Get-CimInstance -ClassName Win32_OperatingSystem
}
```

---

## Project Structure

```
.
├── diagnostic.ps1              # Main script (DO NOT RENAME)
├── example_run.ps1             # Usage examples
├── README.md                   # Public documentation
├── SECURITY.md                 # Security & privacy policy
├── CONTRIBUTING.md             # Contributor guidelines
├── CODE_OF_CONDUCT.md          # Community standards
├── LICENSE                     # MIT License
├── DEVELOPMENT.md              # This file
├── docs/
│   ├── use-cases.md            # Real-world scenarios
│   ├── deployment-guide.md     # Multi-machine setup
│   └── monetization.md         # Business models
└── examples/
    ├── monthly_check.ps1       # Scheduled run example
    ├── slack_integration.ps1   # Slack webhook example
    └── gdrive_upload.ps1       # Google Drive upload example
```

---

## Common Issues

### Issue: "Script execution policy not set"

```powershell
# Solution: Set for current session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Issue: "Access denied" errors

```powershell
# Solution: Run PowerShell as Administrator
# Right-click PowerShell → "Run as administrator"
```

### Issue: "Module not found"

```powershell
# Check available modules
Get-Module -ListAvailable

# If missing, install (if available in repo)
# or create fallback logic
```

---

## Performance Optimization

### For Large Deployments

If running on 1000+ machines, optimize:

```powershell
# 1. Reduce log retention
Get-EventLog -LogName System -Newest 50  # Instead of 200

# 2. Skip optional checks
# Add -SkipNetworkCheck parameter

# 3. Parallel execution
# Use Invoke-Command with -AsJob for remote machines
```

---

## Releasing Updates

When ready to release:

1. **Test thoroughly** on Windows 10 and Windows 7
2. **Update version** in comments
3. **Update CHANGELOG** (create if missing)
4. **Tag release**: `git tag v1.0.0`
5. **Push**: `git push origin main --tags`

---

## Questions?

- 💬 Open an issue on GitHub
- 📧 Email: dev@example.com
- 📖 See [README.md](./README.md) for more info

---

**Happy coding!** 🎉
