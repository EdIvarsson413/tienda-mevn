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
                    :src="`https://firebasestorage.googleapis.com/v0/b/libreriascastor-ecffa.appspot.com/o/portadas%2F${$props.libro.imagen}?alt=media&token=d4359645-f199-48c6-b6ee-0c9e2a163fd4&_gl=1*wzhjyg*_ga*NjM3MTQwODIwLjE2Njk0MjQwMDA.*_ga_CW55HF8NVT*MTY4NjM2MDc2Ni4xMS4xLjE2ODYzNjE2ODQuMC4wLjA.`"
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
                        >
                            Ver o comprar
                        </v-btn>
                    </router-link>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
defineProps({
    libro: Object
})
</script>