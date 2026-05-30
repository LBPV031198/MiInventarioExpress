const { createApp, ref } = Vue;

const app = createApp({

    template: `
        <h1>{{ mensaje }}</h1>
        <p>-- {{ autor }}</p>
    `,

    setup() {
        // Variables reactivas
        const mensaje = ref('¡Bienvenido a Vue.js!');
        const autor = ref('John Doe');
        
        setTimeout(() => {
            // Actualizar las variablee después de 1 segundos
            mensaje.value = 'Hablar es barato. Muéstrame el código.';
            autor.value = 'Linus Torvalds';
        }, 1000);

        // Retornar las variables reactivas
        return { 
            mensaje,
            autor 
        };

    }

}); 

app.mount('#app');