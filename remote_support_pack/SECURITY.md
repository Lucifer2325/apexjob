# Security & Privacy Policy

This document outlines the security design, privacy guarantees, and best practices for Remote Support Pack.

---

## Data Collection & Privacy

### What IS Collected

The tool collects **only non-sensitive system diagnostics**:

| Category | Examples | Why |
|----------|----------|-----|
| **OS Info** | Windows version, build number, last boot time | Diagnose OS-level issues |
| **Disk Health** | Volume names, free/used space | Detect storage problems |
| **Process Health** | Top 50 CPU-consuming processes, names only | Identify resource hogs |
| **Services** | Service names and status | Troubleshoot service failures |
| **Network** | Adapter names, connectivity (pass/fail only) | Test network access |
| **Event Logs** | System/Application events (text only, last 200) | Audit troubleshooting history |

### What is NOT Collected

❌ **Credentials**
- Passwords, API keys, tokens
- Windows credentials cache
- SSH keys or certificates

❌ **Personal Data**
- User file contents
- Browser history
- Documents, emails
- User registry settings
- Desktop files

❌ **Business Secrets**
- Application source code
- Database connection strings
- Proprietary config files
- Private keys or certificates

❌ **External Transmission**
- No cloud upload without explicit user action
- No telemetry or analytics
- No phoning home to vendors
- Local execution only (you own your data)

---

## Execution & Storage

### Local-Only Execution
- Script runs **entirely on the client machine**
- Reports are saved **locally** in timestamped folders
- You control where reports are stored and who sees them
- No data leaves your machine unless you explicitly upload

### Audit Trail
- Every diagnostic run creates timestamped logs
- Optional cleanup operations are logged
- All file I/O is documented
- Easy to track what was collected and when

### Recommended Report Handling
1. **Run locally** → Review output
2. **Encrypt before sharing** → Use Windows BitLocker or 7-Zip password
3. **Remove sensitive files** → Delete event logs if necessary before archiving
4. **Use secure transport** → HTTPS, encrypted email, or secure file sharing

---

## Secure Deployment

### Best Practices

**For MSPs & Support Providers:**
1. Get written consent before running on client machines
2. Explain what data is collected and why
3. Use secure remote session (RDP/Zoom, not public internet)
4. Archive reports securely and delete after specified period
5. Document report lifecycle in your compliance plan

**For IT Administrators:**
1. Test in non-production environments first
2. Review sample output before rolling out widely
3. Restrict who can run the script (Group Policy, file permissions)
4. Use log forwarding (syslog/Event Log) in secure environments
5. Implement data retention policies

**For Freelancers:**
1. Use VPN when accessing client networks
2. Encrypt stored reports with passwords
3. Avoid collecting more data than necessary
4. Delete old reports per retention policy
5. Maintain privacy agreements with clients

---

## Code Security

### Design Principles

✅ **No external dependencies** — Uses only PowerShell built-ins  
✅ **No DLLs or executables** — Pure script, easy to audit  
✅ **No obfuscation** — Code is readable and reviewable  
✅ **Safe defaults** — Cleanup requires explicit flag  
✅ **Error handling** — Failures are logged, not hidden  

### Code Review Checklist

Before contributing, ensure:
- [ ] No hardcoded credentials or secrets
- [ ] No credential collection added
- [ ] No external API calls (or user opt-in required)
- [ ] Error handling prevents data leaks
- [ ] Temporary files are cleaned up after use
- [ ] Logging is clear and non-invasive

---

## Vulnerability Reporting

If you discover a security issue, **please do NOT open a public GitHub issue.**

Instead, email: **security@example.com** with:
- Description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will respond within 48 hours and work with you on a fix.

---

## Compliance & Standards

This tool is designed to align with:
- **GDPR**: No personal data collected; local-only execution
- **HIPAA**: No PHI collection; you control storage
- **SOC 2**: Transparent, auditable operations; clear data handling
- **ISO 27001**: Security-by-design; no unauthorized transmission

---

## Example: Safe Client Deployment

**Scenario**: You're an MSP offering proactive monitoring

```powershell
# Step 1: Explain to client
# "We'll run a diagnostic to check system health. 
#  Reports stay on your machine; you control who sees them."

# Step 2: Run in client's presence (over secure RDP)
.\diagnostic.ps1 -OutputDir reports -Zip

# Step 3: Review output with client
# "Here's what we found and why. Do you want me to proceed?"

# Step 4: Archive securely
# Encrypt with password, store for 90 days, then delete

# Step 5: Document
# Log: date, client, what was checked, outcome
```

---

## Questions?

See [README.md](./README.md) for support channels or open an issue on GitHub.

**Your privacy and security are our top priority.**
