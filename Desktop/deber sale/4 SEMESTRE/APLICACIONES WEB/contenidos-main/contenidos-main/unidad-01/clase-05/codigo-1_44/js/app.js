$(document).ready(function () {
    // 1. Inicia el temporizador de 5 segundos
    setTimeout(function() {
        // 2. Oculta el spinner y muestra el contenedor
        $("#loading-spinner").hide();
        $("#lista-peliculas").show();

        // 3. Carga los datos del JSON
        $.ajax({
            url: "data/peliculas.json",
            method: "GET",
            dataType: "json",
            success: function (peliculas) {
                let html = "";
                peliculas.forEach(function (peli) {
                    html += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 shadow">
                            <img src="img/${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                            <div class="card-body">
                                <h5 class="card-title">${peli.titulo}</h5>
                                <p class="card-text">${peli.genero}</p>
                                <a href="pages/renta.html?peli=${encodeURIComponent(peli.titulo)}" class="btn btn-primary w-100">Rentar ahora</a>
                            </div>
                        </div>
                    </div>`;
                });
                $("#lista-peliculas").html(html);
            },
            error: function () {
                $("#lista-peliculas").html('<div class="alert alert-danger text-center">No se pudo cargar la lista de películas.</div>');
            }
        });
    }, 5000); // 5000 milisegundos = 5 segundos exactos
});