<template>
    <v-card 
        v-for="libro in compra.listaPedir" 
        :key="libro.idLibro" 
        color="grey-darken-4"
        class="mt-2 mx-auto"
    >
        <v-row>
            <!-- Portada -->
            <v-col md="3" sm="3">
                <v-img
                    max-width="125"
                    :src="imgLibro( libro.portada )"
                    :alt="`imagen ${libro.nombre}`"
                    class="mx-auto"
                />
            </v-col>
            
            <!-- Informacion -->
            <v-col md="9" class="mt-4">
                <v-card-title class="text-center">{{ libro.nombre }}</v-card-title>

                <!-- Precio y unidaes -->
                <div class="mx-auto d-flex justify-center mb-3">
                    <v-card-subtitle>${{ libro.precio }}</v-card-subtitle>
                    <v-card-subtitle>Unidades: {{ libro.unidades }}</v-card-subtitle>
                </div>

                <!-- Solo se muestra cuando el usuario pidio oferta -->
                <v-card-subtitle 
                    v-if="ofertaAplicada( libro )" 
                    class="text-center mb-3"
                >
                    Se aplicó oferta
                </v-card-subtitle>

                <!-- Acciones -->
                <div class="d-sm-flex justify-sm-space-around px-3">
                    <v-btn 
                        color="orange-darken-3"
                        variant="tonal"
                        text="Editar"
                        @click="$emit('editar-item', libro.id, libro.nombre)"
                        :disabled="compra.terminando"
                        v-if="!ofertaAplicada( libro )"
                    />
                    <v-btn 
                        color="red-darken-4"
                        variant="tonal"
                        text="Eliminar"
                        @click="$emit('eliminar-item', libro.id, libro.nombre)"
                        :disabled="compra.terminando"
                    />
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify' 
import { useCompraStore } from '../stores/compra'
import imgLibro from '../js/linkImg'

// ----------- Importaciones ----------- //
const compra = useCompraStore();

defineEmits([ 'editar-item', 'eliminar-item' ])


// ----------- Funciones ----------- //

// La funcion devuelve un booleano
const ofertaAplicada = ( libro ) => {
    return libro.aplicoPromo
}

// Monitoreo
</script>