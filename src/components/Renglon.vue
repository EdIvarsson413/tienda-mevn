<template>
    <tr>
        <!-- Portada -->
        <td class="d-flex justify-center h-100 pa-3">
            <v-img 
                :src="imgLibro( $props.libro.imagen )" 
                max-width="150" 
                max-height="150"
                :alt="$props.libro.imagen"
            />
        </td>
        <!--Nombre y saga-->
        <td>{{ $props.libro.nombre }}</td>
        <td>{{ $props.libro.saga }}</td>

        <!-- Acciones -->
        <td>
            <!-- Editar -->
            <v-tooltip text="Editar">
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        size="x-large" 
                        variant="plain" 
                        color="orange-darken-1" 
                        icon="mdi-pencil"
                        @click="$emit('editar-dialog', $props.libro._id)"
                    />
                </template>
            </v-tooltip>

            <!-- Eliminar -->
            <v-tooltip text="Eliminar">
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                        size="x-large" 
                        variant="plain" 
                        color="orange-darken-1" 
                        icon="mdi-delete"
                        @click="$emit('eliminar-swal', $props.libro._id, $props.libro.nombre, $props.libro.imagen)"
                    />
                </template>
            </v-tooltip>
        </td>
    </tr>
</template>

<script setup>
import imgLibro from '../js/linkImg'
defineProps({
    libro: {
        type: Object,
        required: true
    }
})

defineEmits([ 'editar-dialog', 'eliminar-swal' ])
</script>