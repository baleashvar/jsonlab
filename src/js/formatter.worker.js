self.onmessage = (e) => {
  const { action, data, indent } = e.data;
  
  try {
    if (action === 'format') {
      const parsed = JSON.parse(data);
      const formatted = JSON.stringify(parsed, null, indent || 2);
      self.postMessage({ success: true, result: formatted });
    } else if (action === 'minify') {
      const parsed = JSON.parse(data);
      const minified = JSON.stringify(parsed);
      self.postMessage({ success: true, result: minified });
    } else if (action === 'validate') {
      JSON.parse(data);
      self.postMessage({ success: true, valid: true });
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
