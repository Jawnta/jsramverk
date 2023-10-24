<template>
    <button @click="logOut()">Logga ut</button>
    <div class="wrapper">

        <div class="trainList">
            <trainsTable data-testid="trainsTableComponent" :delayedTrains="delayedTrains" />
        </div>

        <div class="map" v-if="isloaded">
            <mapComponentVue data-testid="mapComponentVue" />
        </div>
    </div>
</template>

<script setup>
import mapComponentVue from '../components/mapComponent.vue'
import trainsTable from '../components/delayedTrainsTable.vue'
import { useTrainStore } from '../stores/train.js'
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter()
const trainStore = useTrainStore()
const backend = import.meta.env.VITE_BACKEND_URL
const delayedTrains = ref([])
const isloaded = ref(false)
onMounted(async () => {
    await fetchDelayedTrains()
    setDelayedTrains()
    isloaded.value = true
})
const fetchDelayedTrains = async () => {
    const response = await fetch(`${backend}/delayed`)
    const result = await response.json()
    delayedTrains.value = result.data
}

const logOut = async () => {
    await axios.get(`${backend}/auth/logout`, { withCredentials: true });
    localStorage.clear("isAuthenticated")
    router.push({ name: "login" })

};



const setDelayedTrains = () => {

    const operationalTrainNumbers = delayedTrains.value.map(train => train.OperationalTrainNumber);
    trainStore.setDelayedTrains(operationalTrainNumbers)
};
</script>

<style scoped>
.wrapper {
    display: flex;
    flex-flow: row;
    text-align: left;
    height: 95vh;
    width: 100%;
    justify-content: space-between;
}

.map {
    margin: 5px;
    height: 98vh;
    width: 68%;
}

.trainList {
    width: 30%;
}
</style>
