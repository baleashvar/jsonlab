self.onmessage = (e) => {
  const { action, data, indent } = e.data;
  
  try {
    // Parse once and reuse for better performance
    const parsed = JSON.parse(data);
    
    if (action === 'format') {
      const formatted = JSON.stringify(parsed, null, indent || 2);
      self.postMessage({ success: true, result: formatted });
    } else if (action === 'minify') {
      const minified = JSON.stringify(parsed);
      self.postMessage({ success: true, result: minified });
    } else if (action === 'validate') {
      self.postMessage({ success: true, valid: true });
    } else {
      self.postMessage({ success: false, error: 'Unknown action' });
    }
  } catch (err) {
    const match = err.message.match(/position (\d+)/);
    const position = match ? parseInt(match[1]) : 0;
    const lines = data.substring(0, position).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    
    self.postMessage({ 
      success: false, 
      error: err.message,
      line,
      column
    });
  }
};
