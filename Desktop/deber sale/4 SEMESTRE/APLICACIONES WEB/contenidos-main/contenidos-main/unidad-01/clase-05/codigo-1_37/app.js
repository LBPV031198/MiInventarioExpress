$(document).ready(function() {
    // Mostrar el mensaje con efecto fadeIn
    $("#mostrar").click(function() {
      $("#mensaje").fadeIn();
    });
  
    // Ocultar el mensaje con efecto fadeOut
    $("#ocultar").click(function() {
      $("#mensaje").fadeOut();
    });
  });