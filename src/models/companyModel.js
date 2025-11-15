const db = require('../config/db');

const CompanyModel = {
  getAll(callback) {
    const sql = 'SELECT id, name FROM companies ORDER BY name ASC';
    db.all(sql, [], callback);
  },
};

module.exports = CompanyModel;
