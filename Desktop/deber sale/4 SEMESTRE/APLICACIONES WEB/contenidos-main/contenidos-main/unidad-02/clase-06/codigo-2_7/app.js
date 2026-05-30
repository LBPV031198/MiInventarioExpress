// Función que recibe un ID y un callback para manejar el resultado
function consultarUsuario(id, callback) {
  setTimeout(() => {
    if (id === 1) {
      const usuario = { id: 1, nombre: "María", rol: "admin" };
      callback(null, usuario); // Primer argumento: error, segundo: resultado
    } else {
      callback("Usuario no encontrado", null);
    }
  }, 1000); // Simula una espera de 1 segundo
}

// Uso de la función con callback
consultarUsuario(1, (error, usuario) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Usuario encontrado:", usuario);
  }
});
