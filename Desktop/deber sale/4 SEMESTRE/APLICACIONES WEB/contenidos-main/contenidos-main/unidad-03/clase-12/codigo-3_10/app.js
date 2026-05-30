const { createApp, ref } = Vue;

const app = createApp({

    setup() {
        // Variables reactivas
        const puntuacion = ref('');

        return {
            puntuacion
        };
    }
});

app.mount('#app');