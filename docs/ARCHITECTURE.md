# JSONLab Tool Architecture

## Overview

JSONLab is a privacy-first, client-side JSON processing application built with a modern web architecture. All tools run directly in the user's browser with zero server-side processing, ensuring complete data privacy and offline functionality.

## Core Architecture

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript (Module-based ES6+)
- **Styling**: TailwindCSS 3.4 with PostCSS
- **Build Tool**: Vite 5.0
- **Runtime Processing**: Web Workers for heavy computations
- **State Management**: Browser LocalStorage for preferences
- **Theme System**: CSS classes with LocalStorage persistence

### Project Structure

```
jsonlab/
├── src/
│   ├── css/
│   │   └── styles.css           # Global styles with TailwindCSS
│   └── js/
│       ├── formatter.worker.js  # Web Worker for JSON operations
│       └── theme.js             # Theme toggle and persistence
├── tools/                        # Individual tool implementations
│   ├── formatter/               # JSON Formatter
│   ├── validator/               # JSON Validator
│   ├── minifier/                # JSON Minifier
│   ├── tree/                    # JSON Tree Viewer
│   ├── json-diff/               # JSON Diff Tool
│   ├── csv-json/                # CSV to JSON Converter
│   ├── json-csv/                # JSON to CSV Converter
│   ├── yaml-json/               # YAML to JSON Converter
│   ├── xml-json/                # XML to JSON Converter
│   ├── xml-formatter/           # XML Formatter
│   ├── json-to-types/           # JSON to TypeScript/Go/Java
│   ├── base64/                  # Base64 Encode/Decode
│   ├── url-encode/              # URL Encode/Decode
│   ├── uuid/                    # UUID Generator
│   ├── hash-generator/          # Hash Generator
│   ├── jwt-decoder/             # JWT Token Decoder
│   ├── python/                  # Python Compiler
│   ├── golang/                  # Golang Formatter
│   └── [other-tools]/
├── ai-tools/                     # AI-related tools
├── blog/                         # Blog articles
├── public/                       # Static assets
├── docs/                         # Documentation
└── package.json                  # Project configuration
```

## Processing Pipeline

### Web Worker Architecture

JSONLab uses Web Workers to handle CPU-intensive operations without blocking the main UI thread:

1. **Main Thread**
   - Handles user interactions (input/button clicks)
   - Manages DOM updates
   - Communicates with Web Workers
   - Manages file I/O operations

2. **Worker Thread**
   - Performs JSON parsing and stringification
   - Validates JSON syntax
   - Transforms data formats
   - Returns results back to main thread

```
User Input → Main Thread → postMessage() → Worker Thread → Processing
                                                          ↓
                                                    postMessage() → Update DOM
```

### Data Flow

1. **User inputs JSON data** via textarea or file upload
2. **Main thread sends message** to worker with action type (format, minify, validate)
3. **Worker processes data** independently
4. **Worker sends result** back to main thread
5. **Main thread updates DOM** with formatted/processed data

## Key Features

### 1. Privacy-First Design

- **Zero Server Communication**: All processing happens locally
- **No Data Collection**: User data never leaves the browser
- **Offline Capable**: Works without internet connection
- **No Tracking**: Browser-only analytics using privacy-first metrics

### 2. Performance Optimizations

- **Code Splitting**: Each tool loads independently
- **Web Worker Usage**: Non-blocking heavy computations
- **Lazy Loading**: Tools load on demand
- **Caching**: LocalStorage for user preferences and themes
- **Minified Assets**: Production builds are optimized for size

### 3. User Experience

- **Dark/Light Mode**: Theme toggle with LocalStorage persistence
- **Responsive Design**: Mobile-first, works on all devices
- **Keyboard Shortcuts**: Productivity features
- **Batch Processing**: Upload multiple files, download as ZIP
- **URL Sharing**: Generate shareable links with data

### 4. Accessibility

- **ARIA Labels**: Proper semantic HTML
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG compliant colors
- **Screen Reader Support**: Proper heading hierarchy

## Tool Implementation Patterns

### Standard Tool Structure

Each tool follows a consistent pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Meta tags, analytics, styling -->
</head>
<body>
  <!-- Header with navigation and theme toggle -->
  <header>...</header>
  
  <!-- Main content area -->
  <main>
    <!-- Intro section with description -->
    <!-- Control buttons -->
    <!-- Input textarea -->
    <!-- Output area -->
  </main>
  
  <!-- Scripts -->
  <script type="module" src="/src/js/theme.js"></script>
  <script>
    // Tool-specific logic
  </script>
</body>
</html>
```

### Common Operations

All tools implement these standard operations:

- **Input Handling**: Accept text, files, or uploads
- **Processing**: Use Web Workers for heavy lifting
- **Error Handling**: Display user-friendly error messages with line/column info
- **Output Display**: Show results in formatted or raw form
- **Export Options**: Copy to clipboard, download as file
- **Batch Mode**: Process multiple files if supported

## Security Considerations

### Content Security Policy

- Strict CSP headers prevent XSS attacks
- No inline scripts (using external modules)
- Whitelist for external resources (Google Analytics, CDNs)

### Input Validation

- JSON parsing validates syntax before processing
- File uploads checked for size and type
- URL parameters sanitized before use

### Data Protection

- No persistent storage of user data
- LocalStorage only stores preferences and themes
- Session data cleared on page close
- No cookies for tracking

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Minimum Requirements**:
  - ES6 JavaScript support
  - Web Worker support
  - localStorage API
  - Fetch API (if applicable)

## Performance Metrics

- **First Load**: < 2 seconds
- **Tool Load**: < 500ms
- **JSON Processing**: < 100ms (for 1MB JSON)
- **Web Worker Response**: < 50ms overhead
- **Memory Usage**: < 50MB for typical use cases

## Development Workflow

### Setup

```bash
npm install
npm run dev    # Start development server
npm run build  # Production build
npm run preview # Preview production build
```

### Build Process

1. **Vite Development**: Hot module replacement for fast development
2. **Tree Shaking**: Remove unused code
3. **Asset Optimization**: Minify CSS and JavaScript
4. **HTML Processing**: Inline critical CSS when needed

### Deployment

- Built artifacts deployed to Netlify
- Headers configured for security
- Redirects set up for URL routing
- DNS configured for jsonlab.xyz domain

## Future Architecture Plans

- Server-side API for advanced features (premium tier)
- Database for user accounts and saved sessions
- Real-time collaboration features
- Extended language support for type generation
- Plugin system for custom tools

## References

- [Web Workers MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [JSON Specification](https://www.json.org/)
