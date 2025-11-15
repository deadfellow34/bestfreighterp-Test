const db = require('../config/db');

const LoadModel = {
  // Liste
  getAll(callback) {
    const sql = `
      SELECT
        id,
        position_no,
        customer_name,
        consignee_name,
        loading_country,
        loading_city,
        unloading_country,
        unloading_city,
        goods_description,
        truck_plate,
        trailer_plate,
        exit_date,
        arrival_date,
        created_by,
        created_at
      FROM loads
      ORDER BY created_at DESC
    `;
    db.all(sql, [], callback);
  },

  // Detay
  getById(id, callback) {
    const sql = `
      SELECT
        id,
        position_no,
        customer_name,
        consignee_name,
        loading_country,
        loading_city,
        loading_address,
        unloading_country,
        unloading_city,
        unloading_address,
        goods_description,
        packages,
        pallets,
        ldm,
        gross_weight,
        net_weight,
        volume_m3,
        truck_plate,
        trailer_plate,
        driver_name,
        t1_mrn,
        cmr_no,
        ferry_line,
        ferry_voyage_no,
        exit_date,
        arrival_date,
        loading_date,
        unloading_date,
        navlun_currency,
        navlun_amount,
        cost_currency,
        cost_amount,
        notes,
        created_by,
        created_at
      FROM loads
      WHERE id = ?
    `;
    db.get(sql, [id], callback);
  },

  // Son pozisyon numarasına göre bir sonraki ID'yi üret
  getNextPositionNo(callback) {
    const sql = `SELECT position_no FROM loads ORDER BY id DESC LIMIT 1`;
    db.get(sql, [], (err, row) => {
      if (err) return callback(err);

      let next;

      if (!row || !row.position_no) {
        // İlk kayıt
        next = '25/200-001';
      } else {
        const last = String(row.position_no);
        const match = last.match(/^(.*?)(\d+)$/); // prefix + sayısal kuyruk

        if (match) {
          const prefix = match[1];   // örn: "25/200-"
          const numStr = match[2];   // örn: "001"
          const num = parseInt(numStr, 10) + 1;
          const width = numStr.length;
          const newNumStr = String(num).padStart(width, '0'); // 002, 003...
          next = prefix + newNumStr;
        } else {
          // Format bozuksa sıfırdan başla
          next = '25/200-001';
        }
      }

      callback(null, next);
    });
  },

  // Yeni kayıt oluştur
  create(data, callback) {
    const sql = `
      INSERT INTO loads (
        position_no,
        customer_name,
        consignee_name,
        loading_country,
        loading_city,
        loading_address,
        unloading_country,
        unloading_city,
        unloading_address,
        goods_description,
        packages,
        pallets,
        ldm,
        gross_weight,
        net_weight,
        volume_m3,
        truck_plate,
        trailer_plate,
        driver_name,
        t1_mrn,
        cmr_no,
        ferry_line,
        ferry_voyage_no,
        exit_date,
        arrival_date,
        loading_date,
        unloading_date,
        navlun_currency,
        navlun_amount,
        cost_currency,
        cost_amount,
        notes,
        created_by
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?
      )
    `;

    const params = [
      data.position_no,
      data.customer_name,
      data.consignee_name,
      data.loading_country,
      data.loading_city,
      data.loading_address,
      data.unloading_country,
      data.unloading_city,
      data.unloading_address,
      data.goods_description,
      data.packages,
      data.pallets,
      data.ldm,
      data.gross_weight,
      data.net_weight,
      data.volume_m3,
      data.truck_plate,
      data.trailer_plate,
      data.driver_name,
      data.t1_mrn,
      data.cmr_no,
      data.ferry_line,
      data.ferry_voyage_no,
      data.exit_date,
      data.arrival_date,
      data.loading_date,
      data.unloading_date,
      data.navlun_currency,
      data.navlun_amount,
      data.cost_currency,
      data.cost_amount,
      data.notes,
      data.created_by,
    ];

    db.run(sql, params, function (err) {
      if (err) return callback(err);
      callback(null, this.lastID);
    });
  },

  // Kayıt güncelle (pozisyon_no ve created_by dokunmuyoruz)
  update(id, data, callback) {
    const sql = `
      UPDATE loads SET
        customer_name    = ?,
        consignee_name   = ?,
        loading_country  = ?,
        loading_city     = ?,
        loading_address  = ?,
        unloading_country = ?,
        unloading_city   = ?,
        unloading_address = ?,
        goods_description = ?,
        packages         = ?,
        pallets          = ?,
        ldm              = ?,
        gross_weight     = ?,
        net_weight       = ?,
        volume_m3        = ?,
        truck_plate      = ?,
        trailer_plate    = ?,
        driver_name      = ?,
        t1_mrn           = ?,
        cmr_no           = ?,
        ferry_line       = ?,
        ferry_voyage_no  = ?,
        exit_date        = ?,
        arrival_date     = ?,
        loading_date     = ?,
        unloading_date   = ?,
        navlun_currency  = ?,
        navlun_amount    = ?,
        cost_currency    = ?,
        cost_amount      = ?,
        notes            = ?
      WHERE id = ?
    `;

    const params = [
      data.customer_name,
      data.consignee_name,
      data.loading_country,
      data.loading_city,
      data.loading_address,
      data.unloading_country,
      data.unloading_city,
      data.unloading_address,
      data.goods_description,
      data.packages,
      data.pallets,
      data.ldm,
      data.gross_weight,
      data.net_weight,
      data.volume_m3,
      data.truck_plate,
      data.trailer_plate,
      data.driver_name,
      data.t1_mrn,
      data.cmr_no,
      data.ferry_line,
      data.ferry_voyage_no,
      data.exit_date,
      data.arrival_date,
      data.loading_date,
      data.unloading_date,
      data.navlun_currency,
      data.navlun_amount,
      data.cost_currency,
      data.cost_amount,
      data.notes,
      id,
    ];

    db.run(sql, params, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },

  // Silme
  delete(id, callback) {
    const sql = 'DELETE FROM loads WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) return callback(err);
      callback(null);
    });
  },
};

module.exports = LoadModel;
