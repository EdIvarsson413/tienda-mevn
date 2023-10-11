<!-- Este boton es solo para el layout -->
<template>
    <v-tooltip :text="$props.text" location="bottom">
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
</template>

<script setup>
defineProps({
    text: String,
    icon: String,
    pageName: String
})

defineEmits([ 'cerrar-sesion' ])
</script>