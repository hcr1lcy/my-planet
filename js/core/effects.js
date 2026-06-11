function initCursorGlow() {
  var glow = document.getElementById('cursorGlow');
  if (!glow) return;
  document.addEventListener('mousemove', function(e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
