<template>
    <!-- Detalles y descuento a la par -->
    <v-row class="mt-8 mb-4">
        <!-- Presentacion del libro 75%-->
        <v-col md="9" sm="9" class="mx-auto">
            <v-card height="450">
                libro
            </v-card>
        </v-col>

        <!-- Ingresar codigo de descuento  25%-->
        <v-col md="3" sm="9" class="mx-auto">
            <v-card class="card-mq">
                descuento
            </v-card>
        </v-col>


        <!-- Comentarios 100% siempre -->
        <v-col md="12" sm="9" class="mx-auto">
            <v-card>
                Comentarios
            </v-card>
        </v-col>
    </v-row>

</template>

<script setup>
import { ref, reactive, computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLibrosStore } from '../stores/libros'
import { useAuthStore } from '../stores/auth'

// Importaciones
const route = useRoute();
const libros = useLibrosStore();
const auth = useAuthStore();

// Variables reactivas
const usuario = ref(null);
const libro = reactive({
    _id: '',
    nombre: '',
    saga: '',
    autor: '',
    precio: 0,
    sinopsis: '',
    imagen: '',
    tipo: '',
    tokenPromo: ''
})

onMounted( async () => {
    
    // Obtener el libro y perfil del servidor
    try {
        const data = await libros.obtenerLibroId( route.params.id )
        Object.assign( libro, data )

        const userData = await auth.obtenerUsuario();
        console.log(userData)
    } catch( error ) { console.log(error) }

    // Cambiar el titulod de la pagina
    const viejoTitulo = document.title + " ";
    document.title = viejoTitulo + libro.nombre
})

const tamaño = computed(() => window.innerWidth)

console.log(tamaño.value)
</script>