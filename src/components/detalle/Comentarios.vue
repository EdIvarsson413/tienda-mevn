<template>
    <v-card class="lista-comentarios" color="grey-darken-4" elevation="5">
        <v-card-title>Comentarios</v-card-title>
        
        <v-divider />

        <!-- Espacio para comentar -->
        <section class="pa-3">
            <v-textarea 
                rows="3" 
                bg-color="grey-darken-4" 
                color="orange-darken-1" 
                variant="outlined"
                clearable 
                clear-icon="mdi-close-circle"
                label="¿Te gustó el libro? Cuentanos"
                :disabled="hayAdmin"
                v-model="nuevoComentario"
            />
            <v-btn 
                class="w-100" 
                color="orange-darken-1" 
                variant="outlined" 
                append-icon="mdi-comment"
                text="Comentar"
                :disabled="hayAdmin"
                @click="comentar"
            />
        </section>

        <!-- Si hay comentariios -->
        <section v-if="hayComentarios">
            <Comentario 
                v-for="comentario in valoracion.comentarios"
                :key="comentario._id"
                :comentario="comentario"
                @editar="editar"
                @eliminar="eliminar"
            />
        </section>

        <!-- Si no hay comentarios -->
        <section v-else>
            <v-card-subtitle class="text-grey-lighten-1 text-body-2 text-center my-5">
                No hay comentarios
            </v-card-subtitle>
        </section>
    </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Comentario from '../Comentario.vue'
import { useValoracionStore } from '../../stores/valoracion'
import { error as errorAlert } from '../../js/Notificacion'

const props = defineProps({
    usuario: Object
})

// Imporataciones
const valoracion = useValoracionStore();

// Variables reactivas
const nuevoComentario = ref('');

// Funciones
const comentar = () => {
    // Validacion del text area
    if( nuevoComentario.value.length === 0 ){
        errorAlert( 'Error :(', 'No debe haber comentarios vacios' )
        return;
    }
    
    const objComentario = {
        nombre: props.usuario.nombre,
        comentario: nuevoComentario.value,
        // Al entrar a la vista (LibroView) ya se sabe a que libro se hacen los comentarios
        libro: valoracion.comentarios[0].libro
    }

    // El comentario entra al state y luego se envia al servidor
    valoracion.comentarios.push( objComentario );
    valoracion.enviarComentario( objComentario );
}

const editar = (id) => {
    console.log('editando', id);
} 

const eliminar = (id) => {
    console.log('eliminando', id)
}

// Monitoreo
const hayComentarios = computed(() => {
    return valoracion.comentarios.length > 0
})

const hayAdmin = computed(() => {
    return props.usuario === undefined || props.usuario?.role === 'admin'
})
</script>