$(document).ready(function () {
  const form = $('#formulario');

  form.on('submit', function (e) {
    const clave = $('#clave').val();
    const clave2 = $('#clave2').val();

    // Validación HTML5
    if (!this.checkValidity() || clave !== clave2) {
      e.preventDefault();
      e.stopPropagation();

      if (clave !== clave2) {
        $('#clave2').addClass('is-invalid');
      } else {
        $('#clave2').removeClass('is-invalid').addClass('is-valid');
      }
    } else {
      e.preventDefault(); // Se evita envío real para redirección controlada
      form.addClass('was-validated');

      // Redirección con nombre como parámetro
      const nombre = $('#nombre').val();
      window.location.href = `bienvenida.html?nombre=${encodeURIComponent(nombre)}`;
    }

    form.addClass('was-validated');
  });
});
