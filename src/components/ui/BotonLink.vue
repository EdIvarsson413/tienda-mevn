<!-- Este boton es solo para el layout -->
<template>
    <!-- Boton por defecto (pantallas MD en delante) -->
    <v-tooltip :text="$props.text" location="bottom" v-if="!sm">
        <template v-slot:activator="{ props }">
            <div v-bind="props" class="text-center text-h4">
                <v-btn
                    variant="plain" 
                    class="mx-3" 
                    size="x-large" 
                    :icon="$props.icon" 
                    :to="{ name: $props.pageName }"
                    @click="$emit('cerrar-sesion')"
                />
            </div>
        </template>
    </v-tooltip>

    <!-- Boton para pantallas en SM -->
    <v-btn
        v-if="sm"
        variant="plain" 
        class="w-100" 
        size="x-large" 
        :text="text"
        :prepend-icon="$props.icon" 
        :to="{ name: $props.pageName }"
        @click="$emit('cerrar-sesion')"
    />
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()

defineProps({
    text: String,
    icon: String,
    pageName: String,
    sm: Boolean
})

defineEmits([ 'cerrar-sesion' ])
</script>