// Importación de funciones reactivas desde Vue
const { createApp, ref } = Vue

createApp({
    setup() {
        // Variable reactiva para el nombre del usuario
        const nombre = ref('')

        // Variable que guarda la URL del avatar seleccionado
        const avatarSeleccionado = ref('')

        // Variable que guarda el interés actualmente seleccionado
        const interesSeleccionado = ref(null)

        // Objeto con pares nombre → URL de avatar
        const avatares = {
            "Gato": "https://icons.iconarchive.com/icons/iconka/meow/128/cat-grumpy-icon.png",
            "Perro": "https://icons.iconarchive.com/icons/iconarchive/incognito-animal-2/128/Dog-icon.png",
            "Robot": "https://icons.iconarchive.com/icons/proycontec/robots/128/robot-trash-icon.png"
        }

        // Lista de intereses mostrada con v-for
        const intereses = ['Programación', 'Diseño', 'Marketing', 'IA']

        // Método para seleccionar un interés al hacer clic
        const seleccionar = (interes) => {
            interesSeleccionado.value = interes
        }

        // Se expone al template todo lo necesario
        return {
            nombre,
            avatarSeleccionado,
            interesSeleccionado,
            avatares,
            intereses,
            seleccionar
        }
    }
}).mount('#app') // Monta la app sobre el div con id="app"
