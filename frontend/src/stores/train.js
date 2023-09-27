import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTrainStore = defineStore('train', () => {
    // Try to get the train from localStorage or default to null
    const currentTrain = ref(JSON.parse(localStorage.getItem('train')) || null)
    const setTrain = (train) => {
        localStorage.setItem('train', JSON.stringify(train))
        currentTrain.value = train
    }

    const delayedTrains = ref(JSON.parse(localStorage.getItem('delayedTrains')) || [])
    const setDelayedTrains = (delayedTrainsList) => {
        localStorage.setItem('delayedTrains', JSON.stringify(delayedTrainsList))
        delayedTrains.value = delayedTrainsList
    }

    const markers = ref([])
    const setMarkers = (marker) => {
        markers.value.push(marker)
    }

    const getMarker = async (opNumber) => {
        let tempMarker = null
        markers.value.forEach((marker) => {
            const popupContent = marker.getPopup().getContent()

            if (popupContent === opNumber) {
                tempMarker = marker
            }
        })
        return tempMarker
    }

    const updateMarkerPosition = async (opNumber, pos) => {
        const markerToUpdate = await getMarker(opNumber)

        if (markerToUpdate) {
            markerToUpdate.setLatLng(pos) // Set the new position
        } else {
            console.error('Marker not found.')
        }
    }

    const filter = ref(false)

    const setFilter = (bool) => {
        filter.value = bool
    }
    return {
        currentTrain,
        setTrain,
        delayedTrains,
        setDelayedTrains,
        markers,
        setMarkers,
        getMarker,
        updateMarkerPosition,
        filter,
        setFilter
    }
})
