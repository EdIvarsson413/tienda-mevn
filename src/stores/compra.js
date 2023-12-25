import { ref, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import io from 'socket.io-client'
import { error as errorAlert, ok } from '../js/Notificacion.js'

export const useCompraStore = defineStore('compra', () => {
    // ----------- Varibales del store ----------- //
    const listaPedir = ref([]);
    const terminando = ref(false);
    const promociones = ref([]);
    const listaId = ref('');

    // Variables auxiliares
    let datosCrudos;
    let socket;

    // Cada vez que se guarda un libro en la lista se guarda en LS
    watch( listaPedir, () => {
        localStorage.setItem( listaId.value, JSON.stringify( listaPedir.value ) )
    },{ deep: true })

    onMounted(() => {
        // Cada vez que se inicia la app se carga la lista de LS
        listaId.value = localStorage.getItem( "lista" )
        const listaLS = localStorage.getItem( listaId.value )
        if( listaLS ) listaPedir.value = JSON.parse( listaLS );
        
        // Cargar promociones
        obtenerPromociones()
        
        // Socket.io - iniciar sala
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('cargando promociones', 'Cargando promociones...')
    })
    
    // Este onMounted se realiza siempre que se ejecuten los eventos de socket
    onMounted(() => {
        // Propagar la promocion 
        socket.on('agregar promocion', promo => {
            // Si es el primer elemento del arreglo
            if( promociones.value.length === 0 ) {
                promociones.value.push( promo );
            } else {
                // Si ya hay elementos, se busca el grupo de cupones por el token de promocion
                let grupoEncontrado = false;

                for (let i = 0; i < promociones.value.length; i++) {
                    if( promo[0].tokenPromo === promociones.value[i][0].tokenPromo ) {
                        let tamañoGrupo = promociones.value[i].length;

                        // Se adjuntan los cupones
                        for (let j = 0; j < promo.length; j++) {
                            promociones.value[i][tamañoGrupo++] = promo[j];
                        }
                        grupoEncontrado = true;
                    }
                }
                
                // Si no se encontró grupo, se añade como nuevo elemento
                if( !grupoEncontrado ) {
                    promociones.value.push( promo )
                }
            }
        })

        // Eliminar promocion del state
        socket.on('eliminando promocion', tokenPromo => {
            console.log('eliminando', tokenPromo)

            // Filtrar por el token de promocion
            promociones.value = promociones.value.filter( promocion => promocion[0].tokenPromo !== tokenPromo )
        })
    })


    // ----------- Funciones ----------- //
    const finalizarCompra = async ( idCliente, nombreCliente, aplicoOferta ) => {
        terminando.value = true;
        
        // Llamada a la api
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/compra/`, {
            idCliente: idCliente,
            nombreCliente: nombreCliente,
            libros: listaPedir.value,
            aplicoPromo: aplicoOferta
        })
            .then( data => {
                ok( 'Compra terminada', data.data.msg );
                terminando.value = false;
            })
            .catch( error => {
                console.log(error);
                terminando.value = false;
            })

        listaPedir.value = []
    }

    // Promociones
    const crearPromocion = async ( promo ) => {
        // Concatenar campos
        const { fecha, cantidad, codigo, descuento, tokenPromo } = promo
        const concatenacion = `${cantidad}\$${codigo}\$${descuento}\$${fecha.getTime()}\$${tokenPromo}`
        
        // //Llamada a la API
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/promociones/`, { concatenacion: concatenacion },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then( data => {
                ok( 'Ok ;)', data.data.msg );

                /**
                 * Socket.io - emitir evento para recrear el grupo de cupones y 
                 * reflejarlo en el state
                */
                socket.emit('nueva promocion', concatenacion);
            })
            .catch( error => {
                errorAlert( 'Error :(', error.response.data.msg);
            })
    }

    const obtenerPromociones = async () => {
        // Primero obtener todos los cupones en un array
        try {
            const { data }  = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/promociones`);
            datosCrudos = data;
        } catch (error) { console.log(error) }

        // Agrupar cupones por su id de promo
        const nuevos = Object.groupBy( datosCrudos, ({ tokenPromo }) => tokenPromo);

        // Da como resultado un objeto que contiene arreglos, el objeto se convierte en arreglo
        promociones.value = Object.values( nuevos );
    }
    

    const eliminarPromociones = async ( tokenPromo ) => {
        await axios.delete( `${import.meta.env.VITE_BACKEND_URL}/api/promociones/${tokenPromo}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem( 'token' )}`
            }
        })
            .then( data => {
                ok( "Ok ;)", data.data.msg );

                /**
                 * Socket.io - emitir evento para obtener el token
                 *             y eliminar la promocion del resto de usuarios
                 */
                socket.emit('eliminar promocion', tokenPromo)
            })
            .catch( error => { console.log(error) })
    }

    const aplicarOferta = async ( codigo, fechaActual ) => {
        // Aqui se va a relealizar la operacion de descuento

        // Primero llamar a la API
        await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/promociones/aplicar`, {
            codigo: codigo,
            fecha:fechaActual
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem( 'token' )}`
            }
        })
            .then( data => {
                const datos = data.data

                // Buscar libro que se aplica descuento
                const libroIndex = listaPedir.value.findIndex( item => item.tokenPromo === datos.tokenPromo )
                
                if( libroIndex >= 0 ) {
                    // Aplicar descuento al precio
                    let precioNuevo = listaPedir.value[libroIndex].precio
                    precioNuevo = (datos.descuento * precioNuevo) / 100
                    
                    // Se cambia el id para evitar choque de referencias con nuevos libros
                    listaPedir.value[libroIndex].id += "-ofertaAplicada" 

                    // Cambiar atributos del libro
                    listaPedir.value[libroIndex].precio = precioNuevo
                    listaPedir.value[libroIndex].aplicoPromo = datos.aplico_promo
                    ok( 'Ok ;)', datos.msg )
                }
            })
            .catch( error => {
                console.log(error)
                errorAlert( 'Error :(', error.response.data.msg )
            })
    }

    return {
        listaPedir,
        finalizarCompra,
        terminando,
        crearPromocion,
        promociones,
        eliminarPromociones,
        aplicarOferta,
        listaId
    }
})