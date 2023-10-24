<template>
    <div id="leaflet-map" style="height: 100%; width: 100%"></div>
    <div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineEmits } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { io } from 'socket.io-client'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useTrainStore } from '../stores/train.js'
const trainStore = useTrainStore()
const socket = ref(null)
const markers = ref(null)
let map;
const backend = import.meta.env.VITE_BACKEND_URL
const delayedTrainNumbers = ref( trainStore.delayedTrains || [])
const trainsPositions = ref([])
const uniqueTrains = ref([]);
const emit = defineEmits(['markerClicked'])
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl
})

onBeforeUnmount(() => {
    // Disconnect the socket before unmounting the component
    if (socket.value) {
        socket.value.disconnect()
    }
})

onMounted(async () => {
    await buildMap();
    await makePostRequest();
    await initializeMarkers();
    socket.value = io(backend)
    socket.value.on('message', (data) => {

        markers.value.eachLayer(async (marker) => {
            const popupContent = marker.getPopup().getContent();

            if (popupContent === data.trainnumber) {
                marker.setLatLng(data.position);
                trainStore.updateMarkerPosition(data.trainnumber, data.position)
            }
        });
    });

})

const buildMap = async () => {

    map = L.map('leaflet-map', {
        zoomAnimation: false
    }).setView([62.173276, 14.942265], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map) // Add a base tile layer
    markers.value = new L.LayerGroup().addTo(map);

}
const removeDuplicates = (trains) => {
    const tempTrains = {};
    trains.forEach(train => {
        const trainNumber = train.Train.OperationalTrainNumber;
        if (!tempTrains[trainNumber] || new Date(tempTrains[trainNumber].ModifiedTime) < new Date(train.ModifiedTime)) {
            tempTrains[trainNumber] = train;
        }
    });
    return Object.values(tempTrains);
};

const initializeMarkers = async () => {
    trainStore.setFilter(false)
    uniqueTrains.value = removeDuplicates(trainsPositions.value);
    uniqueTrains.value.forEach(element => {
        const matches = element.Position.WGS84.match(/POINT \(([^ ]+) ([^)]+)\)/);
        const longitude = parseFloat(matches[1]);
        const latitude = parseFloat(matches[2]);
        const marker = L.marker([latitude, longitude]).addTo(map)
            .on('click', () => {
                trainStore.setFilter(true)
                trainStore.setTrain(element.Train)
                emit('markerClicked')
            })
            .bindPopup(element.Train.OperationalTrainNumber);
        trainStore.setMarkers(marker)
        markers.value.addLayer(marker)
    })
};

const getSelectedTrainMarker = (opNumber) => {
    let targetMarker = null;

    trainStore.markers.forEach((marker) => {
        const popupContent = marker.getPopup().getContent();

        if (popupContent === opNumber) {
            targetMarker = marker;
            return; // This will not exit the eachLayer loop but it's okay for now
        }
    });
    return targetMarker;
};

const filterSelectedTrain = async () => {

    // Get the latitude and longitude for the current train
    const currentMarker = getSelectedTrainMarker(trainStore.currentTrain.OperationalTrainNumber);

    // Clear all markers from the markers layer
    markers.value.clearLayers();

    // Add the specific marker for the current train
    if (currentMarker) {
        markers.value.addLayer(currentMarker);
    } else {
        alert("Nuvarande position på tåget kunde inte hittas.")
        initializeMarkers();

    }

};


const makePostRequest = async () => {
    try {
        const requestBody = {
            trainNumbers: delayedTrainNumbers.value,
        };

        const response = await fetch(`${backend}/delayed/position`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        trainsPositions.value = data.data.TrainPosition
    } catch (error) {
        console.error('Error:', error);
    }
}
watch(() => trainStore.currentTrain, (newTrain) => {

    if (newTrain && trainStore.filter) {
        filterSelectedTrain();
    }
}, { deep: true });

watch(() => trainStore.filter, (newFilter) => {
    if (!newFilter) {
        if (markers.value) {
            markers.value.clearLayers();
        }

        initializeMarkers();
    }
}, { deep: true });


</script>

