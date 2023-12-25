<template>
    <h1 class="text-center my-8 text-h3">Resultados en {{ $route.params.nombre }}</h1>

    <!-- Resultados presentados en tarjeta -->
    <div class="d-flex justify-center">
        <CardLibro 
            v-if="encontroLibro"
            :libro="libro"
        />
        <p v-else class="text-h5 text-red">{{ libro?.msg }}</p>
    </div>
</template>

<script setup>
import { ref, computed ,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLibrosStore } from '../stores/libros'
import CardLibro from '../components/CardLibro.vue'


// ----------- Importaciones ----------- //
const route = useRoute();
const libros = useLibrosStore();


// ----------- Variables reactivas ----------- //
const libro = ref(null);

// Carga de datos al entrar a la pagina
onMounted( async () => { 
    // Modificar el titulo
    const viejoTitulo = document.title;
    document.title = viejoTitulo + " " + route.params.nombre;
    
    // Cargar el libro
    try {
        const data = await libros.obtenerLibroNombre( route.params.nombre );
        libro.value = data
    } catch( error ) { }
})


// ----------- Monitoreo ----------- //

// Si ya cargó el libro y busca el codigo de la peticion
const encontroLibro = computed(() => {
    return libro.value && libro.value.codigo === 200
})
</script>