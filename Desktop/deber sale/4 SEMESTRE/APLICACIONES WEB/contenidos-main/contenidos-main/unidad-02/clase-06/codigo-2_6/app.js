// Función tradicional
function saludar(nombre) {
  return "Hola, " + nombre;
}
// Función anónima asignada a una constante
const saludar = function (nombre) {
  return "Hola, " + nombre;
};
// Función flecha con cuerpo de bloque
const saludar = (nombre) => {
  return "Hola, " + nombre;
};
// Función flecha con retorno implícito y template literal
const saludar = nombre => `Hola, ${nombre}`; 
// Test de la función
console.log(saludar("Rodrigo"));