$(function () {
    // Año en footer
    $('#y').text(new Date().getFullYear());

    // Aparición escalonada de tarjetas
    $('#unitsGrid .unit-card').each(function (i, el) {
        setTimeout(() => $(el).addClass('show'), 80 * i);
    });

    // Hover táctil seguro (añade/remueve foco visual)
    const hoverClass = 'shadow-sm';
    $('.card-raise').on('mouseenter focusin', function () {
        $(this).addClass(hoverClass);
    }).on('mouseleave focusout', function () {
        $(this).removeClass(hoverClass);
    });

    // Filtro por palabras clave (en data-keywords)
    const $cards = $('#unitsGrid .unit-card');
    $('#search').on('input', function () {
        const q = $(this).val().toLowerCase().trim();
        if (!q) { $cards.removeClass('d-none'); return; }
        $cards.each(function () {
            const kw = $(this).data('keywords');
            const match = kw.toLowerCase().includes(q);
            $(this).toggleClass('d-none', !match);
        });
    });
    $('#clearSearch').on('click', function () {
        $('#search').val('').trigger('input').focus();
    });

    // Suavizado de scroll para anclas internas
    $('a[href^="#"]').on('click', function (e) {
        const target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: target.offset().top - 72 }, 300);
        }
    });
});
