function loadCustomBg() {
  var bg = localStorage.getItem('planet_bg');
  if (!bg) return;
  var el = document.getElementById('starfield');
  if (!el) return;
  el.setAttribute('style',
    'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-2;' +
    'background:url(' + bg + ') center/cover no-repeat #000;'
  );
}
