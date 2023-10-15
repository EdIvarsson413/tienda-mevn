<template>
    <div class="d-flex justify-center mt-10">
        <star-rating
        :rating="estrellas"
        :max-stars="5"
        :star-size="estrellasTamaño"
        :active-color="'#fb8c00'"
        :glow="2"
        :read-only="hayAdmin"
        @update:rating="calificar"
    />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import StarRating from 'vue-star-rating'
import { useAuthStore } from '../../stores/auth'
import { useValoracionStore } from '../../stores/valoracion'

const props = defineProps({
    nombreLibro: String
})

// Importaciones
const auth = useAuthStore();
const valoracion = useValoracionStore();

// Variables reactivas
const usuario = ref(null);
const estrellas = ref(0);

// Al entrar a la pagina del detalle de libro
onMounted( async () => {
    try {
        usuario.value = await auth.obtenerUsuario();
        const data = await valoracion.obtenerCalificacion();
        estrellas.value = data;
    } catch (error) { console.log(error) }
})

// Funciones
const calificar = ( event ) => {
    const obj = {};

    obj.estrellas = event
    obj.nombreLibro = props.nombreLibro
    obj.nombreUsuario = usuario.value.nombre

    valoracion.enviarCalificacion(obj)
}

// Monitoreo
const estrellasTamaño = computed(() => {
    const ancho = window.innerWidth;
    return ancho > 600 && ancho < 960 ? 50 : 40;
})


const hayAdmin = computed(() => {
    return usuario.value?.role === 'admin' || usuario.value === undefined;
})
</script>