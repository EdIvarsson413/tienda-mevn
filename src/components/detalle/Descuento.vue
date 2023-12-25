<template>
    <v-card 
        class="pa-3" 
        :class="sm ? '' : 'card-descuento-mq'"
        elevation="5" 
        color="grey-darken-4"
    >
        <article>
            <section class="d-flex justify-end">
                <v-btn
                    icon="mdi-information-outline"
                    variant="plain"
                    color="orange-darken-1"
                    @click="advertencia('Atención', 'Tu cupón solo es para un grupo de unidades en tu lista para comprar')"
                />
            </section>

            <!-- Si hay un libro en oferta -->
            <section class="my-md-10" v-if="$props.hayOferta">
                <!-- Presenciación -->
                <v-card-title class="text-center">Este libro está en oferta</v-card-title>
                <v-card-subtitle class="mb-5 text-center">La oferta termina en:
                    <span class="d-block">{{ formatoFecha }}</span>
                </v-card-subtitle>

                <v-card-text>
                    <!-- Text field y boton para ingresar codigo de oferta -->
                    <v-text-field
                        color="orange-darken-1"
                        variant="outlined"
                        label="Ingrese el código aquí"
                        :disabled="hayUnidades"
                        v-model="codigo"
                    />
                    <v-btn
                        text="Canjear Código"
                        append-icon="mdi-swap-horizontal"
                        color="orange-darken-1"
                        variant="outlined"
                        class="w-100"
                        :disabled="hayUnidades"
                        @click="aplicarOferta"
                    />
                </v-card-text>
            </section>

            <!-- Si no hay oferta para el libro actual -->
            <section v-else>
                <v-card-title 
                    class="overflow-auto text-center"
                    :class="sm ? '' : 'nohay-oferta-ajuste'"
                >
                    No hay oferta disponible
                </v-card-title>
            </section>

        </article>
    </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useCompraStore } from '../../stores/compra'
import { advertencia, error as errorAviso } from '../../js/Notificacion'

// ----------- Importaciones ----------- //
const compra = useCompraStore(); 
const { sm } = useDisplay()

const props = defineProps({
    tokenPromo: {
        type: String,
        required: true
    },
    hayOferta: {
        type: Boolean,
        required: true
    },
    fecha: {
        type: Number,
        required: true
    }
})

// ----------- Variables reactivas ----------- //
const loader = ref(false)
const codigo = ref('')


// ----------- Funciones ----------- //
const aplicarOferta = () => {
    const sinEspacios = codigo.value.trim()

    // Validar campo, que no este vacio
    if( sinEspacios === '' ) {
        errorAviso( 'Error :(', 'Campo vacio' )
        return
    }
    
    // Llamada al metodo que usa llama a la API
    compra.aplicarOferta( sinEspacios, Date.now() )
}


// ------------------- Monitoreo ------------------- //

// Si el libro esta en la lista para pedir, se desblea la funcion de aplicar cupon
const hayUnidades = computed(() => { 
    if( props.tokenPromo ) {
        // Encontrar el libro actual en lista  de pedir por su token
        const existe = compra.listaPedir.find( libro => libro.tokenPromo === props.tokenPromo )

        // Si existe desactiva el text field y boton
        return existe ? false : true
    }
})

// La fecha viene en milisegundos, se debe de formatear para mostrar fecha limite de promocion al usuario
const formatoFecha = computed(() => {
    // Transformar fecha
    const fechaTransformada = new Date( props.fecha );
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
</script>