<template>
    <v-card 
        :class="[!verSinopis ? 'card-detalle-mq' : '']" 
        color="grey-darken-4" 
        elevation="5"
    >
        <v-row v-if="!verSinopis">
            <!-- Portada -->
            <v-col md="6" sm="12">
                <v-img
                    class="img-ajuste"
                    max-width="300"
                    cover
                    :src="imgLibro( libro.imagen )"
                    :alt="`imagen ${libro.nombre}`"
                />
            </v-col>

            <!-- Datos, especificar cantidad y estrellas -->
            <v-col md="6" sm="12" class="text-center detalles-ajuste">

                <!-- Tiutlo del libro -->
                <v-card-title class="text-center text-h5" style="white-space: normal; overflow: visible;">
                    {{ libro.nombre }}
                </v-card-title>
                
                <!-- Precio y autor -->
                <div class="d-flex justify-center">
                    <v-card-subtitle class="text-subtitle-1">${{ libro.precio }}</v-card-subtitle>
                    <v-card-subtitle class="text-subtitle-1">{{ libro.autor }}</v-card-subtitle>
                </div>

                <!-- Saga -->
                <v-card-title class="text-h5 my-6 text-white" style="white-space: normal; overflow: visible;">
                    {{ libro.saga }}
                </v-card-title>

                <!-- Boton para  ver sinopsis -->
                <v-btn 
                    class="w-75 text-center"
                    variant="plain"
                    color="orange-darken-1"
                    text="sinopsis"
                    append-icon="mdi-book-open-page-variant"
                    @click="verSinopis = !verSinopis"
                />

                <!-- Stepper y agregar al carrito -->
                <Stepper 
                    :contador="contador"
                    @incrementar="incrementar"
                    @decrementar="decrementar"
                    :desactivar="hayAdministrador"
                />
                
                <!-- Accion de agregar al carrito -->
                <v-btn
                    append-icon="mdi-cart"
                    text="Agregar al carrito"
                    class="w-75"
                    color="orange-darken-1"
                    variant="outlined"
                    :disabled="hayAdministrador"
                    @click="agregarApedidos"
                />

                <!-- Estrellas -->
                <VotarEstrellas 
                    :nombreLibro="libro.nombre"
                />
            </v-col>
        </v-row>
        <div v-else class="sinopsis-ajuste">
            <v-btn
                class="ml-3"
                icon="mdi-arrow-left" 
                variant="outlined"
                color="orange-darken-1"
                @click="verSinopis = !verSinopis"/>

                <!-- Sinopsis con \n formateados -->
            <v-card-text class="text-justify" v-html="sinopsis"/>
        </div>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Stepper from '../ui/Stepper.vue'
import VotarEstrellas from '../ui/VotarEstrellas.vue'
import { useCompraStore } from '../../stores/compra'
import imgLibro from '../../js/linkImg'
import { ok, advertencia } from '../../js/Notificacion'

// ----------- Importaciones ----------- //
const compra = useCompraStore();

const props = defineProps({
    libro: Object,
    usuario: Object
})


// ----------- Variables reactivas ----------- //
const contador = ref(0);
const verSinopis = ref(false);


// ----------- Funciones ----------- //
const incrementar = () => {
    if( contador.value < 5 ) 
        contador.value++;
}

const decrementar = () => {
    if( contador.value > 0 )
        contador.value--;
}

const agregarApedidos = () => {
    // Validar que no haya 0 unidades en carrito
    if( contador.value === 0 ) {
        advertencia( 'Sin unidades', 'No has seleccionado unidades para llevar' );
        return;
    }

    const itemListaIndex = compra.listaPedir.findIndex( item => item.id === props.libro._id )

    if( itemListaIndex >= 0 ) {
        // Solo suma las unidades si ya hay un libro en el carrito
        const uni = compra.listaPedir[itemListaIndex]?.unidades;
        compra.listaPedir[itemListaIndex].unidades = uni + contador.value;
        advertencia( 'Editando', 'Ya está en el carrito, te sumamos las unidades ;)' );
        return;
    }


    // Si no existe
    const itemLista = {
        id: props.libro._id,
        nombre: props.libro.nombre,
        precio: props.libro.precio,
        unidades: contador.value,
        portada: props.libro.imagen,
        tokenPromo: props.libro.tokenPromo,
        aplicoPromo: false
    }

    compra.listaPedir.push( itemLista )
    ok( 'Agregando al carrito', 'Libro agregado al carrito' );
}

// ----------- Monitoreo ----------- //

// Saber si se encuentra el administrador
const hayAdministrador = computed(() =>{
    return props.usuario?.role === 'admin' || props.usuario === undefined
})

// Remmplaza los \n por <br>
const sinopsis = computed(() => {
    return props.libro?.sinopsis.replace(/\n/g, '<br>')
})
</script>