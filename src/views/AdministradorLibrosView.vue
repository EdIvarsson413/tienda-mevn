<template>
    <!-- Acciones (agregar, conteo d libros y agregar promocion) -->
    <v-btn-group 
        color="orange-darken-1" 
        density="comfortable" 
        class="d-flex justify-center my-2"
    >
        <v-btn variant="plain" :text="cantidad" size="large" />
        <v-btn
            text="Agregar Libro"
            prepend-icon="mdi-plus"
            @click="nuevoDialog"
        />
        <v-btn
            text="Ir a las promociones"
            append-icon="mdi-arrow-right"
            :to="{ name: 'promos' }"
        />
    </v-btn-group>

    <!-- Tabla de libros -->
    <v-table height="510" class="mt-8" hover theme="dark">
        <thead>
            <tr>
                <th class="text-center w-25">Portada</th>
                <th class="text-center">Nombre</th>
                <th class="text-center">Saga</th>
                <th class="text-center">Acciones</th>
            </tr>
        </thead>
        <tbody>
            <Renglon
                v-for="libro in libros.catalogo"
                :key="libro._id"
                :libro="libro"
                @editar-dialog="editarDialog"
                @eliminar-swal="eliminarSwal"
            />
        </tbody>
    </v-table>

    <!-- El dialog aparece en el centro de la pantalla
        si importar donde es escriba en el template -->
    <LibroDialog
        v-if="abrir"
        :abrir="abrir"
        @cerrar-dialog="cerrarDialog"
        :editando="editando"
    />

</template>

<script setup>
import { ref, computed } from 'vue'
import { useLibrosStore } from '../stores/libros'
import Renglon from '../components/Renglon.vue'
import LibroDialog from '../components/LibroDialog.vue'
import { advertencia, confirmar } from '../js/Notificacion';

// Importar store
const libros = useLibrosStore();

// Variables reactivas y no reacivas
const abrir = ref(false);
const editar  = ref(false);
const libroInicial = {
    _id: '',
    nombre: '',
    saga: '',
    autor: '',
    precio: 0,
    sinopsis: '',
    imagen: '',
    tipo: '',
    tokenPromo: ''
}

// Metodos
const nuevoDialog = () => {
    // Abre el dialog, no se activa el modo de edicion y reinicia el state de libro
    abrir.value = true;
    editar.value = false;
    Object.assign( libros.libro, libroInicial )
}

// Abre el mismo dialog pero con campos llenos
const editarDialog = (id) => {
    abrir.value = true;
    editar.value = true;

    // Se busca el libro por su indice y se agregan los datos a la variable del store
    const index = libros.catalogo.findIndex( libro => libro._id === id );
    libros.libro = libros.catalogo[index];
}

// Aqui no se usa el dialog, en su lugar usa un swalaert
const eliminarSwal = async ( id, nombre ) => {
    const resultado = await confirmar( nombre, `¿Estás seguro de eliminar ${nombre}?`, 'Si, eliminar' );
    
    if( resultado ){
        // Eliminar primero del state
        libros.catalogo = libros.catalogo.filter( libro => libro._id !== id);
        console.log(libros.catalogo)

        // Peticion para eliminar de la base de datos
        libros.eliminarLibro( id );
        return;
    }

    // Si el usuario no acepto eliminar el libro
    advertencia('Upps...', 'El libro no se eliminó');
}

// Cierra el dialog y quita el modo de edicion
const cerrarDialog = () => {
    abrir.value = false;
    editar.value =  false;
}

// Monitoreo
const cantidad = computed(() => {
    const cantLibros = libros.catalogo.length 
    if( cantLibros > 1 ) return `Hay ${cantLibros} libros`

    return 'Hay un libro'
})

const editando = computed(() => {
    // Verificando si el dialog esta en modo edicion y si ya se recogio un libro
    if( editar.value && libros.libro){
        return {
            titulo: `Edición - ${libros.libro.nombre}`,
            msjPortada: `La portada de este libro es: ${libros.libro.imagen}`,
            btnTitulo: 'Editar Libro'
        }}

    // Se devuelve un objeto para no tener problemas con los valores si está
    // el modo de edicion activado, este objeto va a los placeholder del dialog
    return {
        titulo: 'Agregar Nuevo Libro',
        msjPortada: 'No hay portada seleccionada',
        btnTitulo: 'Agregar Libro'
    }
})
</script>