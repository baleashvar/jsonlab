# JSONLab Troubleshooting Guide

This guide helps diagnose and resolve common issues with JSONLab tools and development.

## Table of Contents

- [Common Tool Issues](#common-tool-issues)
- [JSON Processing Issues](#json-processing-issues)
- [File Operations Issues](#file-operations-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility Issues](#browser-compatibility-issues)
- [Development Issues](#development-issues)
- [Deployment Issues](#deployment-issues)
- [Getting Help](#getting-help)

---

## Common Tool Issues

### JSON Formatter

#### Issue: JSON Not Formatting
**Symptoms**: Click format button, nothing happens

**Diagnosis**:
1. Check browser console for errors (F12)
2. Verify JSON is valid (use Validator tool)
3. Check indentation setting
4. Verify Web Worker loaded

**Solutions**:
```javascript
// Check if Web Worker is available
if (typeof(Worker) !== "undefined") {
  console.log("Web Workers supported");
} else {
  console.log("Web Workers not supported");
}

// Verify formatter.worker.js is loaded
fetch('/src/js/formatter.worker.js')
  .then(r => r.ok ? console.log('Worker loaded') : console.log('Worker not found'))
  .catch(e => console.log('Worker error:', e));
```

**Actions**:
- Clear browser cache: Ctrl+Shift+Delete
- Refresh page: Ctrl+R
- Try different browser
- Check internet connection

#### Issue: "Unknown Action" Error
**Symptoms**: Error message shows "Unknown action"

**Cause**: Web Worker doesn't recognize action parameter

**Solution**:
```javascript
// Supported actions:
- 'format'   // Format with indentation
- 'minify'   // Compress JSON
- 'validate' // Check if valid

// Example correct message:
worker.postMessage({
  action: 'format',  // Not 'fmt' or other typos
  data: jsonString,
  indent: 2
});
```

#### Issue: Large JSON Files Freeze Browser
**Symptoms**: Browser becomes unresponsive when formatting large JSON (>10MB)

**Cause**: Web Worker taking too long, main thread blocked

**Solutions**:
1. **Use Batch Mode**
   - Split JSON into smaller chunks
   - Process each separately

2. **Increase Timeout**
   - May need to wait longer
   - Check browser's process manager

3. **Use Command Line Alternative**
   ```bash
   # Use jq for large files
   jq . largefile.json > formatted.json
   ```

4. **Report Issue**
   - If file is reasonably sized (< 50MB)
   - Performance may be improved in future

### JSON Validator

#### Issue: False Positive "Invalid JSON"
**Symptoms**: JSON looks valid but validator says it's invalid

**Common Causes**:
1. **Trailing commas**
   ```json
   // ❌ Invalid
   {
     "name": "John",
   }
   
   // ✅ Valid
   {
     "name": "John"
   }
   ```

2. **Single quotes instead of double quotes**
   ```json
   // ❌ Invalid
   {'name': 'John'}
   
   // ✅ Valid
   {"name": "John"}
   ```

3. **Unquoted keys**
   ```json
   // ❌ Invalid
   {name: "John"}
   
   // ✅ Valid
   {"name": "John"}
   ```

4. **Comments in JSON**
   ```json
   // ❌ Invalid
   {
     "name": "John" // This is a comment
   }
   
   // ✅ Valid (no comments)
   {
     "name": "John"
   }
   ```

**Solution**:
- Use JSON5 Mode if needed (allows trailing commas and single quotes)
- Click Auto-Fix button to automatically correct common issues

#### Issue: Auto-Fix Doesn't Work
**Symptoms**: Click Auto-Fix but JSON remains unchanged

**Causes**:
1. JSON might be beyond auto-fix capability
2. Multiple issues may prevent fixing

**Solutions**:
```javascript
// Auto-fix handles:
- Trailing commas
- Single quotes to double quotes
- Basic formatting issues

// Cannot fix:
- Completely malformed JSON
- Missing closing braces/brackets
- Unquoted keys (not in JSON5 mode)
```

**Manual Fix Steps**:
1. Note error message and line number
2. Navigate to that line
3. Fix based on error message
4. Validate again

### JSON Tree Viewer

#### Issue: Tree Not Rendering
**Symptoms**: Input added but tree doesn't appear

**Diagnosis**:
1. Check if JSON is valid first
2. Verify tree container is visible
3. Check browser console for errors

**Solutions**:
```bash
# Step 1: Validate JSON
# Use JSON Validator tool first

# Step 2: Clear browser cache
# Sometimes old version cached

# Step 3: Try simpler JSON
{
  "name": "test"
}
# If this works, issue is with complex structure
```

#### Issue: Tree Nodes Not Expanding
**Symptoms**: Can't expand object or array nodes

**Causes**:
1. Node is actually empty
2. Keyboard shortcuts not working
3. Mouse click not registering

**Solutions**:
1. **Try Keyboard Navigation**
   - Arrow keys to move between nodes
   - Left/Right arrows to collapse/expand

2. **Check JSON Structure**
   - Expand parent first
   - Some objects appear empty if no children

3. **Try Different Browser**
   - May be browser-specific issue

#### Issue: Scrolling Very Slow in Large Tree
**Symptoms**: Scrolling is choppy with large JSON files

**Cause**: Too many DOM nodes rendered

**Solutions**:
1. **Enable Virtualization** (if option available)
   - Only renders visible nodes
   - Much faster scrolling

2. **Use Filter Feature**
   - Collapse unnecessary sections
   - Focus on relevant data

3. **Split File**
   - Process smaller chunks
   - Combine results later

---

## JSON Processing Issues

### Issue: Encoding/Decoding Errors

#### Base64 Decode Fails
**Symptoms**: "Invalid Base64 string" error

**Common Causes**:
```javascript
// ❌ Invalid: Missing padding
"aGVsbG8gd29ybGQ"

// ✅ Valid: With padding
"aGVsbG8gd29ybGQ="

// ❌ Invalid: Invalid characters
"aGVs!G8gd29ybGQ="

// ✅ Valid: Only Base64 chars
"aGVsbG8gd29ybGQ="
```

**Solution**:
1. Verify string is valid Base64
2. Check for padding (= at end)
3. Ensure no invalid characters
4. Try decoding in stages if very long

#### UTF-8 Encoding Issues
**Symptoms**: Special characters appear garbled

**Cause**: Character encoding mismatch

**Solutions**:
```javascript
// Ensure proper UTF-8 handling
const text = "Hello 世界";
const encoded = btoa(unescape(encodeURIComponent(text)));
const decoded = decodeURIComponent(escape(atob(encoded)));
```

### Issue: Number Precision Loss

**Symptoms**: Large numbers lose precision
```javascript
// Input
{"id": 9007199254740992}

// After JSON.parse
{"id": 9007199254740992} // May lose precision

// Max safe integer: 2^53 - 1 = 9007199254740991
```

**Solution**:
1. Store large numbers as strings
2. Use BigInt if supported
3. Use specialized JSON parser for arbitrary precision

**Workaround**:
```json
{
  "id": "9007199254740992"
}
```

### Issue: Circular Reference Error

**Symptoms**: "Converting circular structure to JSON" error

**Cause**: JSON objects reference themselves

**Example**:
```javascript
// ❌ This causes circular reference
const obj = {};
obj.self = obj;
JSON.stringify(obj); // Error!
```

**Solution**:
1. Break circular reference before processing
2. Implement custom replacer function

```javascript
function stringifyWithoutCircular(obj) {
  const seen = new WeakSet();
  
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular Reference]";
      }
      seen.add(value);
    }
    return value;
  });
}
```

---

## File Operations Issues

### Issue: File Upload Fails

#### Symptoms
- Upload button doesn't respond
- File is selected but nothing happens
- Error message appears

#### Common Causes

1. **File Too Large**
   ```javascript
   // Max file size: 50MB
   // Check file size
   if (file.size > 50 * 1024 * 1024) {
     alert('File too large');
   }
   ```

2. **Wrong File Type**
   ```javascript
   // Allowed types:
   - .json (JSON files)
   - .txt (Text files)
   - .csv (CSV files)
   ```

3. **Browser Restrictions**
   - Some browsers restrict file access
   - Verify file permissions
   - Try different browser

#### Solutions

```bash
# 1. Check file size
ls -lh yourfile.json
# Should be < 50MB

# 2. Verify file type
file yourfile.json
# Should be "JSON text data" or similar

# 3. Try splitting file
# Split large JSON into smaller chunks

# 4. Use drag & drop instead
# May work better in some cases
```

### Issue: Download Doesn't Start

#### Symptoms
- Click download but nothing happens
- File appears corrupted
- Wrong filename

#### Causes

1. **Browser Settings**
   - Pop-ups blocked
   - Download folder restricted
   - JavaScript disabled

2. **Corrupted Data**
   - Generated content is invalid
   - Format before download

3. **Browser Compatibility**
   - Older browsers may not support
   - Try newer browser

#### Solutions

```javascript
// 1. Check pop-ups aren't blocked
// Whitelist site in browser settings

// 2. Verify data before download
JSON.parse(outputText); // Validate first

// 3. Use alternative download method
// Try right-click > Save As instead

// 4. Check file size
// Extremely large files may fail
// If > 100MB, consider downloading parts
```

### Issue: Batch Processing Fails

#### Symptoms
- Upload multiple files
- Some files fail while others succeed
- Unclear which files processed

#### Solutions

```
1. Try uploading fewer files
   - Test with 2-3 files first
   - Gradually increase

2. Check file compatibility
   - All files same format?
   - All files valid?

3. Check available memory
   - Close other applications
   - Restart browser

4. Try one-at-a-time
   - If batch fails
   - Process files individually
```

---

## Performance Issues

### Issue: Application Runs Slowly

#### Diagnosis Steps

```javascript
// 1. Check memory usage
// DevTools > Memory tab
// Take heap snapshot

// 2. Check CPU usage
// DevTools > Performance tab
// Record profile while using tool

// 3. Check network requests
// DevTools > Network tab
// Look for slow requests

// 4. Check for memory leaks
// DevTools > Memory > Allocation timeline
// Process data multiple times
// Memory should not continuously increase
```

#### Common Causes

1. **Large Input Data**
   - Solution: Split into smaller chunks
   - Use batch processing

2. **Memory Leak**
   - Solution: Restart browser
   - Report if persists

3. **Inefficient Code**
   - Solution: Use optimized tools
   - Report performance issue

4. **Browser Extensions**
   - Solution: Disable extensions
   - Try private/incognito mode

#### Solutions

```bash
# 1. Clear browser cache
# Ctrl+Shift+Delete

# 2. Disable extensions
# DevTools > Extensions > Disable all

# 3. Try incognito mode
# Ctrl+Shift+N (Chrome)
# Cmd+Shift+N (Mac)

# 4. Restart browser
# Close all tabs
# Reopen

# 5. Check memory
# Task Manager > Memory column
# Close other applications
```

### Issue: Web Worker Not Responding

#### Symptoms
- Tool freezes when processing
- No response from Web Worker
- "Worker terminated" error

#### Causes

1. **Worker Script Not Found**
   - 404 error loading formatter.worker.js

2. **Worker Crashed**
   - Unhandled exception in worker
   - Out of memory

3. **Message Not Sent**
   - postMessage() not working
   - Serialization error

#### Solutions

```javascript
// 1. Check if worker loads
fetch('/src/js/formatter.worker.js')
  .then(r => {
    if (!r.ok) throw new Error('Worker not found');
    console.log('Worker found');
  });

// 2. Check message format
worker.postMessage({
  action: 'format',
  data: jsonString,
  indent: 2
  // Ensure all values are serializable (no functions, circular refs)
});

// 3. Add error handler
worker.addEventListener('error', (error) => {
  console.error('Worker error:', error.message);
  console.error('Filename:', error.filename);
  console.error('Line number:', error.lineno);
});

// 4. Verify JSON is serializable
try {
  JSON.stringify(myData);
  console.log('Data is serializable');
} catch (e) {
  console.error('Data not serializable:', e);
}
```

---

## Browser Compatibility Issues

### Issue: Tool Doesn't Work in Specific Browser

#### Supported Browsers

```
✅ Chrome/Chromium 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile: Latest Chrome, Safari, Firefox
```

#### Checking Browser Version

```javascript
// Check browser version
function getBrowserInfo() {
  const ua = navigator.userAgent;
  console.log('User Agent:', ua);
  
  // Simple detection
  if (ua.indexOf('Chrome') > -1) {
    console.log('Chrome detected');
  } else if (ua.indexOf('Firefox') > -1) {
    console.log('Firefox detected');
  } else if (ua.indexOf('Safari') > -1) {
    console.log('Safari detected');
  }
}
```

#### Feature Support

```javascript
// Check for required features
function checkSupport() {
  const supported = {
    webWorkers: typeof(Worker) !== "undefined",
    localStorage: typeof(Storage) !== "undefined",
    fetch: typeof(fetch) !== "undefined",
    blob: typeof(Blob) !== "undefined"
  };
  
  console.log('Support status:', supported);
  
  if (!supported.webWorkers) {
    console.error('Web Workers not supported');
  }
}
```

### Issue: "Web Workers Not Supported"

#### Symptoms
- Error message about Web Workers
- Tools don't respond
- Processing extremely slow

#### Causes
- Very old browser (< 2013)
- Browser settings disable Web Workers
- Unusual environment (incognito with restrictions)

#### Solutions

```javascript
// 1. Update browser
// Download latest version

// 2. Check settings
// Settings > Privacy > Allow Web Workers (if option exists)

// 3. Try different browser
// Download Chrome, Firefox, Safari, or Edge

// 4. Try private/incognito mode
// Sometimes has different restrictions
```

### Issue: Mobile Browser Issues

#### Common Issues

1. **Touch Not Working**
   - Solution: Ensure touch event handlers
   - Try different mobile browser

2. **Keyboard Shows/Hides**
   - Solution: Use viewport-fit CSS
   - Set appropriate height adjustments

3. **No Dark Mode**
   - Solution: System dark mode setting
   - Check OS/browser dark mode settings

#### Mobile Troubleshooting

```javascript
// Detect mobile
function isMobile() {
  return /iPhone|iPad|Android/i.test(navigator.userAgent);
}

// Check touch support
function isTouch() {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
}

// Verify viewport is set
// Should be in head:
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## Development Issues

### Issue: Dev Server Won't Start

#### Symptoms
- `npm run dev` fails
- Port already in use
- Module not found errors

#### Solutions

```bash
# 1. Check Node version
node --version
# Should be v16+

# 2. Reinstall dependencies
rm -rf node_modules
npm install

# 3. Check port availability
# Default: 5173
# If occupied, change in vite.config.js

# 4. Clear npm cache
npm cache clean --force
npm install

# 5. Check for syntax errors
npm run build
# Will show any JS/CSS errors
```

### Issue: Changes Not Reflecting in Browser

#### Symptoms
- Make code change
- Page doesn't update
- Old version still showing

#### Causes
1. Hot Module Replacement (HMR) not working
2. Browser caching
3. Build error preventing reload

#### Solutions

```bash
# 1. Hard refresh browser
# Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# 2. Clear browser cache
# DevTools > Application > Cache > Clear all

# 3. Check console for errors
# F12 > Console tab
# Fix any reported errors

# 4. Restart dev server
# Kill process: Ctrl+C
# Restart: npm run dev

# 5. Verify file saved
# Check file modification time
# Editor might have auto-save disabled
```

### Issue: Build Fails with Errors

#### Common Build Errors

1. **Syntax Error**
   ```
   Error: Unexpected token
   Solution: Fix syntax error in file
   ```

2. **Module Not Found**
   ```
   Error: Cannot find module
   Solution: npm install [missing-package]
   ```

3. **CSS Error**
   ```
   Error in Tailwind CSS
   Solution: Check tailwind.config.js for syntax
   ```

#### Debug Build Issues

```bash
# 1. Run build with verbose output
npm run build -- --debug

# 2. Check specific file
npm run lint -- specific-file.js

# 3. Try clean rebuild
rm -rf dist
npm run build

# 4. Check for TypeScript errors
npx tsc --noEmit
# If TypeScript installed
```

### Issue: Web Worker Not Found in Development

#### Symptoms
- Works in production but not in dev
- 404 for formatter.worker.js

#### Cause
- Development build path different from production

#### Solution

```javascript
// In development, path might be different
// Check vite.config.js for correct path

// Verify worker loads
// DevTools > Network tab
// Search for .worker.js files
// Should show status 200

// If 404, update path in code:
// From: '/src/js/formatter.worker.js'
// To: './src/js/formatter.worker.js'
// (relative path if needed)
```

---

## Deployment Issues

### Issue: Site Returns 404

#### Symptoms
- Get "Not Found" error
- Only index.html loads
- Tools pages show 404

#### Cause
- SPA routing not configured
- _redirects file missing/incorrect

#### Solution

```bash
# 1. Check _redirects exists
cat _redirects

# Should contain:
# /*    /index.html   200

# 2. If missing, create it
echo "/*    /index.html   200" > _redirects

# 3. Verify in dist folder
# After npm run build:
ls dist/_redirects
# Should exist

# 4. Check Netlify settings
# Settings > Redirects
# Should show automatic SPA routing

# 5. Clear cache and redeploy
# Netlify dashboard > Deploys > Trigger deploy
```

### Issue: CSS/JavaScript Not Loading

#### Symptoms
- Page loads but no styling
- Script errors in console
- Assets return 404

#### Causes
1. Asset paths incorrect
2. Files not included in build
3. Cache not cleared

#### Solutions

```bash
# 1. Check build includes assets
ls dist/assets/
# Should show .css and .js files

# 2. Verify asset paths in HTML
grep "src=" dist/index.html
grep "href=" dist/index.html
# Paths should match actual files

# 3. Hard refresh in browser
# Ctrl+Shift+R

# 4. Clear Netlify cache
# Netlify dashboard > Builds > Clear cache & deploy

# 5. Check vite.config.js
# Verify asset configuration correct

# 6. Check _headers for cache headers
# May need to clear old cache
```

### Issue: Site Works Locally but Not on Production

#### Symptoms
- `npm run preview` works
- Deployed site doesn't work
- Different errors on production

#### Common Causes

1. **Environment Variables**
   ```
   Solution: Check Netlify environment variables
   Settings > Build & deploy > Environment
   ```

2. **Base URL Different**
   ```
   Solution: Update vite.config.js base
   base: '/' for root deployment
   ```

3. **API Endpoint Different**
   ```
   Solution: Use environment-specific URLs
   if (import.meta.env.PROD) {
     // Production URL
   }
   ```

4. **Headers/Security**
   ```
   Solution: Check _headers file
   Verify CSP and CORS settings
   ```

#### Debugging

```bash
# 1. Build locally and preview
npm run build
npm run preview

# 2. Compare with deployed version
# Both should work identically

# 3. Check Netlify build logs
# Netlify dashboard > Deploys > [latest] > Deploy log
# Look for errors during build

# 4. Check site accessibility
curl -I https://jsonlab.xyz
# Should return 200 OK

# 5. Use browser DevTools
# Check Console tab for errors
# Check Network tab for failed requests
```

### Issue: Analytics Not Tracking

#### Symptoms
- Google Analytics shows no data
- Real-time shows no visitors
- Events not recording

#### Causes

1. **GTM ID Incorrect**
   ```
   Current: GTM-564CXCJ8
   Verify in HTML: grep "GTM-564CXCJ8" dist/index.html
   ```

2. **Google Analytics Not Linked**
   ```
   Solution: Check Google Analytics account
   Verify GTM property is connected
   ```

3. **Ad Blocker Blocking Analytics**
   ```
   Solution: Check in incognito mode
   Or try different device
   ```

#### Solutions

```bash
# 1. Verify GTM code in HTML
grep -r "gtm.js" dist/

# 2. Check in real-time
# Google Analytics > Real-time
# Visit site in incognito window
# Should see immediate data

# 3. Check GTM container
# Google Tag Manager > Container > Versions
# Verify latest published
# Check for errors in preview mode

# 4. Test with GTM assistant
# Install Chrome extension: Google Tag Manager Assistant
# Visit site
# Should show GTM firing

# 5. Check content security policy
# May be blocking analytics scripts
# Verify CSP allows google-analytics.com
```

---

## Getting Help

### Reporting Issues

When reporting an issue, include:

1. **Description**
   - What you were trying to do
   - What went wrong
   - Expected behavior

2. **Environment**
   ```
   Browser: Chrome 120.0.1234
   OS: Windows 11
   Device: Desktop/Mobile
   URL: https://jsonlab.xyz/tools/formatter/
   ```

3. **Steps to Reproduce**
   ```
   1. Open formatter tool
   2. Paste JSON: {"test": 1}
   3. Click Format
   4. Error appears
   ```

4. **Screenshots/Video**
   - Screenshot of error
   - Browser console errors (F12)
   - Network tab issues (DevTools)

5. **Attempted Solutions**
   - What have you already tried?
   - Did clearing cache help?
   - Works in different browser?

### Where to Report Issues

**GitHub Issues**: https://github.com/baleashvar/jsonlab/issues
- Most reliable way to report
- Can attach files and screenshots
- Developers track and fix

**Email**: sollarity1@gmail.com
- For security issues
- Complex issues
- Feature requests

**Live Chat** (if available)
- Quick questions
- Immediate assistance

### FAQ - Frequently Asked Questions

**Q: Is my data stored on servers?**
A: No! All processing happens in your browser. Data never leaves your device.

**Q: Can I use offline?**
A: After first load, you can work offline. Site uses Service Workers for offline support.

**Q: Are there file size limits?**
A: 50MB per file. Larger files may cause browser slowdown.

**Q: Do you collect analytics?**
A: Only Google Analytics for aggregate usage. No personal data collected.

**Q: Can I contribute?**
A: Yes! See CONTRIBUTING.md in repository.

**Q: Is the code open source?**
A: Yes! MIT license at https://github.com/baleashvar/jsonlab

**Q: How often is it updated?**
A: Regularly. Check GitHub releases for updates.

**Q: Does it work on mobile?**
A: Yes! Fully responsive design for all devices.

---

## Performance Optimization Tips

### For Users

```
1. Use modern browser (Chrome, Firefox, Safari, Edge)
2. Keep browser updated
3. Disable unnecessary extensions
4. Clear browser cache regularly
5. Use incognito mode if issues persist
6. Close other applications to free memory
7. Split very large files before processing
```

### For Developers

```bash
# Monitor performance
npm run build
npm run preview

# Check bundle size
npm list
# Look for large dependencies

# Monitor memory
# DevTools > Memory > Take heap snapshot

# Check for memory leaks
# Process data multiple times
# Memory should stabilize
```

---

## Still Need Help?

If none of these solutions work:

1. **Check Similar Issues**
   - GitHub Issues: Search existing issues
   - May find solution from others

2. **Search Online**
   - Google: "JSONLab [issue description]"
   - Stack Overflow: Tag with relevant tools

3. **Contact Support**
   - Email: sollarity1@gmail.com
   - Include detailed information
   - Provide minimal reproducible example

4. **Create Issue**
   - GitHub: New Issue
   - Include all relevant details
   - Wait for response (usually 24-48 hours)

---

Good luck! Most issues can be resolved with these troubleshooting steps. Don't hesitate to reach out if you need further assistance!

