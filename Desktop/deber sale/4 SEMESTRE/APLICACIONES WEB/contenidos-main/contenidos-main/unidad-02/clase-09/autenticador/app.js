const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const usuariosDB = JSON.parse(fs.readFileSync('./usuarios.json', 'utf8'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: 'clave_segura',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Ruta POST para login
app.post('/login', async (req, res) => {
  const { usuario, clave } = req.body;
  const usuarioDB = usuariosDB.find(u => u.usuario === usuario);

  if (!usuarioDB) {
    return res.status(401).send('Usuario no encontrado');
  }

  const coincide = await bcrypt.compare(clave, usuarioDB.claveHash);

  if (coincide) {
    req.session.usuario = usuario;
    res.redirect('/panel');
  } else {
    res.status(401).send('Clave incorrecta');
  }
});

// Middleware para rutas protegidas
const protegerRuta = (req, res, next) => {
  if (req.session.usuario) return next();
  res.redirect('/login.html');
};

// Ruta protegida
app.get('/panel', protegerRuta, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/panel.html'));
});

// Cerrar sesión
app.get('/salir', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.listen(3000, () => {
  console.log('Servidor disponible en http://localhost:3000');
});
