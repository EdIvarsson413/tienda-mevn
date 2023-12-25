<template>
    <v-card class="lista-comentarios" color="grey-darken-4" elevation="5">
        <v-card-title>Comentarios</v-card-title>
        
        <v-divider />

        <!-- Textarea para comentar -->
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

            <!-- Accion para publicar comentario -->
            <v-btn 
                class="w-100" 
                color="orange-darken-1" 
                variant="outlined" 
                append-icon="mdi-comment"
                :text="editando"
                :disabled="hayAdmin"
                @click="comentar"
            />
        </section>

        <!-- Si hay comentarios -->
        <section v-if="hayComentarios" :class="[cantidadComentarios]">
            <Comentario 
                v-for="comentario in valoracion.comentarios"
                :key="comentario._id"
                :comentario="comentario"
                :usuario="usuario"
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
import { ref, computed } from 'vue'
import Comentario from '../Comentario.vue'
import { useValoracionStore } from '../../stores/valoracion'
import { error as errorAlert, advertencia, confirmar } from '../../js/Notificacion'

const props = defineProps({
    usuario: Object,
    libro: Object
})

// ----------- Importaciones ----------- //
const valoracion = useValoracionStore();


// ----------- Variables reactivas ----------- //
const nuevoComentario = ref('');
const index = ref(-1);


// ----------- Funciones ----------- //
const comentar = () => {
    // Validacion del text area
    if( nuevoComentario.value.length === 0 ){
        errorAlert( 'Error :(', 'No debe haber comentarios vacios' )
        return;
    }
    
    // Si se esta editando un comentario
    if( editando.value.includes( 'Editar' ) ) {
        const objEdiComentario = {
            id: valoracion.comentarios[index.value]._id,
            comentario: nuevoComentario.value // comentario modificado
        }

        // Primero se modifica el state y luego se envia a servidor
        valoracion.comentarios[index.value].comentario = nuevoComentario.value
        valoracion.editarComentario(objEdiComentario)
        
        // Reiniciar el index por si se hace comentario nuevo
        index.value = -1;
        nuevoComentario.value = ''
        return;
    }

    const objComentario = {
        nombre: props.usuario.nombre,
        comentario: nuevoComentario.value,
        // Al entrar a la vista (LibroView) ya se sabe a que libro se hacen los comentarios
        libro: props.libro.nombre
    }

    // El comentario entra al state y luego se envia al servidor
    valoracion.comentarios.push( objComentario );
    valoracion.enviarComentario( objComentario );
    nuevoComentario.value = ''
}

const editar = ( id ) => {
    // Solo se obtiene el objeto del comentario para comenzar la edicion
    index.value = valoracion.comentarios.findIndex( comentario => comentario._id === id );
    nuevoComentario.value = valoracion.comentarios[index.value].comentario;
} 

const eliminar = async ( id ) => {
    const respuesta = await confirmar( 
        `Eliminar Comentario`,
        `¿Estás seguro de eliminar tu comentario?, ${props.usuario.nombre}`,
        "Si, eliminar"
    );


    if( respuesta ) {
        // Modifica state y luego elimina del servidor
        valoracion.comentarios = valoracion.comentarios.filter( comentario => comentario._id !== id );
        valoracion.eliminarComentario( id );
        return
    }

    advertencia( `Eliminar Comentario`, 'El comentario no ha sido eliminado' )
}

// ----------- Monitoreo ----------- //
// Verificar si hay comentarios
const hayComentarios = computed(() => {
    return valoracion.comentarios.length > 0
})

// Ver si el administrador esta en la pagina
const hayAdmin = computed(() => {
    return props.usuario === undefined || props.usuario?.role === 'admin'
})

const editando = computed(() =>  {
    // Si ya se encontro el comentario, se cambia el tituto del boton de comentar
    if( index.value >= 0 && nuevoComentario.value !== '' )
        return 'Editar comentario';
    else{ 
        index.value = -1;
        return 'Comentar'
    }
    
}) 

// Si hay 5 o más comentarios, se agrega una clase de css 
// al contenedor de comentarios
const cantidadComentarios = computed(() => { 
    return valoracion.comentarios.length >= 5 ? 'comentarios-ajuste' : '' 
})
</script>