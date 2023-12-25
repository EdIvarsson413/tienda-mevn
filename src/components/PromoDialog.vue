<template>
    <v-row justify="center">
        <v-dialog v-model="$props.abrir" persistent width="1024" class="fondo">
            <v-card color="grey-darken-3">
                <!-- Titulo del dialog -->
                <v-card-title class="text-h5 ma-3 text-start">Nueva Promoción</v-card-title>
                
                <!-- Contenido del dialog -->
                <v-card-text>
                        <v-row>
                            <!-- Datepicker -->
                            <v-col md="6" sm="12" class="d-flex justify-center">
                                <v-date-picker
                                    elevation="5"
                                    title="Fecha Límite"
                                    header="Fecha"
                                    theme="dark"
                                    show-adjacent-months
                                    v-model="generar.fecha"
                                />
                            </v-col>

                            <!-- Campos -->
                            <v-col md="6" sm="12" class="align-self-md-center">
                                <v-text-field label="Cantidad de cupones" variant="outlined"
                                    color="orange-darken-1" class="mb-5" v-model="generar.cantidad"
                                />
                                <v-text-field label="Codigo de los cupones" variant="outlined"
                                    color="orange-darken-1" class="mb-5" v-model="generar.codigo"
                                />
                                <v-text-field label="Descuento que aplica" variant="outlined"
                                    color="orange-darken-1" class="mb-5" v-model="generar.descuento"
                                />
                                <v-text-field label="ID de promoción" variant="outlined"
                                    color="orange-darken-1" v-model="generar.tokenPromo"
                                />
                            </v-col>
                        </v-row>
                </v-card-text>

                <!-- Acciones del dialog -->
                <v-card-actions class="ma-3">
                    <!-- Cerrar dialog -->
                    <v-btn color="orange-darken-1" variant="text" text="Cerrar" 
                        @click="$emit('cerrar-dialog')"
                    />

                    <!-- Añadir o editar -->
                    <v-btn color="orange-darken-1" variant="text" 
                        text="Crear promoción" @click="crearPromocion"
                    />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script setup>
import { reactive, } from 'vue'
import { useRouter } from 'vue-router'
import { useCompraStore } from '../stores/compra'

defineProps({
    abrir: {
        type: Boolean
    }
})

const emits = defineEmits([ 'cerrar-dialog' ])

// ----------- Importaciones ----------- //
const compra = useCompraStore();
const router = useRouter()

// ----------- Variables reactivas ----------- //
const generar = reactive({
    fecha: new Date,
    cantidad: '',
    codigo: '',
    descuento: '',
    tokenPromo: ''
})

const crearPromocion = () => {
    // Validar campos
    if( Object.values( generar ).includes('') ){
        console.log('campos obligatorios')
        return
    }

    /**
     * En este caso no se mete el objeto al state
     * ya que se tienen que generar los cupones y,
     * en su lugar, se recarga la pagina
     * 
     * CORREGIDO CON SOCKET.IO (22/12/23)
    */ 
    compra.crearPromocion( generar );
    emits('cerrar-dialog')
}
</script>