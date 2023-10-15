<template>
    <v-card :class="[!verSinopis ? 'card-detalle-mq' : '']" color="grey-darken-4" elevation="5">
        <v-row v-if="!verSinopis">
            <!-- Portada -->
            <v-col md="6" sm="12">
                <v-img
                    class="img-ajuste"
                    max-width="300"
                    cover
                    :src="imgLibro( $props.libro.imagen )"
                    :alt="`imagen ${$props.libro.nombre}`"
                />
            </v-col>

            <!-- Datos, especificar cantidad y estrellas -->
            <v-col md="6" sm="12" class="text-center detalles-ajuste">
                <v-card-title class="text-center text-h5" style="white-space: normal; overflow: visible;">
                    {{ $props.libro.nombre }}
                </v-card-title>
                
                <div class="d-flex justify-center">
                    <v-card-subtitle>${{ $props.libro.precio }}</v-card-subtitle>
                    <v-card-subtitle>{{ $props.libro.autor }}</v-card-subtitle>
                </div>

                <v-card-title class="text-h5 my-6 text-white" style="white-space: normal; overflow: visible;">
                    {{ $props.libro.saga }}
                </v-card-title>

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

                <v-btn
                    append-icon="mdi-cart"
                    text="Agregar al carrito"
                    class="w-75"
                    color="orange-darken-1"
                    variant="outlined"
                    :disabled="hayAdministrador"
                />
                <!-- Estrellas -->
                <VotarEstrellas 
                    :nombreLibro="$props.libro.nombre"
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
            <v-card-text class="text-justify text" v-html="sinopsis"/>
        </div>
    </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Stepper from '../ui/Stepper.vue'
import VotarEstrellas from '../ui/VotarEstrellas.vue'
import imgLibro from '../../js/linkImg'

const props = defineProps({
    libro: Object,
    usuario: Object
})
// Varaibles reactivas 
const contador = ref(0);
const verSinopis = ref(false);

// Metodos
const incrementar = () => {
    if( contador.value < 5 ) 
        contador.value++;
}

const decrementar = () => {
    if( contador.value > 0 )
        contador.value--;
}

// Monitoreo
const hayAdministrador = computed(() =>{
    return props.usuario?.role === 'admin' || props.usuario === undefined
})

// Remmplaza los \n por <br>
const sinopsis = computed(() => {
    return props.libro?.sinopsis.replace(/\n/g, '<br>')
})
</script>