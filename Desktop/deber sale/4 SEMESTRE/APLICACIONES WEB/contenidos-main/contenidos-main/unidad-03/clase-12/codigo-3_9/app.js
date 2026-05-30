const { createApp, ref } = Vue;

const app = createApp({

    setup() {
        // Variables reactivas
        const items = ref(['Linus Torvalds', 'Guido van Rossum', 'Bjarne Stroustrup']);

        return {
            items
        };
    }
});

app.mount('#app');