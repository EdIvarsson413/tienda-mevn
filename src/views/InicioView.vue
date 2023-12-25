<template>
  <!-- Filtro -->
  <v-btn-group class="d-flex justify-center my-5" color="orange-darken-1">
    <v-btn
      text="Todos"
      class="w-25"
      @click="filtro = ''"
    />
    <v-btn
      text="Libros"
      class="w-25"
      @click="filtro = 'libro'"
    />
    <v-btn
      text="Boxsets"
      class="w-25"
      @click="filtro = 'boxset'"
    />
  </v-btn-group>

  <!-- Libros presentaos en tarjetas -->
  <v-row>
    <v-col 
      sm="12" 
      md="6" 
      lg="4" 
      xl="3"
      v-for="libro in filtrar"
    >
      <CardLibro 
        :key="libro._id"
        :libro="libro"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLibrosStore } from '../stores/libros'
import CardLibro from '../components/CardLibro.vue'


// ----------- Importaciones ----------- //
const libros = useLibrosStore();

// ----------- Variables reactivas ----------- //
const filtro = ref('')


// ----------- Monitoreo ----------- //
const filtrar = computed(() => {
  if( filtro.value !== '' )
    return libros.catalogo.filter( libro => libro.tipo === filtro.value )

  return libros.catalogo
})
</script>