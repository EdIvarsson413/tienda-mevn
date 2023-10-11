<template>
    <v-app-bar app color="orange-darken-1" elevation="0" :height="tamaño">
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
                    <v-text-field color="white" label="Buscar" prepend-inner-icon="mdi-magnify" variant="outlined" />
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
                        @cerrar-sesion="handleSesion"
                    />
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BotonLink from './ui/BotonLink.vue'

// Importar el sotre de autenticacion
const auth = useAuthStore();
const usuario = ref(null)

// Al iniciar la app se extraen los datos del usuario actual
onMounted(async () => {
    try {
        // Extraen los datos de decifrado del jwt
        const obj = await auth.obtenerUsuario();
        
        // Si hay datos del usuario
        if( obj ) {
            usuario.value = obj;
        }

    } catch (error) {
        console.log(error);
    }
})

// Se automatiza el tamaño del navbar
const tamaño = computed(() => {
    const innerWidth = window.innerWidth;
    
    if( innerWidth >= 600 && innerWidth < 960 ) return 350

    return 150
})

// Manejo del logout
const handleSesion = () => {
    auth.cerrarSesion();
    usuario.value = null;
}
</script>