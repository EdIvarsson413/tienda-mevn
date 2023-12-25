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
            <Descuento
                :tokenPromo="libro.tokenPromo"
                :hayOferta="hayOferta"
                :fecha="fecha"
            />
        </v-col>


        <!-- Comentarios 100% siempre 100% - 75% -->
        <v-col md="12" sm="9" class="mx-auto">
            <Comentarios 
                :usuario="usuario"
                :libro="libro"
            />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, reactive,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLibrosStore } from '../stores/libros'
import { useValoracionStore } from '../stores/valoracion'
import { useCompraStore } from '../stores/compra'
import CardDetalleLibro from '../components/detalle/CardDetalleLibro.vue'
import Comentarios from '../components/detalle/Comentarios.vue'
import Descuento from '../components/detalle/Descuento.vue'


// ----------- Importaciones ----------- //
const route = useRoute();
const libros = useLibrosStore();
const auth = useAuthStore();
const valoracion = useValoracionStore();
const compra = useCompraStore();


// ----------- Variables reactivas ----------- //
const usuario = ref(null);
const hayOferta = ref(false)
const fecha = ref(0)
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
    // Obtencion de datos
    try {
        // Usuario
        const data = await libros.obtenerLibroId( route.params.id )
        Object.assign( libro, data )

        const userData = await auth.obtenerUsuario();
        usuario.value = userData;

        // Carga de comentarios en base al nombre del libro
        await valoracion.obtenerComentarios( libro.nombre );
        
        // Resultado de si el libro esta en oferta
        hayOferta.value = detetminarOferta( compra.promociones );
        fecha.value = obtenerFecha(compra.promociones)
    } catch( error ) { console.log(error) }


    // Cambiar el titulo de la pagina
    const viejoTitulo = document.title + " ";
    document.title = viejoTitulo + libro.nombre
})


// ----------- Funciones ----------- //
const detetminarOferta = ( promociones ) => {
    let porNombre = false;
    let porToken = false;

    // Buscar si el libro actual tiene oferta, por nombre y token de promocion
    for( let i = 0; i < promociones.length; i++ ) {
        if( libro.nombre === promociones[i][0].nombreLibro && libro.tokenPromo === promociones[i][0].tokenPromo )  {
            porNombre = true
            porToken = true
        }
    }
    
    if( porToken && porNombre ) {
        return true
    }
    
    return false
}

const obtenerFecha = ( promociones ) => {
    let fecha = 0;

    // Busca la fecha (en ms) de promocion del libro en oferta
    for( let i = 0; i < promociones.length; i++ ) {
        if( libro.nombre === promociones[i][0].nombreLibro && libro.tokenPromo === promociones[i][0].tokenPromo )  {
            fecha = promociones[i][0].fechaLimite
        }
    }
    return fecha
}
</script>