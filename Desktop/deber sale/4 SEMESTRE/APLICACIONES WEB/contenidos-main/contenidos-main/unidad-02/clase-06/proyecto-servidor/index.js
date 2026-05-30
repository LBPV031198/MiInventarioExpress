const express = require("express");
const path = require("path");

const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor activo en http://localhost:3000");
});