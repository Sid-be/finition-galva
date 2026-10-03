<template>
  <FicheJournaliere />
</template>

<script>
import FicheJournaliere from './components/FicheJournaliere.vue'
import './assets/tailwind.css';

export default {
  name: 'App',
  components: {
    FicheJournaliere
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
