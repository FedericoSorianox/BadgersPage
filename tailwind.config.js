/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Aquí definimos los colores de "The Badgers"
      colors: {
        'badger-dark': '#212121', // Un gris muy oscuro para fondos
        'badger-light': '#f5f5f5', // Un blanco o gris muy claro para el texto
        'badger-accent': '#00CED1', // Un color de turquesa
        'badger-accent-light': '#00FFFF' // Un cian/aqua brillante del logo
      }
    }
  },
  plugins: []
};



