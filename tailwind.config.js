/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      // Aquí definimos los colores de "The Badgers"
      colors: {
        'badger-dark': '#1a1a1a', // Un negro o gris muy oscuro para fondos
        'badger-light': '#f5f5f5', // Un blanco o gris muy claro para el texto
        'badger-accent': '#d9a404', // Un color de acento (ej. dorado/amarillo) para botones
      }
    }
  },
  plugins: []
};