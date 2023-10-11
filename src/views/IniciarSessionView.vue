<template>
    <v-card class="mx-auto mt-10" color="grey-darken-4" elevation="5" max-width="600">
        <v-card-title class="text-h5 text-center my-4">Iniciar Sesión</v-card-title>

        <v-form autocomplete="off" class="px-5" @keyup.enter="handleSubmit">
            <v-text-field
                class="mb-3"
                label="Correo electrónico" 
                variant="outlined"
                color="orange-darken-1"
                v-model="usuario.correo"
                :rules="reglas.correo"
            />

            <v-text-field
                class="mb-3"
                label="Correo electrónico" 
                variant="outlined"
                color="orange-darken-1"
                type="password"
                v-model="usuario.contraseña"
                :rules="reglas.contraseña"
            />

            <v-card-actions class="justify-center mb-2">
                <v-btn 
                    color="orange-darken-1 w-100" 
                    size="large"
                    text="Inciar Sesión"
                    @click="handleSubmit"
                />
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script setup>
import { reactive } from 'vue'
import { error as errorAlert } from '../js/Notificacion' 
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore();

// Campos del formulario
const usuario = reactive({
    correo: '',
    contraseña: ''
})

// Reglas del formulario
const reglas = {
    correo: [
        ( v ) => !!v || 'El correo es requerido',
        ( v ) => /.+@.+\..+/.test( v ) || 'El correo debe ser válido',
    ],
    contraseña: [
        (v) => !!v || 'La contraseña es requerida',
        (v) => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
    ]
}

const handleSubmit = () => {
    // Validacion de campos
    if( Object.values( usuario ).includes('') ) {
        errorAlert( 'Error :(', 'Todos los campos son obligatorios' );
        return
    }

    // Si el formulario esta lleno
    auth.iniciarSesion( usuario )
}
</script>