const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Clave secreta para firmar el token
const CLAVE_SECRETA = 'mi_clave_segura_123';

// Ruta de login: genera el token
app.post('/login', (req, res) => {
  const { usuario, clave } = req.body;

  // Validación simple (en un caso real se debería conecta a BD)
  if (usuario === 'admin' && clave === '1234') {
    // Creamos el token válido por 1 hora
    const token = jwt.sign({ usuario }, CLAVE_SECRETA, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }
});

// Middleware para verificar token
const autenticar = (req, res, next) => {
  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ mensaje: 'Token requerido' });

  jwt.verify(token, CLAVE_SECRETA, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });

    req.usuario = user.usuario;
    next();
  });
};

// Ruta protegida
app.get('/perfil', autenticar, (req, res) => {
  res.json({ mensaje: `Hola, ${req.usuario}. Estás autenticado.` });
});

app.listen(3000, () => {
  console.log('Servidor activo en http://localhost:3000');
});