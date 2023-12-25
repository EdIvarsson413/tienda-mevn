<template>
    <!-- Acciones (conteo de promociones, agregar) -->
    <GrupoBotones 
        @abrir-dialog="abrirDialog"
        :total="cantPromociones"
    />

    <!-- Presentación en tarjetas -->
    <v-row class="mt-5">
        <v-col v-for="promocion in compra.promociones" md="6" sm="12">
            <CardPromocion 
                :promocion="promocion[0]"
                :key="promocion[0]._id"
                :cantidad="promocion.length"
            />
        </v-col>
    </v-row>

    <!-- Dialog paranueva promocion (centrada en la pantalla) -->
    <PromoDialog
        :abrir="abrir"
        @cerrar-dialog="cerrarDialog"
    />
</template>

<script setup>
import { ref, computed }  from 'vue'
import { useCompraStore } from '../stores/compra'
import GrupoBotones from '../components/ui/GrupoBotones.vue'
import CardPromocion from '../components/CardPromocion.vue'
import PromoDialog from '../components/PromoDialog.vue'


// ----------- Importaciones ----------- //
const compra = useCompraStore();


// ----------- Variables reactivas ----------- //
const abrir = ref(false);


// ----------- Funciones ----------- //
const abrirDialog = () => abrir.value = true;
const cerrarDialog = () => abrir.value = false;


// ----------- Monitoreo ----------- //
const cantPromociones = computed(() => {
    const total =  compra.promociones.reduce( (totalCupones, promo) => totalCupones + promo.length, 0 )
    
    return total > 1? `Hay ${total} cupones` : 'Hay un cupón'
})
</script>