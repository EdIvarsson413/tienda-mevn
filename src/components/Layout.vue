<template>
    <!-- Barra de navegacion en pantallas MD en delante -->
    <General 
        v-if="mdAndUp"
        :usuario="usuario"
        @handle-sesion="handleSesion"
    />

    <!-- Panel de nevegacion en pantallas SM -->
    <Sm 
        v-if="sm"
        :usuario="usuario"
        @handle-sesion="handleSesion"
    />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCompraStore } from '../stores/compra'
import General from './layouts/General.vue'
import Sm from './layouts/Sm.vue'

// ----------- Importaciones ----------- //
const auth = useAuthStore();
const compra = useCompraStore();
const { width, sm, mdAndUp } = useDisplay();


// ----------- Variables reactivas ----------- //
const usuario = ref(null);


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


// ----------- Metodos ----------- //
// Manejo del logout
const handleSesion = () => {
    auth.cerrarSesion();
    usuario.value = null;
}
</script>