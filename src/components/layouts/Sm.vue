<template>
    <v-app-bar color="orange-darken-1" prominent>
        <!-- Boton para abrir panel de navegacion -->
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <!-- Logo de la app -->
        <v-toolbar-title>
                <RouterLink to="/" class="text-decoration-none text-white">Librerias App</RouterLink>
                <span v-if="usuario"> - {{ usuario.nombre }}</span>
        </v-toolbar-title>
    </v-app-bar>

    <!-- Panel de navegacion -->
    <v-navigation-drawer v-model="drawer" location="left" temporary color="grey-darken-4" width="270">
        <v-text-field color="white" label="Buscar" prepend-inner-icon="mdi-magnify" 
            variant="outlined" v-model="buscar" autocomplete="off" class="mt-5"
            @keyup.enter="$router.push({ name: 'buscar', params: { nombre: buscar } })"
        />

        <v-divider/>

        <BotonLink
            text="Inicio"
            icon="mdi-home"
            page-name="inicio"
        />

        <v-divider/>

        <BotonLink
            v-if="!usuario"
            text="Iniciar Sesión"
            icon="mdi-login"
            page-name="iniciar-sesion"
        />

        <v-divider/>

        <BotonLink
            v-if="!usuario"
            text="Registrarse"
            icon="mdi-account-edit"
            page-name="registro"
        />

        <v-divider/>

        <BotonLink
            v-if="usuario && usuario.role === 'user'"
            text="Carrito"
            icon="mdi-cart"
            page-name="carrito"
        />

        <v-divider/>

        <BotonLink
            v-if="usuario && usuario.role === 'admin'"
            text="Administrador"
            icon="mdi-account-key"
            page-name="admin"
        />

        <v-divider/>

        <BotonLink
            v-if="usuario"
            text="Cerrar Sesión"
            icon="mdi-logout"
            @cerrar-sesion="$emit('handle-sesion')"
        />

        <v-divider/>

    </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import BotonLink from '../ui/BotonLink.vue'

defineProps({
    usuario: {
        type: [Object, null],
        required: true
    }
})

defineEmits([ 'handle-sesion' ])

const drawer = ref(true)
const buscar = ref('')
</script>