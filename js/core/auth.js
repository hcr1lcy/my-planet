var Auth = {
  HASH_KEY: 'planet_admin_hash',
  SESSION_KEY: 'planet_admin_session',
  SESSION_EXPIRE: 2 * 60 * 60 * 1000,

  hashPassword: async function(password) {
    var encoder = new TextEncoder();
    var data = encoder.encode(password);
    var hashBuffer = await crypto.subtle.digest('SHA-256', data);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  },

  isSetup: function() {
    return !!localStorage.getItem(this.HASH_KEY);
  },

  isAuthenticated: function() {
    var session = JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || 'null');
    if (!session) return false;
    return Date.now() - session.time < this.SESSION_EXPIRE;
  },

  setup: async function(password) {
    var hash = await this.hashPassword(password);
    localStorage.setItem(this.HASH_KEY, hash);
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ time: Date.now() }));
    return true;
  },

  login: async function(password) {
    var hash = await this.hashPassword(password);
    var stored = localStorage.getItem(this.HASH_KEY);
    if (hash === stored) {
      sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ time: Date.now() }));
      return true;
    }
    return false;
  },

  logout: function() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },

  requireAuth: function() {
    if (!this.isSetup()) return 'setup';
    if (this.isAuthenticated()) return 'authenticated';
    return 'unauthenticated';
  }
};
