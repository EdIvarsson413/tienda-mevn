<template>
  <v-app>
    <Layout />

    <v-main class="bg-grey-darken-3">
      <v-container>
        <RouterView :key="$route.fullPath"/>
      </v-container>
    </v-main>
    
  </v-app>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Layout from './components/Layout.vue'
</script>