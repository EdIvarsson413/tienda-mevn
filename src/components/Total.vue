<template>
    <v-row>
        <!-- Total acumulado -->
        <v-col cols="12">
            <v-card color="grey-darken-4" height="199">
                <p class="text-h2 text-center mt-16">
                    $<span>{{ total }}</span>
                </p>
            </v-card>
        </v-col>

        <!-- Acciones -->
        <v-col cols="12">
            <v-card color="grey-darken-4" height="196">
                <div class="d-block pa-5 mt-7">
                    <v-btn 
                        text="Terminar compra"
                        class="w-100 mb-6"
                        variant="tonal"
                        color="orange"
                        @click="$emit('terminar-compra')"
                        :disabled="compra.terminando"
                    />
                    <v-btn 
                        text="Cancelar compra"
                        class="w-100"
                        variant="tonal"
                        color="red"
                        @click="$emit('cancelar-compra')"
                        :disabled="compra.terminando"
                    />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useCompraStore } from '../stores/compra'

// ----------- Importaciones ----------- //
const compra = useCompraStore();

defineEmits([ 'terminar-compra', 'cancelar-compra' ])

// ----------- Monitoreo ----------- //

// Realiaz el calculo del total por todos los libros y unidades
const total = computed(() => {
    return compra.listaPedir.reduce( (total, libro) => total + (libro.precio * libro.unidades), 0 )
})
</script>