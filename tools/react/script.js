// React Playground JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const editor = document.getElementById('editor');
  const preview = document.getElementById('preview');
  const runBtn = document.getElementById('run-btn');
  const clearBtn = document.getElementById('clear-btn');
  const copyBtn = document.getElementById('copy-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const status = document.getElementById('status');

  // Theme setup
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.className = theme;
  
  const icons = {
    light: '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>',
    dark: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
  };
  
  document.getElementById('theme-icon').innerHTML = icons[theme];
  
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    document.getElementById('theme-icon').innerHTML = icons[newTheme];
  });

  // Auto-save
  editor.addEventListener('input', () => {
    localStorage.setItem('react_code', editor.value);
  });

  // Load saved code
  const saved = localStorage.getItem('react_code');
  if (saved) editor.value = saved;

  // Clear functionality
  clearBtn.addEventListener('click', () => {
    editor.value = '';
    preview.srcdoc = '';
    status.textContent = 'Cleared';
  });

  // Copy functionality
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(editor.value).then(() => {
      copyBtn.textContent = '✓';
      setTimeout(() => copyBtn.textContent = '📋', 1000);
    }).catch(() => {
      editor.select();
      document.execCommand('copy');
      copyBtn.textContent = '✓';
      setTimeout(() => copyBtn.textContent = '📋', 1000);
    });
  });

  // Run React code
  function runCode() {
    const code = editor.value.trim();
    if (!code) return;
    
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Running...';
    status.textContent = 'Compiling...';
    
    try {
      const iframeDoc = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>' +
        '<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>' +
        '<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>' +
        '</head>' +
        '<body style="margin:0;padding:0;font-family:system-ui">' +
        '<div id="root"></div>' +
        '<script type="text/babel">' +
        'try {' +
        code +
        '} catch (error) {' +
        'document.getElementById("root").innerHTML = "<div style=\\"background:#fee;border:1px solid #f87171;padding:10px;margin:10px;border-radius:5px;color:#dc2626\\"><strong>Error:</strong> " + error.message + "</div>";' +
        '}' +
        '</script>' +
        '</body>' +
        '</html>';
      
      preview.srcdoc = iframeDoc;
      status.textContent = 'Ready';
      
    } catch (error) {
      preview.srcdoc = '<div style="padding:20px;color:red">Error: ' + error.message + '</div>';
      status.textContent = 'Error';
    }
    
    runBtn.disabled = false;
    runBtn.textContent = '▶ Run';
  }

  // Event listeners
  refreshBtn.addEventListener('click', runCode);
  runBtn.addEventListener('click', runCode);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  });

  // Smart indentation for JSX
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cursorPos = editor.selectionStart;
      const textBeforeCursor = editor.value.substring(0, cursorPos);
      const currentLine = textBeforeCursor.split('\n').pop();
      
      const indentMatch = currentLine.match(/^(\s*)/);
      let currentIndent = indentMatch ? indentMatch[1] : '';
      
      if (currentLine.trim().endsWith('{') || currentLine.trim().endsWith('(')) {
        currentIndent += '  '; // 2 spaces for JSX
      }
      
      if (currentIndent) {
        e.preventDefault();
        const textAfterCursor = editor.value.substring(cursorPos);
        editor.value = textBeforeCursor + '\n' + currentIndent + textAfterCursor;
        editor.selectionStart = editor.selectionEnd = cursorPos + 1 + currentIndent.length;
      }
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
  });

  // Initial run
  setTimeout(() => {
    if (editor.value.trim()) {
      runCode();
    }
  }, 500);
});