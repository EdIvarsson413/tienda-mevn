import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { ok } from '../js/Notificacion'

export const useValoracionStore = defineStore('valoracion', () => {
    // ----------- Varibales del store ----------- //
    const comentarios = ref([]);
    const route = useRoute();

    // Obtener comentarios por nombre del libro
    const obtenerComentarios = async ( nombreLibro ) => {
        try {
            const { data } = await axios( `${import.meta.env.VITE_BACKEND_URL}/api/comentarios/${nombreLibro}` );
            comentarios.value = data
        } catch (error) {
            console.log(error)
        }
    }

    // Nuevo comentario  
    const enviarComentario = async ( objComentario ) => {
        await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/comentarios`, 
        {
            nombre: objComentario.nombre,
            comentario: objComentario.comentario,
            libro: objComentario.libro
        })
            .then( data => {
                ok( 'Ok ;)', data.data.msg );
            })
            .catch( error => {})
    }

    // Editar comentario 
    const editarComentario = async ( objeto ) => {
        const { id, comentario } = objeto;

        await axios.put( `${import.meta.env.VITE_BACKEND_URL}/api/comentarios/${id}`,
        {
            comentario: comentario
        })
            .then( data => {
                ok( 'Ok ;)', data.data.msg );
            })
            .catch( error => {})
    }

    // Eliminar comentario
    const eliminarComentario = async ( id ) => {
        await axios.delete( `${import.meta.env.VITE_BACKEND_URL}/api/comentarios/${id}` )
            .then( data => {
                ok( 'Ok ;)', data.data.msg );
            })
            .catch( error => {console.log(error)})
    }

    // Obtener la calificacion de un libro dada por un usuario
    const obtenerCalificacion = async () => {
        let auxEstrellas = 0;

        try {
            const data = await libros.obtenerLibroId( route.params.id )

            const { data: dataEstre } = await axios ( `${import.meta.env.VITE_BACKEND_URL}/api/estrellas/${data.nombre}` );
            
            auxEstrellas = dataEstre[0].estrellas;
            return auxEstrellas;
        } catch( error ) {
            // Tratar error
            return auxEstrellas;
        }
    }

    // Enviar calificacion
    const enviarCalificacion = async ( info ) => {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/estrellas`, {
            nombre: info.nombreUsuario,
            estrellas: info.estrellas,
            libro: info.nombreLibro
        })
            .then(({ data }) => {
                // Envia un mensaje al usuario en respuesta
                ok('Ok ;)', data.msg);
            })
            .catch(error => {
                // Manejo de errores
            });
    }

    return {
        comentarios,
        obtenerCalificacion,
        enviarCalificacion,
        obtenerComentarios,
        enviarComentario,
        editarComentario,
        eliminarComentario
    }
})