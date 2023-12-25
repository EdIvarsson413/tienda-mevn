<template>
    <v-app-bar
        color="orange-darken-1" 
        elevation="5" 
        height="150"
    >
        <v-container>
            <v-row>
                <!-- Logo -->
                <v-col sm="12" md="3">
                    <v-container>
                        <RouterLink to="/">
                            <v-img src="/logo.png" width="250" class="mx-auto"/>
                        </RouterLink>
                    </v-container>
                </v-col>

                <!-- Campo de texto -->
                <v-col sm="12" md="6" class="d-flex justify-center align-center">
                    <v-text-field color="white" label="Buscar" prepend-inner-icon="mdi-magnify" 
                        variant="outlined" v-model="buscar" autocomplete="off"
                        @keyup.enter="$router.push({ name: 'buscar', params: { nombre: buscar } })"
                    />
                </v-col>

                <!-- Botones -->
                <v-col md="3" class="d-flex pb-3 justify-center align-center mx-auto">
                    <p v-if="usuario" class="ml-3 pl-4 text-body-1">{{ usuario.nombre }} </p>
                    <BotonLink
                        v-if="!usuario"
                        text="Iniciar Sesión"
                        icon="mdi-login"
                        page-name="iniciar-sesion"
                    />
                    <BotonLink
                        v-if="!usuario"
                        text="Registrarse"
                        icon="mdi-account-edit"
                        page-name="registro"
                    />
                    <BotonLink
                        v-if="usuario && usuario.role === 'user'"
                        text="Carrito"
                        icon="mdi-cart"
                        page-name="carrito"
                    />
                    <BotonLink
                        v-if="usuario && usuario.role === 'admin'"
                        text="Administrador"
                        icon="mdi-account-key"
                        page-name="admin"
                    />
                    <BotonLink
                        v-if="usuario"
                        text="Cerrar Sesión"
                        icon="mdi-logout"
                        @cerrar-sesion="$emit('handle-sesion')"
                    />
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import BotonLink from '../ui/BotonLink.vue'

defineProps({
    usuario: {
        type: [ Object, null],
        required: true
    }
})

defineEmits([ 'handle-sesion' ])


const buscar = ref('');
</script>