<template>
    <!-- Grupo de botones en la vista de administracion de promociones -->
    
    <!-- Grupo en horizontal (md y delante) -->
    <v-btn-group 
        color="orange-darken-1" 
        density="comfortable" 
        class="d-flex justify-center my-2"
        v-if="mdAndUp"
    >
        <v-btn 
            variant="plain" 
            :text="$props.total" 
            size="large"
        />
            <v-btn 
            text="Agregar Promoción" 
            prepend-icon="mdi-plus"
            @click="$emit('abrir-dialog')"
        />
        <v-btn 
            text="Volver a Libros"
            prepend-icon="mdi-arrow-left"
            :to="{ name: 'admin' }"/>
    </v-btn-group>
    

    <!-- Grupo en vetical (SM) -->
    <v-row v-else>
        <v-col sm="12">
            <p class="text-h4 text-center">{{ $props.total }}</p>
        </v-col>

        <v-col sm="12">
            <v-btn 
                text="Agregar Promoción" 
                prepend-icon="mdi-plus"
                class="w-100"
                color="orange-darken-1"
                @click="$emit('abrir-dialog')"
            />
        </v-col>

        <v-col sm="12">
            <v-btn 
                text="Volver a Libros"
                prepend-icon="mdi-arrow-left"
                :to="{ name: 'admin' }"
                class="w-100"
                color="orange-darken-1"
            />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

defineProps({
    total: String
})

defineEmits([ 'abrir-dialog' ])

// Importaciones
const { mdAndUp } = useDisplay();

</script>