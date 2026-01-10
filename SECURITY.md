# Security Policy

## Supported Versions

We actively support the latest version of JSONLab. Security updates are applied to the main branch and deployed immediately.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 🚨 For Critical Security Issues

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead, please email us directly at: **sollarity1@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 🔍 What We Consider Security Issues

- Cross-site scripting (XSS) vulnerabilities
- Code injection attacks
- Unauthorized access to user data
- Dependency vulnerabilities with high/critical severity
- Privacy violations

### 📋 What We Don't Consider Security Issues

- Issues requiring physical access to user's device
- Social engineering attacks
- Issues in third-party dependencies with low severity
- Theoretical attacks without practical exploitation

### ⏱️ Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours  
- **Fix Development**: Within 7 days for critical issues
- **Deployment**: Immediately after fix validation

### 🏆 Recognition

We appreciate security researchers who help keep JSONLab safe:

- Public acknowledgment (if desired)
- Listed in our security contributors
- Priority support for future reports

## Security Best Practices

JSONLab follows these security principles:

- **Client-side processing**: No data sent to servers
- **Content Security Policy**: Strict CSP headers
- **Dependency management**: Regular security audits
- **Input validation**: All user inputs are sanitized
- **HTTPS only**: Secure connections required

## Security Updates

Security updates are:
- Applied immediately to the main branch
- Deployed to production within hours
- Announced in release notes
- Communicated via GitHub security advisories

Thank you for helping keep JSONLab secure! 🔒