# JSONLab Deployment Instructions

This guide covers the complete deployment process for JSONLab from local development to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Development Workflow](#development-workflow)
- [Building for Production](#building-for-production)
- [Deployment Platforms](#deployment-platforms)
- [Post-Deployment Verification](#post-deployment-verification)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: v2.25.0 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Required Accounts

- **GitHub**: Repository access (https://github.com/baleashvar/jsonlab)
- **Netlify**: Deployment platform (https://app.netlify.com)
- **Domain**: jsonlab.xyz (DNS configured)
- **Analytics**: Google Analytics (optional, already integrated)

### Local Environment Setup

```bash
# 1. Clone the repository
git clone https://github.com/baleashvar/jsonlab.git
cd jsonlab

# 2. Install dependencies
npm install

# 3. Create .env file (if needed)
cp .env.example .env
# Edit .env with your configuration

# 4. Verify installation
npm list
```

---

## Local Setup

### Installation Steps

```bash
# Install dependencies
npm install

# Verify Node modules are installed
ls node_modules | head -20

# Check npm versions
npm --version
node --version
```

### Project Structure Verification

After installation, verify these directories exist:

```
jsonlab/
├── node_modules/          # Dependencies
├── src/
│   ├── css/styles.css
│   └── js/
│       ├── formatter.worker.js
│       └── theme.js
├── tools/                 # Tool directories
├── public/                # Static assets
├── docs/                  # Documentation
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

### Configuration Files Review

#### vite.config.js
```javascript
// Ensure this contains:
- Vite configuration for dev server
- Build output configuration
- Asset handling
- Module resolution
```

#### tailwind.config.js
```javascript
// Verify:
- Content paths include all HTML files
- Theme colors are defined
- Dark mode is enabled
- Plugins are configured
```

#### postcss.config.js
```javascript
// Check that:
- Tailwind CSS is included
- Autoprefixer is configured
- Other CSS processors are set up
```

---

## Development Workflow

### Starting Development Server

```bash
# Start the dev server
npm run dev

# The server will start on http://localhost:5173
# Hot module replacement (HMR) is enabled
# Changes will auto-refresh in browser
```

### Development Best Practices

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/add-new-tool
   ```

2. **Make Changes**
   - Edit tool files or core code
   - Test in dev server
   - Check console for errors

3. **Local Testing**
   ```bash
   # Run linting
   npm run lint

   # Build locally to check for errors
   npm run build

   # Preview production build
   npm run preview
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: Add new tool"
   git push origin feature/add-new-tool
   ```

5. **Create Pull Request**
   - Go to GitHub repository
   - Create PR with clear description
   - Link related issues
   - Request review

### Testing Before Deployment

```bash
# 1. Clean build
rm -rf dist
npm run build

# 2. Preview build
npm run preview

# 3. Test in browser
# - Visit http://localhost:4173
# - Test all tools
# - Check dark mode
# - Test file uploads
# - Verify keyboard shortcuts

# 4. Check console
# - Open DevTools (F12)
# - Check Console tab for errors
# - Check Network tab for failed requests
# - Verify no CORS issues

# 5. Test on mobile
# - Use device emulation (DevTools)
# - Or use physical mobile device
# - Test touch interactions
# - Verify responsive layout
```

---

## Building for Production

### Build Process

```bash
# Clean previous build
rm -rf dist

# Build optimized production version
npm run build

# Output structure
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      # Main bundle
│   ├── formatter.worker-[hash].js
│   ├── styles-[hash].css
│   └── [other assets]
├── tools/
│   ├── formatter/
│   ├── validator/
│   └── [other tools]
├── about/
├── blog/
└── ai-tools/
```

### Build Optimization

The build process automatically:

- **Minifies JavaScript**: Removes whitespace and comments
- **Minifies CSS**: Optimizes Tailwind styles
- **Code Splitting**: Separates vendor and app code
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compresses images
- **Source Maps**: Generates for debugging (production mode)

### Build Size Report

```bash
# Check build size
du -sh dist

# Typical sizes:
# - Total: 200-400 KB (gzipped)
# - Main bundle: 150-250 KB
# - CSS: 50-100 KB
# - Assets: remaining
```

### Verifying Build

```bash
# 1. Check for errors during build
npm run build
# Should see "✓ built in [time]ms"

# 2. Verify file structure
ls -la dist/

# 3. Check asset hashing
ls dist/assets/
# Files should have [hash] in name

# 4. Preview production build
npm run preview

# 5. Test in browser
# Visit http://localhost:4173
# - All tools should load
# - No 404 errors
# - CSS should apply correctly
```

---

## Deployment Platforms

### Netlify Deployment (Recommended)

#### Initial Setup

1. **Connect Repository**
   ```
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose repository: baleashvar/jsonlab
   ```

2. **Configure Build Settings**
   ```
   - Build command: npm run build
   - Publish directory: dist
   - Node version: 16 (or higher)
   ```

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://jsonlab.xyz
   VITE_ANALYTICS_ID=your-analytics-id
   ```

4. **Configure Redirects**
   - Create/verify `_redirects` file in root
   - Netlify automatically uses this for routing

5. **Configure Headers**
   - Create/verify `_headers` file in root
   - Sets security headers and caching

#### Current Netlify Configuration

The project already has:

**_redirects file**:
```
# SPA routing - redirect to index.html for client-side routing
/*    /index.html   200
```

**_headers file**:
```
# Security headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

# Cache headers
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

#### Automatic Deployments

```
main branch → Push to GitHub → Netlify detects → Build → Deploy
```

- Preview deployments on PR
- Production on merge to main

#### Manual Deployment

```bash
# Using Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist

# Or drag and drop dist folder in Netlify UI
```

### Domain Configuration

#### DNS Setup for jsonlab.xyz

Netlify provides these DNS records:

```
Type    Name        Value
A       @           75.2.60.5
A       www         75.2.60.5
```

Or use Netlify DNS:
- Change nameservers to Netlify
- Automatically managed

#### SSL/HTTPS

- Netlify provides free SSL certificate
- Auto-renews 30 days before expiration
- HTTPS automatically configured
- Automatic redirect from HTTP to HTTPS

---

## Post-Deployment Verification

### Immediate Checks (5 minutes after deploy)

```bash
# 1. Site is accessible
curl -I https://jsonlab.xyz
# Should return 200 OK

# 2. Check index page
curl https://jsonlab.xyz | head -20

# 3. Check tools are accessible
curl -I https://jsonlab.xyz/tools/formatter/
curl -I https://jsonlab.xyz/tools/validator/
# All should be 200 OK

# 4. Check assets
curl -I https://jsonlab.xyz/src/css/styles.css
curl -I https://jsonlab.xyz/src/js/theme.js
# Should be 200 OK
```

### Browser Testing Checklist

```
URL Checking:
[ ] https://jsonlab.xyz loads
[ ] https://www.jsonlab.xyz redirects to https://jsonlab.xyz
[ ] /tools/formatter loads correctly
[ ] /tools/validator loads correctly
[ ] Other tools load

Functionality:
[ ] JSON Formatter works
[ ] JSON Validator works
[ ] All converters work
[ ] File uploads work
[ ] Download functionality works
[ ] Copy to clipboard works

UI/UX:
[ ] Dark mode toggle works
[ ] Responsive design works on mobile
[ ] Keyboard shortcuts work
[ ] No console errors (F12)
[ ] No broken images or assets

Performance:
[ ] Page loads in < 2 seconds
[ ] Formatting large JSON works smoothly
[ ] No lag when typing
[ ] No memory leaks (DevTools)

SEO:
[ ] Meta tags present (og:title, og:description, etc.)
[ ] Structured data present
[ ] Canonical tags correct
[ ] Mobile viewport meta tag present
```

### Performance Monitoring

```bash
# Check Page Speed Insights
# Visit: https://pagespeed.web.dev/
# Enter: https://jsonlab.xyz
# Review metrics

# Expected scores:
# - Lighthouse Score: > 90
# - Core Web Vitals: All green
# - Load time: < 2s
```

### Analytics Verification

```
Google Analytics:
1. Go to https://analytics.google.com
2. Check Real-time data shows traffic
3. Verify pageviews are being tracked
4. Check top pages and user behavior
```

---

## Monitoring and Maintenance

### Daily Monitoring

```bash
# 1. Check Netlify dashboard
# https://app.netlify.com/sites/jsonlab

# 2. Review recent deployments
# Verify latest deploy completed successfully

# 3. Check analytics
# Verify normal traffic patterns

# 4. Monitor error logs
# Check for new errors in console
```

### Weekly Checks

```bash
# 1. Test all tools manually
npm run preview

# 2. Check for dependency updates
npm outdated

# 3. Review GitHub issues
# https://github.com/baleashvar/jsonlab/issues

# 4. Monitor performance
# Check Netlify analytics
# Review PageSpeed Insights
```

### Monthly Maintenance

```bash
# 1. Update dependencies (non-breaking)
npm update

# 2. Audit security
npm audit
npm audit fix

# 3. Review and update documentation
# Update API_REFERENCE.md if needed
# Update ARCHITECTURE.md if changed

# 4. Backup configuration
git backup current state

# 5. Plan next release
Review commits and plan features
```

### Monitoring Tools

- **Netlify Analytics**: Built-in dashboard
- **Google Analytics**: User behavior and traffic
- **Sentry** (optional): Error tracking
- **Uptime Monitor** (optional): Site availability

---

## Rollback Procedures

### Quick Rollback to Previous Deploy

#### Via Netlify Dashboard

```
1. Go to https://app.netlify.com/sites/jsonlab
2. Click "Deploys"
3. Find previous stable deploy
4. Click deploy
5. Click "Restore this deploy"
6. Confirm
```

Deploy restored in < 1 minute.

#### Via Git

```bash
# 1. Check git history
git log --oneline | head -10

# 2. Identify last working commit
# Example: abc123 "fix: JSON formatter issue"

# 3. Create rollback branch
git checkout -b rollback-abc123 abc123

# 4. Force push to main (use with caution!)
git push origin rollback-abc123:main -f

# Note: Use only if necessary - this rewrites history
```

### Verification After Rollback

```bash
# 1. Check Netlify shows new deploy
# https://app.netlify.com

# 2. Test site functionality
npm run preview

# 3. Check analytics for traffic
# Should return to normal within minutes

# 4. Verify no issues
# Test all critical tools
```

### Post-Rollback Actions

1. **Investigate Issue**
   - What went wrong?
   - Where was the bug introduced?
   - How to prevent?

2. **Create Fix Branch**
   ```bash
   git checkout -b fix/issue-description
   git cherry-pick abc123  # Bring back commits
   # Fix the issue
   ```

3. **Test Thoroughly**
   - Local testing
   - Test build process
   - Verify in preview

4. **Deploy Fix**
   - Create PR
   - Get review
   - Merge to main

---

## Emergency Procedures

### Site is Down

```bash
# 1. Check Netlify status
# https://status.netlify.com

# 2. Check recent deployments
# https://app.netlify.com/sites/jsonlab/deploys

# 3. If recent deploy failed:
# Use rollback procedure above

# 4. Contact support if infrastructure issue:
# support@netlify.com
```

### High Error Rate

```bash
# 1. Check error logs
# Netlify Functions logs (if using)
# Browser console errors from users

# 2. Quick diagnosis:
npm run preview
# Test locally

# 3. If bug in code:
# Create hotfix branch
git checkout -b hotfix/critical-issue

# Fix and test thoroughly

# 4. Deploy as emergency
git push origin hotfix/critical-issue
# Create PR with "HOTFIX" label
# Fast-track review and merge
```

### Performance Degradation

```bash
# 1. Check metrics
# PageSpeed Insights
# Netlify Analytics
# Network tab in DevTools

# 2. Identify cause:
# Large asset uploaded?
# New inefficient code?
# Third-party service down?

# 3. Quick fixes:
# Optimize images
# Enable caching
# Remove heavy dependencies

# 4. Create fix and deploy
```

---

## Deployment Checklist

Before deploying to production:

```
Code Quality:
[ ] All tests pass (npm test)
[ ] Linting passes (npm run lint)
[ ] No console errors or warnings
[ ] Code reviewed and approved

Build:
[ ] Clean build succeeds (npm run build)
[ ] No build warnings
[ ] Build size within limits
[ ] Assets properly hashed

Testing:
[ ] Tested in Chrome, Firefox, Safari, Edge
[ ] Tested on mobile devices
[ ] All tools function correctly
[ ] File operations work
[ ] Dark mode verified

Documentation:
[ ] CHANGELOG updated
[ ] API docs updated if needed
[ ] README updated if needed
[ ] Code comments clear

Deployment:
[ ] Verified DNS configuration
[ ] SSL certificate valid
[ ] Build directory clean
[ ] Environment variables set
[ ] Analytics ID correct

Post-Deploy:
[ ] Monitor error rates (first hour)
[ ] Check analytics for traffic
[ ] Verify user feedback
[ ] Be ready to rollback if issues
```

---

## Troubleshooting Deployment Issues

### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build

# Check for errors in output
# Fix reported issues
```

### Asset 404 Errors

```bash
# Verify assets are in dist/
ls dist/assets/

# Check asset paths in HTML
# May need to update vite.config.js
```

### Routing Issues

```bash
# Ensure _redirects file exists
cat _redirects

# Verify SPA routing rules
# Should redirect all to index.html
```

### Analytics Not Tracking

```bash
# Check GTM code in HTML
# Verify GTM ID: GTM-564CXCJ8
# Check tag manager dashboard for errors
```

### Slow Performance

```bash
# Run PageSpeed Insights
# Check cache headers
# Verify assets are compressed
# Consider CDN configuration
```

---

## Support and Documentation

- **Repository**: https://github.com/baleashvar/jsonlab
- **Issues**: https://github.com/baleashvar/jsonlab/issues
- **Email**: sollarity1@gmail.com
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev

---

## Version Control

Current version: **1.0.0**

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

