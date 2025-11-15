// createUser.js
const db = require('./src/config/db');

// Burayı istediğin gibi değiştirebilirsin
const username = 'aytug';
const password = '1234';
const role = 'admin';

// Önce bu kullanıcı var mı diye bakalım
db.get(
  'SELECT id FROM users WHERE username = ?',
  [username],
  (err, row) => {
    if (err) {
      console.error('Kullanıcı kontrolünde hata:', err.message);
      db.close(() => process.exit(1));
      return;
    }

    if (row) {
      // Varsa: şifresini ve rolünü GÜNCELLEYELİM
      db.run(
        'UPDATE users SET password = ?, role = ? WHERE id = ?',
        [password, role, row.id],
        function (err2) {
          if (err2) {
            console.error('Kullanıcı güncellenirken hata:', err2.message);
          } else {
            console.log('Kullanıcı güncellendi.');
            console.log('Kullanıcı adı:', username);
            console.log('Yeni şifre:', password);
            console.log('Rol:', role);
          }
          db.close(() => process.exit(0));
        }
      );
    } else {
      // Yoksa: yeni kullanıcı EKLEYELİM
      db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, password, role],
        function (err3) {
          if (err3) {
            console.error('Kullanıcı eklenirken hata:', err3.message);
          } else {
            console.log('Yeni kullanıcı eklendi. ID:', this.lastID);
            console.log('Kullanıcı adı:', username);
            console.log('Şifre:', password);
            console.log('Rol:', role);
          }
          db.close(() => process.exit(0));
        }
      );
    }
  }
);
