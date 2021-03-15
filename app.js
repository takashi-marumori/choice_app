const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const app = express();
const env = require('dotenv').config()
const bcrypt = require('bcrypt');

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: process.env.APP_HOST,
  user: process.env.APP_USER,
  password: process.env.APP_PASS,
  database: process.env.APP_DB
});

app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
)

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.username = 'ゲスト';
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.post('/sign_up',
(req, res, next) => {
  const email = req.body.email;
  
  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      if (results.length > 0) {
        res.render('/');
      } else {
        next();
      }
    }
  );
  
},

(req,res) => {
  const nickname = req.body.nickname;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password,10,(error,hash) => {
    connection.query(
      'INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)',
      [nickname, email, hash],
      (error, results) => {
        req.session.userId = results.insertId;
        req.session.nickname = nickname;
        res.redirect('/');
      }
    );
  });
});

app.listen(3000);