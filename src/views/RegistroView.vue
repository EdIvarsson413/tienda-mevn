<template>
    <v-card class="mx-auto mt-10" color="grey-darken-4" elevation="5" max-width="600">
        <v-card-title class="text-h5 text-center my-4">Registrarse</v-card-title>

        <v-form autocomplete="off" class="px-5" @keyup.enter="handleSubmit">
            <v-text-field
                class="mb-3"
                label="Nombre de usuario"
                variant="outlined"
                color="orange-darken-1"
                v-model="usuario.nombre"
            />

            <v-text-field
                class="mb-3"
                label="Correo"
                variant="outlined"
                color="orange-darken-1"
                v-model="usuario.correo"
                :rules="reglas.correo"
            />

            <v-text-field
                class="mb-3"
                label="Contraseña"
                type="password"
                variant="outlined"
                color="orange-darken-1"
                v-model="usuario.contraseña"
                :rules="reglas.contraseña"
            />

            <v-text-field
                class="mb-3"
                label="Repetir contraseña"
                type="password"
                variant="outlined"
                color="orange-darken-1"
                v-model="usuario.repetir"
                :rules="reglas.repetir"
            />

            <v-card-actions class="justify-center mb-2">
                <v-btn 
                    color="orange-darken-1 w-100" 
                    size="large"
                    text="Registrarse"
                    @click="handleSubmit"
                />
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { error } from '../js/Notificacion'

const auth = useAuthStore();

// Campos del formulario
const usuario = reactive({
    nombre: '',
    correo: '',
    contraseña: '',
    repetir: ''
})

// Reglas en el campos
const reglas = {
    correo: [
        ( v ) => !!v || 'El correo es requerido',
        ( v ) => /.+@.+\..+/.test( v ) || 'El correo debe ser válido',
    ],
    contraseña: [
        ( v ) => !!v || 'La contraseña es requerida',
        ( v ) => v.length >= 6 || 'La contraseña debe tener al menos 6 caracteres',
    ],
    repetir: [
        ( v ) => !!v || 'La repetición de contraseña es requerida',
        ( v ) => v === usuario.contraseña || 'Las contraseñas no coinciden',
    ]
}

// Llama del store para registrarse
const handleSubmit = () => {
    // Validacion de campos
    if( Object.values( usuario ).includes('') ) {
        error( 'Error', 'Debes llenar los campos');
        return
    }

    // Si no hay campos vacios
    auth.registrar( usuario )
}
</script>