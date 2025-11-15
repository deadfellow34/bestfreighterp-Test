require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const db = require('./config/db');
const loadRoutes = require('./routes/loadRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Layout
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'bestfreight_secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Statik dosyalar
app.use(express.static(path.join(__dirname, 'public')));

// View'lara currentUser taşı
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// Rotalar
app.use('/auth', authRoutes);
app.use('/loads', loadRoutes);

app.get('/', (req, res) => {
  res.redirect('/loads');
});

// Hata yakalayıcı
app.use((err, req, res, next) => {
  console.error('Global hata:', err);
  res.status(500).send('Sunucu hatası');
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} adresinde çalışıyor`);
});
