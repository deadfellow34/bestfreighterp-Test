const db = require('../config/db');

const authController = {
  showLogin(req, res) {
    res.render('auth/login', { error: null });
  },

  login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('auth/login', { error: 'Kullanıcı adı ve şifre zorunludur.' });
    }

    const sql = 'SELECT id, username, password, role FROM users WHERE username = ?';

    db.get(sql, [username], (err, user) => {
      if (err) {
        console.error('Login sırasında DB hatası:', err);
        return res.render('auth/login', { error: 'Sunucu hatası (DB).' });
      }

      if (!user || user.password !== password) {
        return res.render('auth/login', { error: 'Kullanıcı adı veya şifre hatalı.' });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      res.redirect('/loads');
    });
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/auth/login');
    });
  },
};

module.exports = authController;
