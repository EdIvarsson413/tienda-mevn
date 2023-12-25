<template>
    <!-- Si hay libros en carrito -->
    <v-row v-if="librosEnCarrito">
        <!-- Libros a pedir 50% - 100% -->
        <v-col md="6" sm="12" :class="[cantidadItems ? 'listaPedido' : '']">
            <ListaLibrosPedir 
                @editar-item="editarItem"
                @eliminar-item="eliminarItem"
            />
        </v-col>
        
        <!-- Total y acciones %50 - %100 -->
        <v-col md="6" sm="12" class="margen-total">
            <Total 
                @terminar-compra="terminarCompra"
                @cancelar-compra="cancelarCompra"
            />
        </v-col>
    </v-row>

    <!-- Si no hay libros en carrito -->
    <div v-else>
        <v-card class="w-75 mx-auto" height="150" color="grey-darken-4">
            <p class="text-h2 text-center mt-md-9 mt-sm-4 text-red">No hay libros en carrito</p>
        </v-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ListaLibrosPedir from '../components/ListaLibrosPedir.vue'
import Total from '../components/Total.vue'
import { useCompraStore } from '../stores/compra'
import { useAuthStore } from '../stores/auth'
import { ok, escribirInput, confirmar, error } from '../js/Notificacion.js'


// ----------- Importaciones ----------- //
const compra = useCompraStore();
const auth = useAuthStore();

// ----------- Variables reactivas ----------- //
const usuario = ref(null);


// ----------- Funciones ----------- //
const editarItem = async ( id, nombre ) => {
    const respuesta = await escribirInput( `Editar item en lista - ${nombre}`, 'Modifica las unidades' )
    
    if( respuesta === undefined ) {
        error( 'Error de edición', 'Debes seleccionar unidades' );
        return;
    }

    // Modifica solo la lista y el item seleccionado
    const index = compra.listaPedir.findIndex( item => item.id === id);
    compra.listaPedir[index].unidades = respuesta;
}

const eliminarItem = async ( id, nombre ) => {
    const respuesta = await confirmar( 
        `Eliminar item en lista`, 
        `¿Estás seguro de eliminar ${nombre} de tu lista de compra?`,
        'Si, eliminar' 
    );
    
    if( respuesta ) {
        compra.listaPedir = compra.listaPedir.filter( item => item.id !== id );
        ok( 'Ok ;)', 'Item eliminado correctamente' )
    }
}

const terminarCompra = async () => {
    // Determinar primero si el cliente quiere terminar la compra
    const respuesta = await confirmar( 
        'Terminar compra', 
        '¿Es todo lo que te llevarás?',
        'Si, quiero mi pedido'
    );

    if( respuesta ) {
        // Saber si hubo alguna oferta en alguno de los items del pedido
        const siObtuvo = compra.listaPedir.findIndex( item => item.aplicoPromo );
        
        let aplicoPromo;
        if( siObtuvo >= 0 )
            aplicoPromo = true;
        else
            aplicoPromo = false;
        
        compra.finalizarCompra( usuario.value._id, usuario.value.nombre, aplicoPromo );
    }
}

const cancelarCompra = async () => {
    const respuesta = await confirmar( 
        `Cancelar compra`, 
        `¿Estás seguro de limpiar el carrito?`,
        'Si, eliminar' 
    );

    if( respuesta ) {
        compra.listaPedir = []
        ok( 'Ok ;)', 'Carrito limpiado correctamente' );
    }
}


// ----------- Monitorieo ----------- //

// Si hay 4 items en lista o más
const cantidadItems = computed(() => {
    return compra.listaPedir.length >= 4
}) 

// Si hay libros en carrito
const librosEnCarrito = computed(() => {
    return compra.listaPedir.length > 0
})

// Obtener usuario
onMounted( async () => {
    try {
        const data = await auth.obtenerUsuario();
        usuario.value = data;
    } catch (error) { console.log(error) }
})
</script>