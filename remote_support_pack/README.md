# Remote Support Pack

A lightweight, secure, open-source PowerShell diagnostics and monitoring tool for Windows system administrators, IT support technicians, and MSPs. Generates comprehensive system reports without compromising security or privacy.

**Status**: Active Development | **License**: MIT | **Platform**: Windows PowerShell 5.0+

---

## Problems It Solves

### For L1/L2 IT Support Technicians
- **Manual troubleshooting is time-consuming** — gather 10+ system details individually instead of one script run
- **No audit trail** — need logs of what was checked and when
- **Guessing game** — lack structured data leads to longer resolution times
- **Difficult to scale** — copying commands, managing outputs manually is error-prone

### For Small Businesses & MSPs
- **Limited visibility** — hard to monitor client machine health proactively
- **Reactive support costs more** — waiting until systems fail is expensive
- **Compliance gaps** — no structured logs for compliance audits
- **Vendor lock-in** — expensive remote support platforms charge per-seat/month

### For Freelance Support Professionals
- **Low barrier to entry** — need professional tools without high licensing costs
- **Revenue opportunity** — offer diagnostic runs ($25–$75 per client check) or subscriptions ($10–$30/month)
- **Portfolio building** — demonstrate technical competence and proactive support
- **Client trust** — transparent, open-source tool (nothing hidden)

---

## What It Does

✅ **Diagnostic Collection**
- OS info, build, last boot time
- Disk volumes and usage
- Top 50 CPU-consuming processes
- System and Application event logs (last 200 entries)
- Network adapters and connectivity checks
- Service status summary

✅ **Optional Safe Cleanup**
- Removes temp files older than 7 days (configurable)
- Audit-logged with timestamps
- Opt-in only (never runs without flag)

✅ **Reporting**
- Timestamped report folders (no overwrites)
- Optional ZIP compression
- Plain-text, human-readable output
- Ready to share or archive

✅ **Security-First Design**
- No passwords or API keys collected
- No outbound data transmit without user consent
- Local-only execution (no cloud phoning home)
- Audit logging of all operations
- Configurable for different security profiles
- Clear warnings before destructive operations

---

## Quick Start

### Prerequisites
- Windows 7 SP1 or later
- PowerShell 5.0+ (included with Windows 10+)
- Administrator privileges

### Installation

```powershell
git clone https://github.com/YOUR-ORG/remote-support-pack.git
cd remote-support-pack
```

### Run (Basic Health Check)

```powershell
# Allow script execution for this session only
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Run diagnostic (read-only)
.\diagnostic.ps1 -OutputDir reports -Zip

# Output: reports\RSP_Report_20260612_143022.zip
```

### Run (With Safe Cleanup)

```powershell
.\diagnostic.ps1 -OutputDir reports -PerformCleanup -Zip
```

See [examples/](./examples/) for more scenarios.

---

## Security & Privacy

**This tool is designed with privacy first.** Please review [SECURITY.md](./SECURITY.md) for:
- What data is collected and why
- What is explicitly NOT collected
- Local-only execution guarantee
- Recommendations for secure deployment

**Best Practice**: Always run on isolated machines first or review output before sharing.

---

## File Structure

```
.
├── diagnostic.ps1              # Main script
├── example_run.ps1             # Usage example
├── README.md                   # This file
├── SECURITY.md                 # Security & privacy details
├── CONTRIBUTING.md             # How to contribute
├── CODE_OF_CONDUCT.md          # Community guidelines
├── LICENSE                     # MIT License
├── DEVELOPMENT.md              # Dev setup & testing
├── docs/
│   ├── use-cases.md            # Real-world scenarios
│   ├── deployment-guide.md     # Multi-machine deployment
│   └── monetization.md         # Business ideas
└── examples/
    ├── monthly_check.ps1       # Scheduled monthly run
    ├── slack_integration.ps1   # Post to Slack webhook
    └── gdrive_upload.ps1       # Upload to Google Drive
```

---

## Features Roadmap

- [ ] Centralized logging to syslog/EventLog forwarding
- [ ] Email/Slack alert integration
- [ ] Custom data collection modules
- [ ] GUI launcher (WPF)
- [ ] Configuration profiles (strict, standard, permissive)
- [ ] Remote deployment via Group Policy
- [ ] Database backend for trend analysis

---

## Contributing

We ❤️ contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Quick checklist:**
- [ ] Reviewed [SECURITY.md](./SECURITY.md) — no sensitive data collection added
- [ ] Tested on Windows 10+ in Administrator mode
- [ ] Followed [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [ ] Added/updated comments in code
- [ ] Considered edge cases and error handling

---

## Use Cases & Monetization

See [docs/monetization.md](./docs/monetization.md) for detailed business models:
- **Per-check diagnostics**: $25–$75 per report
- **Monthly monitoring**: $10–$30/client/month
- **Incident troubleshooting**: $50–$150/hour with diagnostics included
- **Reseller/MSP licensing**: custom pricing

Real-world example use cases in [docs/use-cases.md](./docs/use-cases.md).

---

## License & Credits

- **License**: MIT (see [LICENSE](./LICENSE))
- **Authors**: [Your Name / Organization]
- **Contributors**: See [CONTRIBUTORS.md](./CONTRIBUTORS.md)

---

## Support

- 📧 Email: support@example.com (optional)
- 🐛 Bugs: [GitHub Issues](https://github.com/YOUR-ORG/remote-support-pack/issues)
- 💡 Feature Ideas: Discussions or Issues
- 📖 Docs: [docs/](./docs/)

---

**Made with ❤️ by the IT support community. Free. Open. Secure.**
