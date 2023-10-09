<template>
    <div class="wrapper">
        <div class="trainList">
            <trainsTable data-testid="trainsTableComponent" :delayedTrains="delayedTrains" />
        </div>

        <div class="map" v-if="isloaded">
            <mapComponentVue data-testid="mapComponentVue" />
        </div>
    </div>
    <form @submit.prevent>
        <input type="text" v-model="email" placeholder="Email">
        <input type="text" v-model="pw" placeholder="Password">
        <button @click="registerUser()">Register</button>
    </form>
</template>

<script setup>
import mapComponentVue from '../components/mapComponent.vue'
import trainsTable from '../components/delayedTrainsTable.vue'
import { useTrainStore } from '../stores/train.js'
import { ref, onMounted } from 'vue';
const trainStore = useTrainStore()
const backend = import.meta.env.VITE_BACKEND_URL
let email;
let pw;
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
// In your Vue component or function
import axios from 'axios';

async function registerUser() {
    const url = 'http://109.228.158.227:8888/auth/login';
    const data = {
        email: 'jawntalol@gmail.com',
        password: 'asd123'
    };

    try {
        const response = await axios.post(url, data, {
            withCredentials: true,  // Include credentials (cookies) in the request
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        console.log(result);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Application error:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
    }
}




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
