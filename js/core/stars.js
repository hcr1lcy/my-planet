function createStarfield(container, count) {
  if (!container) return;
  for (var i = 0; i < count; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    var size = Math.random() * 2.5 + 0.5;
    star.style.cssText =
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;' +
      '--dur:' + (Math.random() * 3 + 1) + 's;' +
      'animation-delay:' + (Math.random() * 3) + 's;';
    container.appendChild(star);
  }
}
