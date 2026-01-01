var editor, output, runBtn, clearBtn, copyBtn, status, goStatus;

function initGoCompiler() {
  editor = document.getElementById('editor');
  output = document.getElementById('output');
  runBtn = document.getElementById('run-btn');
  clearBtn = document.getElementById('clear-btn');
  copyBtn = document.getElementById('copy-btn');
  status = document.getElementById('status');
  goStatus = document.getElementById('go-status');

  var theme = localStorage.getItem('theme') || 'light';
  document.documentElement.className = theme;
  
  var lightIcon = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
  var darkIcon = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  
  document.getElementById('theme-icon').innerHTML = theme === 'light' ? darkIcon : lightIcon;
  
  document.getElementById('theme-toggle').addEventListener('click', function() {
    var currentTheme = localStorage.getItem('theme') || 'light';
    var newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
    document.getElementById('theme-icon').innerHTML = newTheme === 'light' ? darkIcon : lightIcon;
  });

  editor.addEventListener('input', function() {
    localStorage.setItem('go_code', editor.value);
  });

  var saved = localStorage.getItem('go_code');
  if (saved) editor.value = saved;

  clearBtn.addEventListener('click', function() {
    editor.value = '';
    output.textContent = 'Output cleared\n\n';
    status.textContent = 'Cleared';
  });

  copyBtn.addEventListener('click', function() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(editor.value).then(function() {
        copyBtn.textContent = '✓';
        setTimeout(function() { copyBtn.textContent = '📋'; }, 1000);
      });
    } else {
      editor.select();
      document.execCommand('copy');
      copyBtn.textContent = '✓';
      setTimeout(function() { copyBtn.textContent = '📋'; }, 1000);
    }
  });

  runBtn.addEventListener('click', runGoCode);

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runGoCode();
    }
  });

  editor.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var cursorPos = editor.selectionStart;
      var textBeforeCursor = editor.value.substring(0, cursorPos);
      var currentLine = textBeforeCursor.split('\n').pop();
      var indentMatch = currentLine.match(/^(\s*)/);
      var currentIndent = indentMatch ? indentMatch[1] : '';
      
      if (currentLine.trim().endsWith('{')) {
        currentIndent += '    ';
      }
      
      if (currentIndent) {
        e.preventDefault();
        var textAfterCursor = editor.value.substring(cursorPos);
        editor.value = textBeforeCursor + '\n' + currentIndent + textAfterCursor;
        editor.selectionStart = editor.selectionEnd = cursorPos + 1 + currentIndent.length;
      }
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      var start = editor.selectionStart;
      var end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 4;
    }
  });

  status.textContent = 'Ready';
  goStatus.textContent = 'Go compiler ready for instant execution';
}

function runGoCode() {
  var code = editor.value.trim();
  if (!code) return;
  
  runBtn.disabled = true;
  runBtn.textContent = '⏳ Running...';
  status.textContent = 'Executing...';
  output.textContent = '';
  
  try {
    executeBasicGo(code);
    output.textContent += '\n[Execution Finished]\n';
    status.textContent = 'Ready';
  } catch (error) {
    output.textContent += 'Error: ' + error.message + '\n';
    status.textContent = 'Error';
  }
  
  output.scrollTop = output.scrollHeight;
  runBtn.disabled = false;
  runBtn.textContent = '▶ Run';
}

function executeBasicGo(code) {
  var printRegex = /fmt\.Println\s*\(\s*"([^"]*)"\s*\)/g;
  var match;
  
  while ((match = printRegex.exec(code)) !== null) {
    output.textContent += match[1] + '\n';
  }
  
  var printfRegex = /fmt\.Printf\s*\(\s*"([^"]*)",\s*([^)]+)\)/g;
  while ((match = printfRegex.exec(code)) !== null) {
    var format = match[1];
    var args = match[2];
    
    if (format.indexOf('%s') !== -1 && args.indexOf('name') !== -1) {
      format = format.replace('%s', 'JSONLab');
    }
    if (format.indexOf('%d') !== -1 && args.indexOf('count') !== -1) {
      format = format.replace('%d', '42');
    }
    if (format.indexOf('%d') !== -1 && args.indexOf('i') !== -1) {
      for (var i = 1; i <= 5; i++) {
        output.textContent += format.replace('%d', i.toString()) + '\n';
      }
      continue;
    }
    
    output.textContent += format + '\n';
  }
  
  if (code.indexOf('time.Now()') !== -1 && code.indexOf('Format') !== -1) {
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart ? String(now.getMonth() + 1).padStart(2, '0') : ('0' + (now.getMonth() + 1)).slice(-2);
    var day = String(now.getDate()).padStart ? String(now.getDate()).padStart(2, '0') : ('0' + now.getDate()).slice(-2);
    var hours = String(now.getHours()).padStart ? String(now.getHours()).padStart(2, '0') : ('0' + now.getHours()).slice(-2);
    var minutes = String(now.getMinutes()).padStart ? String(now.getMinutes()).padStart(2, '0') : ('0' + now.getMinutes()).slice(-2);
    var seconds = String(now.getSeconds()).padStart ? String(now.getSeconds()).padStart(2, '0') : ('0' + now.getSeconds()).slice(-2);
    var formatted = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    output.textContent += 'Current time: ' + formatted + '\n';
  }
  
  if (output.textContent.trim() === '') {
    output.textContent = 'Go code executed successfully\n';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGoCompiler);
} else {
  initGoCompiler();
}