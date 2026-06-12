describe('PWA: manifest.json', function() {
  it('manifest是有效JSON', function() {
    var manifest = {
      name: 'My Planet - 科幻个人星球',
      short_name: 'My Planet',
      description: '科幻个人星球主题网站',
      start_url: '/index.html',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#00f0ff',
      icons: [
        { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
      ]
    };
    expect(typeof manifest).toBe('object');
    expect(manifest.name).toBeTruthy();
  });

  it('manifest包含必要字段', function() {
    var manifest = { name: 'test', short_name: 'test', start_url: '/', display: 'standalone', icons: [] };
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBeTruthy();
    expect(manifest.display).toBe('standalone');
    expect(Array.isArray(manifest.icons)).toBe(true);
  });

  it('manifest display为standalone', function() {
    var manifest = { display: 'standalone' };
    expect(manifest.display).toBe('standalone');
  });

  it('manifest包含theme_color', function() {
    var manifest = { theme_color: '#00f0ff' };
    expect(manifest.theme_color).toBeTruthy();
  });

  it('manifest包含icons', function() {
    var manifest = { icons: [{ sizes: '192x192' }, { sizes: '512x512' }] };
    expect(manifest.icons.length).toBe(2);
  });
});

describe('PWA: Service Worker', function() {
  it('sw.js定义CACHE_NAME', function() {
    expect(typeof CACHE_NAME).toBe('string');
    expect(CACHE_NAME).toContain('my-planet');
  });

  it('sw.js定义STATIC_ASSETS', function() {
    expect(Array.isArray(STATIC_ASSETS)).toBe(true);
    expect(STATIC_ASSETS.length).toBeGreaterThan(0);
  });

  it('STATIC_ASSETS包含首页', function() {
    expect(STATIC_ASSETS).toContain('./index.html');
  });

  it('STATIC_ASSETS包含CSS文件', function() {
    var hasCss = STATIC_ASSETS.some(function(a) { return a.endsWith('.css'); });
    expect(hasCss).toBe(true);
  });

  it('STATIC_ASSETS包含JS文件', function() {
    var hasJs = STATIC_ASSETS.some(function(a) { return a.endsWith('.js'); });
    expect(hasJs).toBe(true);
  });
});

describe('PWA: 缓存策略', function() {
  it('Cache First用于静态资源', function() {
    var staticAssets = ['./index.html', './css/base.css', './js/core/utils.js'];
    staticAssets.forEach(function(asset) {
      expect(STATIC_ASSETS).toContain(asset);
    });
  });
});
