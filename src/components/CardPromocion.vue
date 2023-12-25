<template>
    <v-card color="grey-darken-4" elevation="5">
        <v-row>
            <v-col cols="4">
                <!-- Portada del libro -->
                <v-img
                    
                    :src="imgLibro( $props.promocion.portadaLibro )" 
                    :alt="'imagen ' + $props.promocion.nombreLibro"
                />
            </v-col>

            <v-col cols="8" class="text-sm-center text-md-start align-self-md-center align-self-sm-center">
                <!-- Libro en promocion -->
                <v-card-title>{{ $props.promocion.nombreLibro }}</v-card-title>

                <!-- Datos de la promocion -->
                <v-card-text>
                    <p>Codigo: {{ codigoLimpio }}</p>
                    <p>Descuento: {{ $props.promocion.descuento }}%</p>
                    <p>Cupones: {{ $props.cantidad }}</p>
                    <p>Token Promo: {{ $props.promocion.tokenPromo }}</p>
                    <p>Fecha de caducidad: {{ fecha }} </p>
                </v-card-text>

                <!-- Accoines -->
                <v-card-actions>
                    <v-btn
                        text="Eliminar"
                        append-icon="mdi-delete"
                        variant="plain"
                        color="red"
                        class="w-100"
                        @click="eliminarPromo( $props.promocion.nombreLibro ,$props.promocion.tokenPromo )"
                    />
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>


// Importaciones
import { computed } from 'vue'
import { useCompraStore } from '../stores/compra'
import imgLibro from '../js/linkImg'
import { confirmar } from '../js/Notificacion'

// ----------- Importaciones ----------- //
const compra = useCompraStore()

const props = defineProps({
    promocion: Object,
    cantidad: Number
})

// ----------- Funciones ----------- //
const eliminarPromo = async ( nombre, tokenPromo ) => {
    const respuesta = await confirmar( nombre, '¿Estás seguro de eliminar esta promocion?', 'Si' )
    
    if( respuesta  ) {
        compra.eliminarPromociones( tokenPromo )
        // ok( 'Ok ;)', 'Promoción eliminada correctamente' )
    }
}

// ----------- Monitoreo ----------- //
const fecha = computed(() => {
    // Transformar fecha
    const fechaTransformada = new Date( props.promocion.fechaLimite );
    const meses = [ 
        'Ene', 'Feb', 'Mar', 
        'Abr', 'May', 'Jun', 
        'Jul', 'Ago', 'Sep', 
        'Oct', 'Nov', 'Dic' 
    ]

    return `${fechaTransformada.getDate()} 
            de ${meses[ fechaTransformada.getMonth() ]} 
            del ${fechaTransformada.getFullYear()}`

})

// Los codigos están enumerados pero se muestra solo el codigo sin numeracion
// en el card
const codigoLimpio = computed(() => {
    const cadena = props.promocion.codigo
    return cadena.substring(0, cadena.length - 1 )
})
</script>