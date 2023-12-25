import { onMounted, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import io from 'socket.io-client'
import { ok, error as errorAlert } from '../js/Notificacion'

export const useLibrosStore = defineStore('libros', () => {
    // ----------- Variables del store ----------- //
    const catalogo = ref([])
    const libro = reactive({
        _id: '',
        nombre: '',
        saga: '',
        autor: '',
        precio: 0,
        sinopsis: '',
        imagen: '',
        tipo: '',
        tokenPromo: ''
    })
    const libroEditar = reactive({
        _id: '',
        nombre: '',
        saga: '',
        autor: '',
        precio: 0,
        sinopsis: '',
        imagen: '',
        tipo: '',
        tokenPromo: ''
    })

    // Socket.io
    let socket;

    // Obtener libros al iniciar la app
    onMounted(() => {
        const obtenerLibros = async () => {
            try {
                const { data } = await axios( `${import.meta.env.VITE_BACKEND_URL}/api/libros` );
                catalogo.value = data
            }catch(error) { console.log ( error ) }
        }
        obtenerLibros();

        // Socket.io - iniciar sala
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('cargando libros', 'Cargando libros...')
    })

    // Realizar eventos de sockets al entrar a la pagina
    onMounted(() => {
        socket.on('libro agregado', libro => {
            catalogo.value.push(libro)
        })
    })


    // ----------- Funciones ----------- //

    // Enviar un libro a la base de datos
    const agregarLibro = async () => {
        await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/libros`, 
        {
            nombre: libro.nombre,
            saga: libro.saga,
            autor: libro.autor,
            precio: libro.precio,
            sinopsis: libro.sinopsis,
            imagen: libro.imagen,
            tipo: libro.tipo,
            tokenPromo: libro.tokenPromo
        }, 
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then( data => {
                ok( 'Ok ;)', data.data.msg );

                // Socket.io - emitir evento para buscar datos del libro agregado en serviror
                socket.emit('nuevo libro', libro.nombre)
            })
            .catch( error => {
                errorAlert( 'Error :(', error.response.data.msg ); 
            })
    }

    const editarLibro = async ( libroP ) => {
        await axios.put(`${ import.meta.env.VITE_BACKEND_URL}/api/libros/${libroP._id}`,
        {
            nombre: libroP.nombre,
            saga: libroP.saga,
            autor: libroP.autor,
            precio: libroP.precio,
            sinopsis: libroP.sinopsis,
            imagen: libroP.imagen,
            tipo: libroP.tipo,
            tokenPromo: libroP.tokenPromo
        },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then( data => {
                ok( 'Ok ;)', data.data.msg );
            })
            .catch( error => { console.log(error) } )
    }

    const eliminarLibro = async (id) => {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/libros/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then( data => { ok('Ok ;)', data.data.msg); })
            .catch( error => {} )
    }

    // Obtener libro por id
    const obtenerLibroId = async (id) => {
        let objLibro = {}

        try {
            const { data } = await axios(`${import.meta.env.VITE_BACKEND_URL}/api/libros/id/${id}`);
            objLibro = data;
        } catch (error) {
            console.log(error);
        }

        return objLibro
    }

    // Obtener libro por nombre
    const obtenerLibroNombre = async (nombre) => {
        let objLibro = {}

        try {
            const data  = await axios(`${import.meta.env.VITE_BACKEND_URL}/api/libros/${nombre}`);
            objLibro = data.data;
            objLibro.codigo = data.status
        } catch (error) {
            objLibro.msg = error.response.data.msg
            objLibro.codigo = error.response.status
        }

        return objLibro
    }

    return {
        catalogo,
        libro,
        libroEditar,
        agregarLibro,
        editarLibro,
        eliminarLibro,
        obtenerLibroId,
        obtenerLibroNombre
    }
})