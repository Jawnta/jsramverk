<template>
  <div id="leaflet-map" style="height: 100%; width: 100%"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';

const socket = ref(null);
let markers = {};
const map = ref(null);
const backend = import.meta.env.VITE_BACKEND_URL;

// Configure Leaflet to use its default icon
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

onBeforeUnmount(() => {
  // Disconnect the socket before unmounting the component
  if (socket.value) {
    socket.value.disconnect();
  }
});

onMounted(() => {
  map.value = L.map('leaflet-map').setView([62.173276, 14.942265], 5); // Set initial coordinates and zoom level
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value); // Add a base tile layer
  socket.value = io(backend);
  socket.value.on("message", (data) => {
    if (markers.hasOwnProperty(data.trainnumber)) {
      let marker = markers[data.trainnumber];
      marker.setLatLng(data.position);
    } else {
      let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map.value);
      markers[data.trainnumber] = marker;
    }
  });
});
</script>

<style></style>
