describe('Auth: 密码设置', function() {
  afterEach(function() {
    localStorage.removeItem('planet_admin_hash');
    sessionStorage.removeItem('planet_admin_session');
  });

  it('isSetup初始为false', function() {
    localStorage.removeItem('planet_admin_hash');
    expect(Auth.isSetup()).toBe(false);
  });

  it('setup后isSetup为true', async function() {
    await Auth.setup('test123');
    expect(Auth.isSetup()).toBe(true);
  });

  it('setup存储哈希而非明文', async function() {
    await Auth.setup('test123');
    var stored = localStorage.getItem(Auth.HASH_KEY);
    expect(stored).not.toBe('test123');
    expect(stored.length).toBe(64);
  });

  it('requireAuth返回setup当未设置密码', function() {
    localStorage.removeItem('planet_admin_hash');
    expect(Auth.requireAuth()).toBe('setup');
  });
});

describe('Auth: 登录验证', function() {
  beforeEach(async function() {
    localStorage.removeItem('planet_admin_hash');
    sessionStorage.removeItem('planet_admin_session');
    await Auth.setup('test123');
  });

  afterEach(function() {
    localStorage.removeItem('planet_admin_hash');
    sessionStorage.removeItem('planet_admin_session');
  });

  it('正确密码登录成功', async function() {
    var result = await Auth.login('test123');
    expect(result).toBe(true);
  });

  it('错误密码登录失败', async function() {
    var result = await Auth.login('wrong');
    expect(result).toBe(false);
  });

  it('登录后isAuthenticated为true', async function() {
    await Auth.login('test123');
    expect(Auth.isAuthenticated()).toBe(true);
  });

  it('requireAuth返回authenticated当已登录', async function() {
    await Auth.login('test123');
    expect(Auth.requireAuth()).toBe('authenticated');
  });
});

describe('Auth: Session管理', function() {
  afterEach(function() {
    localStorage.removeItem('planet_admin_hash');
    sessionStorage.removeItem('planet_admin_session');
  });

  it('logout清除session', async function() {
    await Auth.setup('test123');
    await Auth.login('test123');
    Auth.logout();
    expect(Auth.isAuthenticated()).toBe(false);
  });

  it('session过期后需要重新登录', async function() {
    await Auth.setup('test123');
    sessionStorage.setItem(Auth.SESSION_KEY, JSON.stringify({ time: Date.now() - 3 * 60 * 60 * 1000 }));
    expect(Auth.isAuthenticated()).toBe(false);
  });
});

describe('Auth: 安全性', function() {
  afterEach(function() {
    localStorage.removeItem('planet_admin_hash');
    sessionStorage.removeItem('planet_admin_session');
  });

  it('长密码不崩溃', async function() {
    var longPwd = 'a'.repeat(200);
    await Auth.setup(longPwd);
    expect(Auth.isSetup()).toBe(true);
  });

  it('空密码不崩溃', async function() {
    await Auth.setup('');
    expect(Auth.isSetup()).toBe(true);
  });

  it('特殊字符密码', async function() {
    await Auth.setup('<script>alert(1)</script>');
    var result = await Auth.login('<script>alert(1)</script>');
    expect(result).toBe(true);
  });
});
