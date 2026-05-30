// Simula una operación asincrónica para consultar usuario
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, nombre: "María" });
      } else {
        reject("Usuario no encontrado");
      }
    }, 500);
  });
}

// Simula una operación para obtener el perfil del usuario
function obtenerPerfil(idUsuario) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: idUsuario, rol: "admin" });
    }, 500);
  });
}

// Simula una operación para obtener permisos según el rol
function obtenerPermisos(rol) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const permisos = {
        admin: ["crear", "editar", "eliminar"],
        usuario: ["ver", "comentar"],
      };
      resolve(permisos[rol] || []);
    }, 500);
  });
}

// Función asincrónica principal que orquesta el flujo
async function mostrarInformacionUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id);
    const perfil = await obtenerPerfil(usuario.id);
    const permisos = await obtenerPermisos(perfil.rol);

    console.log("Usuario:", usuario.nombre);
    console.log("Rol:", perfil.rol);
    console.log("Permisos:", permisos.join(", "));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Ejecutar
mostrarInformacionUsuario(1);
