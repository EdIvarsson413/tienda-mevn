import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { error as errorAlert, ok } from '../js/Notificacion'

export const useAuthStore = defineStore('', () => {
    // ----------- Variables del store ----------- //
    const mensaje = ref('');
    const userID = ref('');

    // ----------- Funciones ----------- //
    async function registrar( usuario ) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/registro`,
        {
            nombre: usuario.nombre,
            email: usuario.correo,
            password: usuario.contraseña
        })
        .then( data => { 
            // Si la peticion es aceptada
            mensaje.value = data.data.msg;
            ok( 'Ok ;)', mensaje.value );
        })
        .catch( error => {
            errorAlert( 'Error :(', error.response.data.msg );
        })
    }

    async function iniciarSesion( usuario ) {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/login`, 
            {
                email: usuario.correo, 
                password: usuario.contraseña 
            }
        )
        .then( data => {
            // Si la peticion es aceptada
            const { data: respuesta } = data;
            // ok( 'Ok ;)', respuesta.msg );

            // Se guardan algunos datos en Ls
            localStorage.setItem( 'token', respuesta.jwt );
            localStorage.setItem( 'lista', 'lista-' + respuesta.nombre)

            // Envia al usuario a otra pagina
            setTimeout(() => {
                document.location.pathname = '/'
            }, 350);
        })
        .catch( (error) => {
            errorAlert( 'Error :(', error.response.data.msg )
        })
    }

    async function obtenerUsuario() {
        const token = localStorage.getItem( 'token' );
        
        // Si no hay token en LS
        if( !token ) return;

        try {
            // Se sacan los datos de la respuesta a la peticion
            const { data } = await axios( `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil` ,
                {   
                    // Se actian los headers para usar el Bearer token
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            
            // Se da salida a los datos extraidos
            return data
        } catch(error ) {console.log(error)}
    }

    // Cerrar sesion
    function cerrarSesion() { 
        // Se elimina el jwt del local storage
        localStorage.removeItem('token');
        localStorage.removeItem('nombre');

        // Se recarga la pagna
        document.location.pathname = '/';
    };

    return {
        registrar,
        iniciarSesion,
        obtenerUsuario,
        cerrarSesion
    }
})