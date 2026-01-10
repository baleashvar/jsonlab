# JSONLab Code Style Guide

This guide outlines the coding standards and conventions used in the JSONLab project to maintain consistency, readability, and maintainability.

## Table of Contents

- [JavaScript Style Guide](#javascript-style-guide)
- [HTML Guidelines](#html-guidelines)
- [CSS/Tailwind Guidelines](#css-tailwind-guidelines)
- [File Organization](#file-organization)
- [Documentation Standards](#documentation-standards)

---

## JavaScript Style Guide

### General Principles

1. **Use ES6+ Features**: Leverage modern JavaScript features
2. **Keep Functions Small**: Single responsibility principle
3. **Avoid Global State**: Minimize global variables
4. **Explicit is Better**: Clear code over clever code

### Syntax and Formatting

#### Naming Conventions

```javascript
// Variables and functions: camelCase
const userName = 'John';
function getUserData() { }

// Classes and constructors: PascalCase
class JSONProcessor { }

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const DEFAULT_INDENT = 2;

// Private methods: prefix with underscore
function _processInternally() { }

// Boolean variables: prefix with is, has, should, can
const isValid = true;
const hasErrors = false;
const shouldRetry = true;
const canProcess = true;
```

#### Variable Declaration

```javascript
// ✅ Good: Use const by default
const name = 'John';

// ✅ Good: Use let for variables that change
let count = 0;
count++;

// ❌ Avoid: Don't use var
var oldStyle = 'avoid';

// ✅ Good: Group related declarations
const userId = 123;
const userName = 'John';
const userEmail = 'john@example.com';
```

#### Function Style

```javascript
// ✅ Good: Arrow functions for callbacks
const processData = (data) => {
  return JSON.parse(data);
};

// ✅ Good: Regular function declarations for main functions
function formatJSON(input, indent) {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

// ✅ Good: Clear parameter names
function validateJSON(jsonString, options = {}) {
  const { strict = false } = options;
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// ❌ Avoid: Overly complex arrow functions
const bad = x => x > 0 ? 'positive' : 'negative';

// ✅ Good: Multi-line for clarity
const processValue = (x) => {
  if (x > 0) {
    return 'positive';
  }
  return 'negative';
};
```

#### Control Flow

```javascript
// ✅ Good: Clear if-else statements
if (isValid) {
  processData();
} else if (shouldRetry) {
  retryProcess();
} else {
  handleError();
}

// ✅ Good: Guard clauses to reduce nesting
function process(data) {
  if (!data) return null;
  if (!isValid(data)) throw new Error('Invalid data');
  
  // Main logic here
  return transform(data);
}

// ✅ Good: Use early returns
function getData(id) {
  if (!id) return null;
  const cached = cache.get(id);
  if (cached) return cached;
  
  return fetch(id);
}

// ❌ Avoid: Deep nesting
function bad(data) {
  if (data) {
    if (isValid) {
      if (shouldProcess) {
        // Too deep
      }
    }
  }
}
```

#### Error Handling

```javascript
// ✅ Good: Specific error messages
try {
  const parsed = JSON.parse(input);
  return { success: true, data: parsed };
} catch (error) {
  const match = error.message.match(/position (\d+)/);
  const position = match ? parseInt(match[1]) : 0;
  const lines = input.substring(0, position).split('\n');
  
  return {
    success: false,
    error: error.message,
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

// ✅ Good: Document error conditions
/**
 * Validates JSON string
 * @throws {SyntaxError} If JSON is malformed
 * @returns {Object} Validation result with error details
 */
function validate(jsonString) {
  // Implementation
}

// ❌ Avoid: Silent failures
try {
  JSON.parse(input);
} catch (e) {
  // Don't silently ignore
}
```

### Web Workers

```javascript
// ✅ Good: Clear message structure
self.onmessage = (e) => {
  const { action, data, options } = e.data;
  
  try {
    let result;
    
    switch (action) {
      case 'format':
        result = formatData(data, options);
        break;
      case 'minify':
        result = minifyData(data);
        break;
      case 'validate':
        result = validateData(data);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    self.postMessage({ success: true, result });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

// ✅ Good: Clear response format
self.postMessage({
  success: true,
  result: processedData,
  metadata: {
    inputSize: input.length,
    outputSize: output.length,
    processingTime: endTime - startTime
  }
});
```

### Comments and Documentation

```javascript
// ✅ Good: JSDoc for public functions
/**
 * Formats JSON string with specified indentation
 * @param {string} jsonString - The JSON string to format
 * @param {number|string} indent - Indentation (2, 4, or 'tab')
 * @returns {string} Formatted JSON string
 * @throws {SyntaxError} If JSON is invalid
 * @example
 * const formatted = formatJSON('{"a":1}', 2);
 * // Returns: "{\n  "a": 1\n}"
 */
function formatJSON(jsonString, indent = 2) {
  const parsed = JSON.parse(jsonString);
  return JSON.stringify(parsed, null, indent);
}

// ✅ Good: Inline comments for complex logic
// Split the error message to extract line and column info
const match = error.message.match(/position (\d+)/);
const position = match ? parseInt(match[1]) : 0;

// ❌ Avoid: Obvious comments
const name = 'John'; // Set name to John

// ✅ Good: TODO comments with context
// TODO: Implement batch processing for large files (Issue #42)
function processBatch(files) {
  // Current implementation processes one file at a time
}
```

### Performance Considerations

```javascript
// ✅ Good: Cache DOM queries
const inputElement = document.getElementById('input');
const outputElement = document.getElementById('output');

function update() {
  // Reuse cached references
  const value = inputElement.value;
  outputElement.textContent = process(value);
}

// ❌ Avoid: Repeated DOM queries
function bad() {
  document.getElementById('input').value;
  document.getElementById('output').textContent;
  document.getElementById('input').focus();
  // Queried #input three times!
}

// ✅ Good: Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedValidate = debounce(() => {
  validateInput();
}, 500);

// ✅ Good: Use Web Workers for heavy lifting
const worker = new Worker('/src/js/formatter.worker.js');
worker.postMessage({ action: 'format', data: largeJSON });
worker.onmessage = (e) => displayResult(e.data);
```

---

## HTML Guidelines

### Semantic HTML

```html
<!-- ✅ Good: Use semantic elements -->
<header>
  <nav>Navigation content</nav>
</header>
<main>
  <article>Article content</article>
  <aside>Sidebar content</aside>
</main>
<footer>Footer content</footer>

<!-- ❌ Avoid: Generic divs for structure -->
<div class="header">
  <div class="nav">Navigation content</div>
</div>
```

### Accessibility

```html
<!-- ✅ Good: Use proper labels -->
<label for="input-json">Input JSON:</label>
<textarea id="input-json" aria-label="JSON input area"></textarea>

<!-- ✅ Good: Alt text for images -->
<img src="icon.svg" alt="Format button icon" />

<!-- ✅ Good: ARIA labels for buttons -->
<button id="format-btn" aria-label="Format JSON">
  <svg>...</svg>
</button>

<!-- ✅ Good: Proper heading hierarchy -->
<h1>Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h2>Section 2</h2>

<!-- ❌ Avoid: Skipping heading levels -->
<h1>Title</h1>
<h3>Section</h3> <!-- Should be h2 -->
```

### Meta Tags

```html
<!-- ✅ Good: Complete meta information -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="description" content="Tool description for SEO" />
<meta property="og:title" content="Sharing title" />
<meta property="og:description" content="Sharing description" />
<meta property="og:image" content="thumbnail.jpg" />
<link rel="canonical" href="https://jsonlab.xyz/tools/formatter/" />

<!-- ✅ Good: Security headers -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="DENY" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
```

---

## CSS/Tailwind Guidelines

### Class Organization

```html
<!-- ✅ Good: Organized Tailwind classes -->
<div class="flex flex-col h-screen">
  <!-- Layout classes first -->
  <!-- Sizing classes second -->
  <!-- Spacing classes third -->
  <!-- Color/styling classes last -->
</div>

<!-- ✅ Good: Responsive prefixes -->
<div class="flex-col lg:flex-row">
  <!-- Stack on mobile, row on large screens -->
</div>

<!-- ✅ Good: Dark mode support -->
<div class="bg-white dark:bg-gray-800">
  <p class="text-gray-900 dark:text-gray-100">Content</p>
</div>
```

### Theme Colors

```html
<!-- ✅ Good: Use theme colors consistently -->
<button class="bg-primary text-white hover:bg-blue-600">Primary Button</button>
<button class="bg-gray-200 dark:bg-gray-700">Secondary Button</button>

<!-- Define custom colors in tailwind.config.js -->
```

### Custom CSS

```css
/* ✅ Good: Minimal custom CSS, leverage Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ Good: Custom components for reusable styles */
@layer components {
  .code-editor {
    @apply font-mono text-sm bg-white dark:bg-gray-800 rounded border;
  }

  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded hover:bg-blue-600;
  }
}

/* ✅ Good: Use CSS variables for theming */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
}

.dark {
  --color-primary: #60a5fa;
}

/* ❌ Avoid: Over-use of inline styles -->
<div style="padding: 16px; color: red;">Don't do this</div>
```

---

## File Organization

### Directory Structure

```
tools/
├── formatter/
│   ├── index.html          # Main tool file
│   └── README.md          # Tool-specific documentation
├── validator/
│   ├── index.html
│   └── README.md
└── [other-tools]/

src/
├── css/
│   └── styles.css         # Global styles
└── js/
    ├── formatter.worker.js # Web Worker
    └── theme.js           # Shared utilities

docs/
├── ARCHITECTURE.md        # System design
├── API_REFERENCE.md      # API documentation
├── CODE_STYLE.md         # This file
├── DEPLOYMENT.md         # Deployment guide
└── TROUBLESHOOTING.md    # Troubleshooting
```

### File Naming

```
// ✅ Good: Descriptive names
formatter.worker.js       // Worker for formatting
json-validator.js         // JSON validation utilities
theme-toggle.js           // Theme switching

// ❌ Avoid: Single letter or unclear names
f.js
util.js
main-logic.js
```

### Module Organization

```javascript
// ✅ Good: Logical grouping of related functionality
// processJSON.js
export function format(json, indent) { }
export function minify(json) { }
export function validate(json) { }

// ✅ Good: Default export for main functionality
export default function formatJSON(json, indent) { }

// ❌ Avoid: Mixing related and unrelated functions
export function formatJSON() { }
export function sendAnalytics() { }
export function fetchUsers() { }
```

---

## Documentation Standards

### README for Each Tool

```markdown
# Tool Name

## Description
Brief description of what the tool does

## Features
- Feature 1
- Feature 2

## Usage
How to use the tool

## Examples
Code or usage examples

## API Reference
If applicable, document the API

## Limitations
Known limitations or constraints
```

### Inline Documentation

```javascript
/**
 * Summary line explaining what this function does.
 *
 * Longer description if needed, explaining the behavior,
 * edge cases, and important notes.
 *
 * @param {type} paramName - Parameter description
 * @param {type} [optionalParam] - Optional parameter description
 * @returns {type} Return value description
 * @throws {ErrorType} Error condition description
 * @example
 * // Example usage
 * const result = functionName(param1, param2);
 * console.log(result);
 */
function functionName(paramName, optionalParam) {
  // Implementation
}
```

### Commit Messages

```
// ✅ Good: Clear, descriptive commit messages

feat: Add batch processing to JSON formatter
  - Implement file selection for multiple JSONs
  - Add ZIP download functionality
  - Display processing statistics

fix: Resolve memory leak in Web Worker
  - Properly clean up message listeners
  - Add worker termination on page unload

docs: Update API reference for formatter tool
  - Add examples for batch processing
  - Document error response format

refactor: Simplify JSON validation logic
  - Extract error parsing to separate function
  - Improve error message clarity

// ❌ Avoid: Vague messages
"Fixed stuff"
"Updated code"
"WIP: testing"
```

---

## Git Workflow

### Branching Strategy

```
main                    # Production code
├── feature/add-tool-name
├── fix/issue-number
└── docs/documentation-update
```

### Pull Request Guidelines

- Link to related issue
- Provide clear description
- Include before/after examples if applicable
- Test in multiple browsers
- Ensure no console errors/warnings

---

## Testing Standards

### Code Quality Checks

```bash
# Run linter
npm run lint

# Fix formatting
npm run lint:fix

# Build check
npm run build

# Preview build
npm run preview
```

### Testing Checklist

- [ ] Functionality works as intended
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on mobile browsers
- [ ] Dark mode works correctly
- [ ] Accessibility verified (keyboard nav, screen readers)
- [ ] No console errors or warnings
- [ ] Performance acceptable (no jank)
- [ ] File uploads/downloads work

---

## Performance Checklist

- [ ] Use Web Workers for heavy computations
- [ ] Cache DOM references
- [ ] Minimize re-renders
- [ ] Lazy load non-critical resources
- [ ] Optimize asset sizes
- [ ] Use appropriate data structures
- [ ] Avoid memory leaks
- [ ] Profile with DevTools

---

## Security Checklist

- [ ] Validate user input
- [ ] Sanitize HTML content
- [ ] Use CSP headers
- [ ] No hardcoded secrets
- [ ] HTTPS enforced
- [ ] Dependencies updated
- [ ] No eval() or similar functions
- [ ] Cross-origin requests properly handled

---

## Questions or Clarifications?

For questions about coding standards or style choices:
1. Check existing code patterns
2. Refer to this guide
3. Open an issue for discussion
4. Follow the team's decision in code review

