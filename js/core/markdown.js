function markdownToHtml(md) {
  if (!md) return '';
  var html = md;
  var codeBlocks = [];
  var inlineCodes = [];

  html = html.replace(/```([\s\S]*?)```/g, function(m, code) {
    var idx = codeBlocks.length;
    codeBlocks.push(code);
    return '\x00CB' + idx + '\x00';
  });

  html = html.replace(/`([^`]+)`/g, function(m, code) {
    var idx = inlineCodes.length;
    inlineCodes.push(code);
    return '\x00IC' + idx + '\x00';
  });

  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr>')
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, function(m) { return '<ul>' + m + '</ul>'; })
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br>');

  html = html.replace(/\x00CB(\d+)\x00/g, function(m, idx) {
    var code = codeBlocks[parseInt(idx)]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return '<pre><code>' + code + '</code></pre>';
  });

  html = html.replace(/\x00IC(\d+)\x00/g, function(m, idx) {
    var code = inlineCodes[parseInt(idx)]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return '<code>' + code + '</code>';
  });

  return '<p>' + html + '</p>';
}
