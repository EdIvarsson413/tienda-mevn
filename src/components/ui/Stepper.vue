<template>
    <div class="d-flex justify-space-between align-center w-75 mx-auto mt-5 mb-3">
        <v-btn
            icon="mdi-minus"
            variant="plain"
            color="orange-darken-1"
            @click="$emit('decrementar')"
            :disabled="$props.desactivar"
        />

        <p class="text-h5">{{ contador }}</p>

        <v-btn
            icon="mdi-plus"
            variant="plain"
            color="orange-darken-1"
            @click="$emit('incrementar')"
            :disabled="$props.desactivar"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    contador: Number,
    desactivar: Boolean
})

const emits = defineEmits([ 'incrementar', 'decrementar' ])
</script>