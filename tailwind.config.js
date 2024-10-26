/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // Garde ces lignes pour éliminer le CSS inutilisé
  darkMode: 'class', // Active le mode sombre basé sur une classe
  theme: {
    extend: {}, // Tu peux étendre les classes Tailwind ici si nécessaire
  },
  variants: {
    extend: {}, // Pour ajouter des variantes de styles
  },
  plugins: [], // Tu peux ajouter des plugins si nécessaire
}

