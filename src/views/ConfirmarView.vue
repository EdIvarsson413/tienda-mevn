<template>
    <div class="d-flex justify-center">
        <v-card class="w-75 mt-10" color="grey-darken-4" :height="cambiarTamaño">
            <v-card-title v-if="err" class="text-h2 text-center text-red mt-8">{{ mensaje }}</v-card-title>
            <div v-else>
                <v-card-title class="text-h2 text-center text-green mt-16">{{ mensaje }}</v-card-title>
                <v-card-subtitle class="text-h5 text-center mt-4">
                    <RouterLink :to="{ name: 'iniciar-sesion' }" text="Iniciar Sesión" style="text-decoration: none; color: white;"/>
                </v-card-subtitle>
            </div>
    </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute();
const { token } = route.params;
const mensaje = ref('');
const err = ref(false);

onMounted(() => {
    // Realiza la peticion para confirmar cuenta, si el token es valido
    const confirmarCuenta = async () => {
        try {
            // Primero se construye la url
            const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/confirmar/${token}`;
            const { data } = await axios(url)
            mensaje.value = data.msg;
            err.value = false;
        } catch (error) { 
            mensaje.value = error.response.data.msg; 
            err.value = true;
        }
    }

    confirmarCuenta();
});

// Observaciones cuando se inicia el componente
const cambiarTamaño = computed(() => {
    return err.value ? 123 : 250;
})
</script>