<template>
    <div class="pa-3">
        <v-divider />

        <!-- Nombre de usuario y boton de opciones -->
        <div class="d-flex justify-space-between">
            <p class="text-grey-darken-1 mt-2 text-body-1">
                {{ $props.comentario.nombre }}
            </p>

            <!-- Boton de menu contextual, solo visible para el autor del comentario -->
            <v-btn
                variant="plain"
                color="orange-darken-1"
                v-if="creadorComentario"
            >   
                <v-icon>mdi-dots-horizontal</v-icon>

                <!-- Menu contextual del comentario -->
                <v-menu activator="parent">
                    <v-list class="bg-grey-darken-4">
                    <v-list-item class="d-flex justify-center">
                        <v-btn
                            text="Editar"
                            variant="plain"
                            color="orange-darken-1"
                            @click="$emit('editar', $props.comentario._id)"
                        />
                    </v-list-item>
                    <v-list-item>
                        <v-btn
                            text="Eliminar"
                            variant="plain"
                            color="orange-darken-1"
                            @click="$emit('eliminar', $props.comentario._id)"
                        />
                    </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
        </div>

        <!-- Comentario -->
        <p class="text-body-2" v-html="comentarioVHTML" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    comentario: Object,
    usuario: Object
})

defineEmits([ 'editar', 'eliminar' ])

// Comentarios formateados <br> en lugar de \n
const comentarioVHTML = computed(() => {
    return props.comentario.comentario.replace(/\n/g, '<br>');
})

// Se evalua si el comentario fue hecho por el usaurio actual del sitio
const creadorComentario = computed(() => {
    return props.comentario.nombre === props.usuario?.nombre
})

</script>