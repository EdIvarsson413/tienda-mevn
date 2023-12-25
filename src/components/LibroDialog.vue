<template>
    <v-row justify="center">
        <v-dialog v-model="$props.abrir" persistent width="1024" class="fondo" >
            <v-card color="grey-darken-3">
                <!-- Titulo del dialog -->
                <v-card-title class="text-h5 ma-3 text-start">{{ $props.editando.titulo }}</v-card-title>
                <v-card-subtitle v-if="estaEditando" class="text-body-2 mx-3 text-yellow text-start">
                    Vuelva a escribir los campos antiguos y cambie los que desee
                </v-card-subtitle>
                
                <!-- Contenido del dialog -->
                <v-card-text>
                    <v-container>
                        <v-row>
                            <!-- Espacio para el input del nombre -->
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Nombre" variant="outlined" color="orange-darken-1"
                                    v-model="libros.libro.nombre" :placeholder="placeEditando('nombre')"/>
                            </v-col>

                            <!-- Espacio para el input de la saga -->
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Saga" variant="outlined" color="orange-darken-1"
                                    v-model="libros.libro.saga" :placeholder="placeEditando('saga')"/>
                            </v-col>

                            <!-- Espacio para el input del autor -->
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field label="Autor" variant="outlined" color="orange-darken-1" 
                                    v-model="libros.libro.autor" :placeholder="placeEditando('autor')"/>
                            </v-col>

                            <!-- Esapcio para el input del precio -->
                            <v-col cols="6">
                                <v-text-field label="Precio" variant="outlined" color="orange-darken-1" 
                                    v-model="libros.libro.precio" :placeholder="placeEditando('precio').toString()"/>
                            </v-col>

                            <!-- Espacio para el select de tipo -->
                            <v-col cols="12" sm="6">
                                <v-autocomplete :items="['libro', 'boxset']" label="Tipo" variant="outlined"
                                    color="orange-darken-1" v-model="libros.libro.tipo" 
                                    :placeholder="placeEditando('tipo')"/>
                            </v-col>
                            
                            <!-- Espacio para el token de promocion -->
                            <v-col cols="12" sm="6">
                                <v-text-field label="ID de promoción" variant="outlined" color="orange-darken-1" 
                                    v-model="libros.libro.tokenPromo" :placeholder="placeEditando('tokenPromo')"/>
                            </v-col>

                            <!-- Espacio para el textarea de la sinopsis -->
                            <v-col cols="12">
                                <v-textarea label="Sinopsis" variant="outlined" color="orange-darken-1" 
                                    v-model="libros.libro.sinopsis" :placeholder="placeEditando('sinopsis')"/>
                            </v-col>

                            <!-- Espacio para el file input de la portada -->
                            <v-col cols="12" class="d-flex">
                                <!-- <input accept="image/*" type="file" ref="myfile"> -->
                                <v-file-input 
                                    label="Portada"
                                    variant="outlined"
                                    color="orange-darken-1"
                                    class="w-100"
                                    accept="image/*"
                                    ref="portada"
                                    @change="handlePortada"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>

                <!-- Acciones del dialog -->
                <v-card-actions>
                    <!-- Cerrar dialog -->
                    <v-btn color="orange-darken-1" variant="text" text="Cerrar" 
                        @click="$emit('cerrar-dialog')"
                    />
                    
                    <!-- Añadir o editar -->
                    <v-btn color="orange-darken-1" variant="text" 
                        :text="$props.editando.btnTitulo" @click="btnFuncion"
                    />

                    <!-- Subir portada -->
                    <v-btn color="orange-darken-1" variant="text" text="Subir portada" 
                        :disabled="habilitarSubirPortada" @click="subirPortada"
                    />

                    <!-- Mensaje si se subio la portada -->
                    <p class="mx-4 text-body-1">{{ nuevoMsgPortada }}</p>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script setup>
import { ref, computed, toRaw } from 'vue'
import { storage } from '../js/firebase'
import { ref as refFirebase, uploadBytes } from 'firebase/storage'
import { useLibrosStore } from '../stores/libros'
import { ok, error as errorAlert } from '../js/Notificacion'
import { validacionAgregar, validacionEditar } from '../js/validaciones'

// ----------- Importaciones ----------- //
const libros = useLibrosStore();

const props = defineProps({
    abrir: Boolean,
    editando: Object
})

const emits = defineEmits([ 'cerrar-dialog' ])


// ----------- Variables reactivas ----------- //
const portada = ref(null);
const nuevoMsgPortada = ref( props.editando.msjPortada );
const habilitarSubirPortada = ref(true);


// ----------- Funciones ----------- //
function agregar() {
    // Si la imagen ya fue cargada se rescata el nombre del archivo
    if( portada.value && portada.value.files.length > 0 ){
        libros.libro.imagen = portada.value.files[0].name;
    }

    // Validacion del resto de campos (menos tokenPromo)
    if( validacionAgregar( toRaw( libros.libro )) ) {
        emits('cerrar-dialog');
        setTimeout(() => {
            errorAlert( 'Error :(', 'Campos vacios' );
        }, 100);
        return
    }
    
    // Agrega el libro al arreglo(Socket.io) y a la base de datos
    libros.agregarLibro();
    emits('cerrar-dialog');
}

function editar() {
    // Se salva la nueva imagen (opcional)
    if( portada.value && portada.value.files.length > 0 ) {
        libros.libro.imagen = portada.value.files[0].name;
    }

    // Validacion de campos
    if( validacionEditar( toRaw( libros.libro ) ) ) {
        // El botond e cerrar no estará disponible
        errorAlert( 'Error :(', 'Campos vacios' );
        return;
    }
    

    // Nuevo objeto a base de los datos nuevos (libros.libro)
    // y se obtiene el id libroEditar
    const { _id, ...libroAux } = libros.libro;
    libroAux._id = libros.libroEditar._id

    // // Indexa en el arreglo y reemplaza los datos
    const index = libros.catalogo.findIndex( libroP => libroP._id === libroAux._id );
    libros.catalogo[index] = libroAux;

    // // Realiza la petición y cierra el dialog
    libros.editarLibro( libroAux );
    emits('cerrar-dialog');
}

// Manejar archivo de la portada
const handlePortada = () => {
    if( portada.value && portada.value.files.length > 0 ) {
        // Si ya hay una portada se cambia el mensaje y habilita el
        // boton para subir la portada
        nuevoMsgPortada.value = 'Portada pre-cargada'
        habilitarSubirPortada.value = false;
    } else {
        console.log('Campo de archivo vacío');
    }
}

// Subir portada a Firestore
const subirPortada = () => {
    // Crea un archivo vacio primero, despues se le pasan los bytes 
    const storageRef = refFirebase( storage, `portadas/${portada.value.files[0].name}`)

    uploadBytes( storageRef, portada.value.files[0] )
        .then( snapshot => { 
            nuevoMsgPortada.value = `${portada.value.files[0].name} ha sido cargada` 
        })
        .catch( error => {} )
}

// ----------- Monitoreo ----------- //
const btnFuncion = computed(() => { 
    // Si el titulo del dialogo dice Edición retorna la funcion 
    // que permite editar un libro
    if( props.editando.titulo.includes( 'Edición' ) ) return editar

    return agregar
})

// Evalua si el administrador está editando un libro
const estaEditando = computed(() => {
    return props.editando.titulo.includes( 'Edición' )
})

/**
 * Si se esta editando libro, en los placeholder 
 * se muestran los datos originales
 */
const placeEditando = ( campo ) => {
    return estaEditando.value ? libros.libroEditar[campo] : ''
}
</script>