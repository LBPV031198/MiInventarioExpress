// Selección de elementos del DOM
const titulo = document.getElementById('titulo');
const botonColor = document.getElementById('cambiarColor');
const botonBorde = document.getElementById('toggleBorde');
const botonAgregar = document.getElementById('agregarItem');
const caja = document.getElementById('miCaja');
const lista = document.getElementById('lista');

// Array de colores para el ejemplo
const colores = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

// Evento: Cambiar color de la caja
botonColor.addEventListener('click', () => {
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    caja.style.backgroundColor = colorAleatorio;
    titulo.style.color = colorAleatorio; // Cambia también el color del título
});

// Evento: Alternar borde resaltado
botonBorde.addEventListener('click', () => {
    caja.classList.toggle('resaltado');
});

// Evento: Agregar ítem a la lista
botonAgregar.addEventListener('click', () => {
    const nuevoItem = document.createElement('li');
    nuevoItem.textContent = `Ítem ${lista.childElementCount + 1}`;
    
    // Añade efecto de hover con JavaScript
    nuevoItem.addEventListener('mouseover', () => {
        nuevoItem.style.backgroundColor = '#f0f0f0';
    });
    
    nuevoItem.addEventListener('mouseout', () => {
        nuevoItem.style.backgroundColor = 'transparent';
    });
    
    lista.appendChild(nuevoItem);
});

// Evento adicional: Cambiar título al hacer doble clic en la caja
caja.addEventListener('dblclick', () => {
    titulo.textContent = '¡DOBLE CLIC EN LA CAJA! 🚀';
});