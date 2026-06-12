# Contributing to Remote Support Pack

First, thank you for considering contributing! 🎉 We're excited to have the community help improve this tool.

## How to Contribute

### 1. Report Bugs

Found a bug? Please open an issue:

1. Go to [Issues](https://github.com/YOUR-ORG/remote-support-pack/issues)
2. Click "New Issue"
3. Include:
   - **Title**: Clear, concise bug description
   - **Environment**: Windows version, PowerShell version
   - **Steps to Reproduce**: Exact commands and expected vs. actual behavior
   - **Error Output**: Full error message or log snippet
   - **Screenshot**: If applicable

**Example:**
```
Title: Diagnostic fails on Windows 7 with permission error

Environment:
- Windows 7 SP1
- PowerShell 5.0

Steps:
1. Run: .\diagnostic.ps1 -OutputDir reports
2. Error: Access to path 'reports' denied

Expected: Folder created successfully
Actual: Permission denied error
```

### 2. Suggest Features

Have an idea? Open a feature request:

1. Go to [Issues](https://github.com/YOUR-ORG/remote-support-pack/issues)
2. Click "New Issue" → select "Feature Request"
3. Describe:
   - **Problem**: What pain point does this solve?
   - **Solution**: How should it work?
   - **Alternatives**: Any other approaches?
   - **Use Case**: Real-world example

**Example:**
```
Title: Add Slack webhook integration for critical alerts

Problem: 
Users need to know immediately if a machine is critically low on disk space.

Solution:
Add optional -SlackWebhook parameter that posts alert if disk < 10% free

Use Case:
MSPs monitoring 100+ clients; Slack notifies on-call tech of failures
```

### 3. Submit Code Changes

**Fork & Clone:**
```powershell
git clone https://github.com/YOUR-USERNAME/remote-support-pack.git
cd remote-support-pack
git checkout -b feature/your-feature-name
```

**Code Style:**
- Use `PascalCase` for functions: `Get-SystemInfo`
- Use `camelCase` for variables: `$outputPath`
- Add comment blocks for complex logic
- Keep line length under 100 characters
- Test on Windows 10+ and Windows 7/2008 R2 if possible

**Security Checklist (REQUIRED):**
Before submitting, verify:
- [ ] No hardcoded passwords, API keys, or credentials
- [ ] No new external dependencies added
- [ ] No collection of PII (personally identifiable info)
- [ ] Error messages don't leak sensitive info
- [ ] Reviewed [SECURITY.md](./SECURITY.md)

**Testing:**
```powershell
# Test locally as non-admin first
PowerShell -NoProfile -NoExit -Command ".\diagnostic.ps1 -OutputDir test_report"

# Then as Administrator
# Then verify output doesn't contain sensitive data
Get-Content test_report\*.txt | Select-String "password|api|secret|key"
```

**Commit & Push:**
```powershell
git add .
git commit -m "Add feature: [description]"
git push origin feature/your-feature-name
```

**Create Pull Request:**
1. Go to the repo and click "Pull Requests"
2. Click "New Pull Request"
3. Select your branch and fill in the template:

```
## Description
Brief summary of changes

## Motivation & Context
Why is this change needed?

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How did you test this? Steps to reproduce:
1. Run ...
2. Verify ...

## Security Review
- [ ] Reviewed SECURITY.md
- [ ] No credentials added
- [ ] No new external calls
- [ ] No PII collection
```

---

## Contribution Ideas

### 🐛 Easy (Great for First-Timers)
- [ ] Improve README documentation
- [ ] Add more examples (monthly checks, Slack integration, etc.)
- [ ] Fix typos or clarify code comments
- [ ] Expand troubleshooting section

### 🟡 Medium (Good for Intermediate Users)
- [ ] Add configuration file support (JSON/YAML)
- [ ] Expand event log filtering options
- [ ] Add CPU/Memory threshold alerting
- [ ] Create deployment guide for Group Policy

### 🔴 Advanced (For Experienced Contributors)
- [ ] Build GUI launcher (WPF)
- [ ] Add centralized logging backend (syslog)
- [ ] Implement remote execution wrapper
- [ ] Create installer (.msi)

---

## Development Setup

### Prerequisites
- Windows 10+ or Windows Server 2016+
- PowerShell 5.1+
- Git for Windows
- Administrator access (for testing)

### Local Testing

```powershell
# 1. Fork and clone
git clone https://github.com/YOUR-USERNAME/remote-support-pack.git
cd remote-support-pack

# 2. Create a test branch
git checkout -b test-my-change

# 3. Test your changes
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\diagnostic.ps1 -OutputDir test_report

# 4. Review output
Get-Content test_report\*.txt

# 5. Commit and push
git add .
git commit -m "Test: your change"
git push origin test-my-change
```

---

## Code Review Process

1. **Automated checks**: GitHub Actions verify PowerShell syntax
2. **Security review**: We check for credential leaks and sensitive data
3. **Manual review**: Maintainers review code quality and design
4. **Testing**: We test on multiple Windows versions
5. **Merge**: Once approved, your change is merged!

---

## Community Guidelines

Please follow our [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md):
- Be respectful and inclusive
- Assume good intent
- Provide constructive feedback
- No harassment or discrimination

---

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- GitHub contributors page
- Release notes for major contributions

---

## Questions?

- 📖 See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup
- 💬 Open a discussion or comment on an issue
- 📧 Email: contribute@example.com

---

**Thank you for making Remote Support Pack better!** 🚀
