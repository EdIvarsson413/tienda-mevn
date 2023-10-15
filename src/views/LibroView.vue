<template>
    <!-- Detalles y descuento a la par -->
    <v-row>
        <!-- Presentacion del libro 75% - 75% -->
        <v-col md="9" sm="9" class="mx-auto">
            <CardDetalleLibro 
                :libro="libro"
                :usuario="usuario"
            />
        </v-col>

        <!-- Ingresar codigo de descuento 25% - 75% -->
        <v-col md="3" sm="9" class="mx-auto">
            <v-card class="card-descuento-mq">
                Descuento (Proximamente)
            </v-card>
        </v-col>


        <!-- Comentarios 100% siempre 100% - 75% -->
        <v-col md="12" sm="9" class="mx-auto">
            <Comentarios 
                :usuario="usuario"
            />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, reactive, computed,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLibrosStore } from '../stores/libros'
import { useValoracionStore } from '../stores/valoracion'
import CardDetalleLibro from '../components/detalle/CardDetalleLibro.vue'
import Comentarios from '../components/detalle/Comentarios.vue'

// Importaciones
const route = useRoute();
const libros = useLibrosStore();
const auth = useAuthStore();
const valoracion = useValoracionStore();

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
    // Obtener el libro, perfil y comentarios al libro del servidor
    try {
        const data = await libros.obtenerLibroId( route.params.id )
        Object.assign( libro, data )

        const userData = await auth.obtenerUsuario();
        usuario.value = userData;

        await valoracion.obtenerComentarios( libro.nombre );
    } catch( error ) { console.log(error) }

    // Cambiar el titulod de la pagina
    const viejoTitulo = document.title + " ";
    document.title = viejoTitulo + libro.nombre
})
</script>