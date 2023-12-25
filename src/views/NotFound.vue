<template>
    <v-card color="grey-darken-4" class="w-50 mx-auto mt-16 pa-5" :class="sm ? 'w-75' : ''" height="200">
        <v-card-title class="text-center text-h3 text-orange-darken-1 mt-1">
            404
        </v-card-title>

        <v-card-subtitle class="mt-5 text-center text-h6">
            Página no encontrada
        </v-card-subtitle>

        <v-btn 
            :to="{ name: 'inicio' }"
            text="VOlver al inicio"
            class="mt-5 w-100"
            variant="tonal"
            color="orange-darken-1"
        />
    </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { sm } = useDisplay()
</script>