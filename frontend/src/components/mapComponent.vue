<template>
    <div id="leaflet-map" style="height: 100%; width: 100%"></div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import L from 'leaflet';
  import "leaflet/dist/leaflet.css";
  
  export default {
    name: 'LeafletMap',
    setup() {
      const map = ref(null);
  
      onMounted(() => {
        map.value = L.map('leaflet-map').setView([62.173276, 14.942265], 5); // Set initial coordinates and zoom level
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value); // Add a base tile layer
      });
  
      return {
        map
      };
    }
  };
  </script>

<style>

</style>