# JSONLab Tools - API Reference

## Tool Categories

- [JSON Processing Tools](#json-processing-tools)
- [Conversion Tools](#conversion-tools)
- [Encoding & Utilities](#encoding--utilities)
- [Advanced Tools](#advanced-tools)

---

## JSON Processing Tools

### 1. JSON Formatter

**Endpoint**: `/tools/formatter/`

**Description**: Format and beautify JSON with syntax highlighting, batch processing, and URL sharing.

**Features**:
- Format with custom indentation (2 spaces, 4 spaces, or tabs)
- Minify JSON to remove whitespace
- Syntax highlighting with line numbers
- Copy to clipboard
- Download as file
- Batch upload and process multiple files
- Generate shareable links
- Upload drag & drop support

**API (Web Worker)**:
```javascript
// Message format
{
  action: 'format' | 'minify' | 'validate',
  data: string,        // JSON string
  indent: number | 'tab'
}

// Response
{
  success: true,
  result: string       // Formatted JSON
}
```

**Usage Example**:
```javascript
const worker = new Worker('/src/js/formatter.worker.js');
worker.postMessage({
  action: 'format',
  data: '{"name":"John","age":30}',
  indent: 2
});
worker.onmessage = (e) => {
  console.log(e.data.result);
};
```

**Error Handling**:
```javascript
{
  success: false,
  error: string,       // Error message
  line: number,        // Line number (1-indexed)
  column: number       // Column number (1-indexed)
}
```

---

### 2. JSON Validator

**Endpoint**: `/tools/validator/`

**Description**: Validate JSON syntax and find errors instantly with detailed error messages.

**Features**:
- Validate JSON with detailed error reporting
- Line and column information for errors
- JSON5 mode (allows trailing commas and single quotes)
- Auto-fix functionality for common issues
- Clear button to reset
- Real-time validation feedback

**API**:
```javascript
// Standard JSON validation
const validation = validateJSON(jsonString);
// Returns: { valid: true } or { valid: false, error: string, line: number, column: number }

// JSON5 validation
const validation = validateJSON5(jsonString);
// Automatically fixes: trailing commas, single quotes
// Returns: { valid: true, fixed: string } or { valid: false, error: string }
```

**Common Error Messages**:
- `Unexpected token } in JSON at position X` - Trailing comma before closing brace
- `Unexpected token ] in JSON at position X` - Trailing comma before closing bracket
- `Unexpected token ' in JSON at position X` - Single quotes instead of double quotes

---

### 3. JSON Minifier

**Endpoint**: `/tools/minifier/`

**Description**: Compress JSON by removing whitespace and unnecessary characters.

**Features**:
- Remove all whitespace
- Reduce file size by 30-50%
- Preserve data integrity
- Fast processing with Web Workers
- Copy result to clipboard
- Download minified JSON

**Output Size Reduction**: 
- Input: `{"name":"John","age":30,"city":"New York"}`
- Output: `{"name":"John","age":30,"city":"New York"}`
- Size reduction depends on original formatting

---

### 4. JSON Tree Viewer

**Endpoint**: `/tools/tree/`

**Description**: Interactive collapsible tree view of JSON data with virtualized rendering for large files.

**Features**:
- Collapsible/expandable tree nodes
- Syntax highlighting
- Virtualized rendering (efficient for large JSON)
- Search/filter functionality
- Copy individual values
- Expand/collapse all buttons
- Display data types (string, number, boolean, null, object, array)

**Navigation Keys**:
- `Arrow Up/Down`: Navigate between nodes
- `Arrow Left`: Collapse node
- `Arrow Right`: Expand node
- `Enter`: Toggle node expansion

---

### 5. JSON Diff

**Endpoint**: `/tools/json-diff/`

**Description**: Compare two JSON objects side-by-side and visualize differences.

**Features**:
- Side-by-side comparison
- Highlight differences
- Show added/removed/modified fields
- Color-coded changes (green for additions, red for deletions, yellow for modifications)
- Upload two JSON files
- Copy differences to clipboard

**Comparison Types**:
- Field additions
- Field removals
- Value changes
- Type changes
- Nested object changes

---

## Conversion Tools

### 6. YAML to JSON Converter

**Endpoint**: `/tools/yaml-json/`

**Description**: Convert YAML format to JSON with automatic formatting.

**Features**:
- Convert YAML to valid JSON
- Preserve data types
- Handle nested structures
- Error reporting with line numbers
- Auto-detect indentation
- Download as JSON file

**Supported YAML Features**:
- Nested objects and arrays
- Comments (removed in JSON output)
- Multi-line strings
- Null values
- Boolean values
- Numbers and strings

---

### 7. XML to JSON Converter

**Endpoint**: `/tools/xml-json/`

**Description**: Transform XML data to JSON format with configurable output.

**Features**:
- Convert well-formed XML to JSON
- Preserve attributes and text content
- Handle namespaces
- Configurable output format
- Error detection with line numbers
- Beautiful output formatting

**Output Format**:
```json
{
  "root": {
    "child": {
      "@attribute": "value",
      "#text": "content"
    }
  }
}
```

---

### 8. CSV to JSON Converter

**Endpoint**: `/tools/csv-json/`

**Description**: Convert CSV files to JSON format with automatic header detection.

**Features**:
- Auto-detect headers from first row
- Custom delimiter support (comma, semicolon, tab, pipe)
- Quote handling for fields with commas
- Handle missing fields
- Batch processing
- Download as JSON

**Usage**:
```
name,age,city
John,30,New York
Jane,25,Boston
```

**Output**:
```json
[
  {"name": "John", "age": "30", "city": "New York"},
  {"name": "Jane", "age": "25", "city": "Boston"}
]
```

---

### 9. JSON to CSV Converter

**Endpoint**: `/tools/json-csv/`

**Description**: Export JSON data as CSV with customizable options.

**Features**:
- Auto-detect headers from JSON keys
- Flatten nested objects
- Custom delimiter support
- Quote fields with special characters
- Handle arrays of objects
- Download as CSV file

**Input Requirements**:
- Must be an array of objects
- Each object becomes a CSV row
- Object keys become headers

---

### 10. JSON to Types

**Endpoint**: `/tools/json-to-types/`

**Description**: Generate TypeScript, Go, Java, or Rust types from JSON schema.

**Features**:
- Generate TypeScript interfaces
- Generate Go structs
- Generate Java classes
- Generate Rust structs
- Copy generated code to clipboard
- Support for nested types
- Optional fields detection

**Example - TypeScript Output**:
```typescript
interface Root {
  name: string;
  age: number;
  email?: string;
  address: Address;
}

interface Address {
  street: string;
  city: string;
}
```

**Language Support**:
- TypeScript (interfaces)
- Go (structs with JSON tags)
- Java (classes with getters/setters)
- Rust (structs with serde)

---

### 11. XML Formatter

**Endpoint**: `/tools/xml-formatter/`

**Description**: Format and beautify XML with syntax validation.

**Features**:
- Format with custom indentation
- Pretty-print XML
- Validate XML syntax
- Close unclosed tags
- Remove unnecessary whitespace
- Minify option
- Error reporting

**Indentation Options**:
- 2 spaces
- 4 spaces
- Tab
- Custom characters

---

## Encoding & Utilities

### 12. Base64 Encode/Decode

**Endpoint**: `/tools/base64/`

**Description**: Encode or decode Base64 strings with automatic format detection.

**Features**:
- Encode text to Base64
- Decode Base64 to text
- Auto-detect input format
- Copy to clipboard
- Download as file
- Handle large files
- Character encoding support (UTF-8)

**API**:
```javascript
// Encoding
const encoded = btoa(unescape(encodeURIComponent(text)));

// Decoding
const decoded = decodeURIComponent(escape(atob(base64)));
```

---

### 13. URL Encode/Decode

**Endpoint**: `/tools/url-encode/`

**Description**: Handle URL encoding and decoding with special character support.

**Features**:
- Encode URLs and parameters
- Decode encoded URLs
- Handle special characters
- Support for UTF-8 characters
- Auto-detect input format
- Generate URL-safe strings
- Copy results
- Download encoded data

**Encoding Types**:
- URL encoding (application/x-www-form-urlencoded)
- Percent encoding (RFC 3986)

---

### 14. UUID Generator

**Endpoint**: `/tools/uuid/`

**Description**: Generate random UUIDs (v4) and other UUID versions.

**Features**:
- Generate UUID v4 (random)
- Generate UUID v1 (timestamp-based)
- Generate multiple UUIDs at once
- Copy to clipboard
- Export as JSON array
- Download as CSV/TXT
- Batch generation

**UUID Versions Supported**:
- v1: Time-based UUID
- v4: Random UUID (most common)
- v5: Name-based SHA-1 UUID

---

### 15. Hash Generator

**Endpoint**: `/tools/hash-generator/`

**Description**: Generate cryptographic hashes for strings and files.

**Features**:
- MD5 (deprecated but available)
- SHA-1
- SHA-256
- SHA-512
- Copy hash to clipboard
- Support for text and file inputs
- Real-time hash calculation
- Compare hashes

**Hash Algorithms**:
```javascript
// All use Web Crypto API or crypto-js library
hashString('hello', 'sha256') // Returns SHA-256 hash
```

---

## Advanced Tools

### 16. JWT Decoder

**Endpoint**: `/tools/jwt-decoder/`

**Description**: Decode and analyze JWT tokens with signature verification information.

**Features**:
- Decode JWT header, payload, signature
- Validate token structure
- Display claims information
- Copy individual components
- Verify signature (if secret provided)
- Show expiration time
- Pretty-print JSON payload

**JWT Structure Decoded**:
```json
{
  "header": {"alg": "HS256", "typ": "JWT"},
  "payload": {"sub": "1234567890", "name": "John Doe", "iat": 1516239022},
  "signature": "signature_here",
  "valid": true,
  "expired": false
}
```

---

### 17. Python Compiler

**Endpoint**: `/tools/python/`

**Description**: Execute Python code directly in the browser (limited functionality).

**Features**:
- Run Python code in browser
- Limited standard library support
- Basic output printing
- Error handling and display
- Save scripts locally
- Share script via URL

**Limitations**:
- No file I/O
- Limited library support
- Execution timeout: 5 seconds
- No external network requests

---

### 18. Golang Formatter

**Endpoint**: `/tools/golang/`

**Description**: Format Go code with proper indentation and syntax checking.

**Features**:
- Format Go code
- Validate Go syntax
- Proper indentation
- Copy formatted code
- Download as .go file

---

## Common Response Formats

### Success Response

```javascript
{
  success: true,
  result: string,           // Processing result
  stats?: {
    inputSize: number,      // Input size in bytes
    outputSize: number,     // Output size in bytes
    processingTime: number  // Time in milliseconds
  }
}
```

### Error Response

```javascript
{
  success: false,
  error: string,            // Error message
  line?: number,            // Error line (1-indexed)
  column?: number,          // Error column (1-indexed)
  details?: string          // Additional details
}
```

## Rate Limiting

- No rate limiting for client-side processing
- File upload limits: 50MB per file
- Batch processing: Up to 100 files
- Browser memory constraints apply

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Process/Format
- `Ctrl/Cmd + Shift + C`: Copy result
- `Ctrl/Cmd + Shift + D`: Download result
- `Ctrl/Cmd + Shift + L`: Clear all

## Browser Compatibility

All tools work in:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers with ES6 support

## Examples

See the `/examples` folder for detailed code samples for each tool.

## Support

For issues or feature requests related to specific tools, please refer to:
- GitHub Issues: https://github.com/baleashvar/jsonlab/issues
- Email: sollarity1@gmail.com
