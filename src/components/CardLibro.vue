<template>
    <v-card
        class="card--hover ma-5"
        color="grey-darken-4"
        elevation="5"
        width="379" 
        height="220"
    >   
        <v-row>
            <!-- Espacio para la portada -->
            <v-col md="5">
                <v-img
                    max-width="205"
                    :src="imgLibro( $props.libro.imagen )"
                    :alt="`imagen ${$props.libro.nombre}`"
                />
            </v-col>

            <!-- Espacio para detalles -->
            <v-col class="mt-6" cols="7">
                <!-- Titulo con tooltip -->
                <v-tooltip :text="$props.libro.nombre">
                    <template v-slot:activator="{ props }">
                        <v-card-title v-bind="props" class="text-center mr-3">
                            {{ $props.libro.nombre }}
                        </v-card-title>
                    </template>
                </v-tooltip>

                <!-- Precio y autor -->
                <div class="d-flex flex-wrap text-grey-darken-1 justify-space-between mt-1">
                    <v-card-subtitle>${{ $props.libro.precio }}</v-card-subtitle>
                    <v-card-subtitle>{{ $props.libro.autor }}</v-card-subtitle>
                </div>

                <!-- Acciones del card -->
                <v-card-actions>
                    <router-link 
                        :to="{ 
                            name: 'detalle-libro', 
                            params: { id: $props.libro._id }
                        }" 
                        class="w-100"
                    >
                        <v-btn 
                            class="w-100 mt-2"
                            color="orange-darken-1"
                            variant="outlined"
                            text="Ver o comprar"
                        />
                    </router-link>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
import imgLibro from '../js/linkImg'

defineProps({
    libro: Object
})
</script>