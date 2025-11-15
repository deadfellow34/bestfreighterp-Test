const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'bestfreight.db');
console.log('SQLite DB path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite bağlantı hatası:', err.message);
  } else {
    console.log('SQLite bağlantısı açıldı:', dbPath);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  // === YENİ: firmalar tablosu (Gönderici / Alıcı dropdown kaynağı) ===
  db.run(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position_no TEXT UNIQUE NOT NULL,      -- Pozisyon No
    customer_name TEXT NOT NULL,           -- Gönderici
    consignee_name TEXT,                   -- Alıcı

    loading_country TEXT,
    loading_city TEXT,
    loading_address TEXT,

    unloading_country TEXT,
    unloading_city TEXT,
    unloading_address TEXT,

    goods_description TEXT,                -- Malzeme cinsi
    packages INTEGER,                      -- Kap adedi
    pallets INTEGER,                       -- Palet sayısı
    ldm REAL,                              -- LDM
    gross_weight REAL,                     -- Brüt ağırlık
    net_weight REAL,                       -- Net ağırlık
    volume_m3 REAL,                        -- Hacim (m3)

    truck_plate TEXT,                      -- Çekici
    trailer_plate TEXT,                    -- Dorse
    driver_name TEXT,                      -- Şoför

    t1_mrn TEXT,
    cmr_no TEXT,
    ferry_line TEXT,                       -- Hat / Gemi
    ferry_voyage_no TEXT,                  -- Sefer No

    exit_date TEXT,                        -- Çıkış tarihi (TR çıkışı)
    arrival_date TEXT,                     -- Varış tarihi (TR girişi / varış)
    loading_date TEXT,                     -- Yükleme tarihi
    unloading_date TEXT,                   -- Boşaltma tarihi

    navlun_currency TEXT,
    navlun_amount REAL,
    cost_currency TEXT,
    cost_amount REAL,

    notes TEXT,

    created_by TEXT,                       -- Excel'deki CurrentUser
    created_at TEXT DEFAULT (datetime('now'))
  )
`);


  // ... seals, logs vs aynı kalsın
});


  db.run(`
    CREATE TABLE IF NOT EXISTS loads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      position_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      consignee_name TEXT,
      goods_description TEXT,
      packages INTEGER,
      gross_weight REAL,
      truck_plate TEXT,
      seal_no TEXT,
      exit_date TEXT,
      arrival_date TEXT,
      created_by TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS seals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seal_no TEXT UNIQUE NOT NULL,
      is_used INTEGER NOT NULL DEFAULT 0,
      used_at TEXT,
      used_in_load_id INTEGER,
      FOREIGN KEY (used_in_load_id) REFERENCES loads(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      role TEXT,
      entity TEXT,
      entity_id INTEGER,
      action TEXT,
      field TEXT,
      old_value TEXT,
      new_value TEXT,
      machine_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

module.exports = db;
