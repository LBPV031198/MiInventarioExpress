// Función que retorna una promesa simulando una operación asincrónica
function consultarUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, nombre: "María", rol: "admin" });
      } else {
        reject("Usuario no encontrado");
      }
    }, 1000); // Simula una espera de 1 segundo
  });
}

// Uso de la promesa
consultarUsuario(1)
  .then((usuario) => {
    console.log("Usuario encontrado:", usuario);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
