const LoadModel = require('../models/loadModel');
const CompanyModel = require('../models/companyModel');

const loadController = {
  // /loads → liste
  list(req, res, next) {
    LoadModel.getAll((err, rows) => {
      if (err) return next(err);
      res.render('loads/list', { loads: rows });
    });
  },

  // /loads/new → boş form
  showCreateForm(req, res, next) {
    CompanyModel.getAll((err, companies) => {
      if (err) return next(err);

      res.render('loads/form', {
        load: {},
        errors: null,
        companies,
        duplicatePosition: false,
        isEdit: false,
      });
    });
  },

  // POST /loads → yeni kayıt (pozisyon no otomatik)
  create(req, res, next) {
    const body = req.body;

    // Önce sıradaki pozisyon numarasını al
    LoadModel.getNextPositionNo((err, nextPositionNo) => {
      if (err) return next(err);

      const data = {
        position_no: nextPositionNo,                // OTOMATİK
        customer_name: body.customer_name,
        consignee_name: body.consignee_name || null,

        loading_country: body.loading_country || null,
        loading_city: body.loading_city || null,
        loading_address: body.loading_address || null,

        unloading_country: body.unloading_country || null,
        unloading_city: body.unloading_city || null,
        unloading_address: body.unloading_address || null,

        goods_description: body.goods_description || null,
        packages: body.packages ? parseInt(body.packages, 10) : null,
        pallets: body.pallets ? parseInt(body.pallets, 10) : null,
        ldm: body.ldm ? parseFloat((body.ldm + '').replace(',', '.')) : null,
        gross_weight: body.gross_weight
          ? parseFloat((body.gross_weight + '').replace(',', '.'))
          : null,
        net_weight: body.net_weight
          ? parseFloat((body.net_weight + '').replace(',', '.'))
          : null,
        volume_m3: body.volume_m3
          ? parseFloat((body.volume_m3 + '').replace(',', '.'))
          : null,

        truck_plate: body.truck_plate || null,
        trailer_plate: body.trailer_plate || null,
        driver_name: body.driver_name || null,

        t1_mrn: body.t1_mrn || null,
        cmr_no: body.cmr_no || null,
        ferry_line: body.ferry_line || null,
        ferry_voyage_no: body.ferry_voyage_no || null,

        exit_date: body.exit_date || null,
        arrival_date: body.arrival_date || null,
        loading_date: body.loading_date || null,
        unloading_date: body.unloading_date || null,

        navlun_currency: body.navlun_currency || null,
        navlun_amount: body.navlun_amount
          ? parseFloat((body.navlun_amount + '').replace(',', '.'))
          : null,
        cost_currency: body.cost_currency || null,
        cost_amount: body.cost_amount
          ? parseFloat((body.cost_amount + '').replace(',', '.'))
          : null,

        notes: body.notes || null,

        created_by: req.session.user ? req.session.user.username : 'system',
      };

      // Zorunlu alan: sadece müşteri
      if (!data.customer_name) {
        return CompanyModel.getAll((err2, companies) => {
          if (err2) return next(err2);
          res.render('loads/form', {
            load: data,
            errors: 'Gönderici (Müşteri) zorunludur.',
            companies,
            duplicatePosition: false,
            isEdit: false,
          });
        });
      }

      LoadModel.create(data, (err3, newId) => {
        if (err3) {
          // Teoride position_no unique, ama biz zaten otomatik verdiğimiz için pek olmaz
          if (
            err3.code === 'SQLITE_CONSTRAINT' &&
            typeof err3.message === 'string' &&
            err3.message.includes('loads.position_no')
          ) {
            return CompanyModel.getAll((e2, companies) => {
              if (e2) return next(e2);
              res.render('loads/form', {
                load: data,
                errors:
                  'Bu pozisyon numarası zaten kayıtlı. Lütfen tekrar deneyin.',
                companies,
                duplicatePosition: true,
                isEdit: false,
              });
            });
          }

          return next(err3);
        }

        res.redirect('/loads');
      });
    });
  },

  // /loads/:id/edit → düzenleme formu
  showEditForm(req, res, next) {
    const id = req.params.id;

    LoadModel.getById(id, (err, load) => {
      if (err) return next(err);
      if (!load) return res.status(404).send('Kayıt bulunamadı.');

      CompanyModel.getAll((err2, companies) => {
        if (err2) return next(err2);

        res.render('loads/form', {
          load,
          errors: null,
          companies,
          duplicatePosition: false,
          isEdit: true,
        });
      });
    });
  },

  // POST /loads/:id → güncelle
  update(req, res, next) {
    const id = req.params.id;
    const body = req.body;

    const data = {
      customer_name: body.customer_name,
      consignee_name: body.consignee_name || null,

      loading_country: body.loading_country || null,
      loading_city: body.loading_city || null,
      loading_address: body.loading_address || null,

      unloading_country: body.unloading_country || null,
      unloading_city: body.unloading_city || null,
      unloading_address: body.unloading_address || null,

      goods_description: body.goods_description || null,
      packages: body.packages ? parseInt(body.packages, 10) : null,
      pallets: body.pallets ? parseInt(body.pallets, 10) : null,
      ldm: body.ldm ? parseFloat((body.ldm + '').replace(',', '.')) : null,
      gross_weight: body.gross_weight
        ? parseFloat((body.gross_weight + '').replace(',', '.'))
        : null,
      net_weight: body.net_weight
        ? parseFloat((body.net_weight + '').replace(',', '.'))
        : null,
      volume_m3: body.volume_m3
        ? parseFloat((body.volume_m3 + '').replace(',', '.'))
        : null,

      truck_plate: body.truck_plate || null,
      trailer_plate: body.trailer_plate || null,
      driver_name: body.driver_name || null,

      t1_mrn: body.t1_mrn || null,
      cmr_no: body.cmr_no || null,
      ferry_line: body.ferry_line || null,
      ferry_voyage_no: body.ferry_voyage_no || null,

      exit_date: body.exit_date || null,
      arrival_date: body.arrival_date || null,
      loading_date: body.loading_date || null,
      unloading_date: body.unloading_date || null,

      navlun_currency: body.navlun_currency || null,
      navlun_amount: body.navlun_amount
        ? parseFloat((body.navlun_amount + '').replace(',', '.'))
        : null,
      cost_currency: body.cost_currency || null,
      cost_amount: body.cost_amount
        ? parseFloat((body.cost_amount + '').replace(',', '.'))
        : null,

      notes: body.notes || null,
    };

    if (!data.customer_name) {
      return CompanyModel.getAll((err2, companies) => {
        if (err2) return next(err2);

        // Mevcut kaydın pozisyon no'su vs. için load'a id ekleyelim
        const load = { ...data, id };

        res.render('loads/form', {
          load,
          errors: 'Gönderici (Müşteri) zorunludur.',
          companies,
          duplicatePosition: false,
          isEdit: true,
        });
      });
    }

    LoadModel.update(id, data, (err3) => {
      if (err3) return next(err3);
      res.redirect('/loads/' + id); // Güncellemeden sonra detay sayfasına
    });
  },

  // /loads/:id/delete → kayıt sil
  delete(req, res, next) {
    const id = Number(req.params.id);
    console.log('Silme isteği geldi, id:', id);

    if (!id) {
      console.error('Geçersiz id parametresi:', req.params.id);
      return res.redirect('/loads');
    }

    LoadModel.delete(id, (err) => {
      if (err) {
        console.error('Silme hatası:', err);
        return next(err);
      }

      console.log('Kayıt silindi, id:', id);
      res.redirect('/loads');
    });
  },

  // /loads/:id → detay sayfası
  showDetail(req, res, next) {
    const id = req.params.id;

    LoadModel.getById(id, (err, load) => {
      if (err) return next(err);
      if (!load) {
        return res.status(404).send('Kayıt bulunamadı.');
      }

      res.render('loads/detail', { load });
    });
  },
};

module.exports = loadController;
