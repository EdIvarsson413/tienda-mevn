<template>
  <div class="d-flex flex-wrap justify-center">
    <CardLibro 
      v-for="libro in libros.catalogo" :key="libro._id"
        :libro="libro"
      />
  </div>
</template>

<script setup>
import { useLibrosStore } from '../stores/libros'
import CardLibro from '../components/CardLibro.vue'

const libros = useLibrosStore();
const mostrar = () => console.log(libros.catalogo)
</script>

<style>
.card--hover:hover{
    transform: scale(1.1);
    transition: transform 0.3s ease-in-out;
}
</style>