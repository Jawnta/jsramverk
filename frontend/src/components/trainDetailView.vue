<template>
    <div class="ticket-container">
        <div class="ticket">
            <a @click.prevent="renderMainView">« Tillbaka</a>
            <h1>Nytt ärende #{{ newTicketId }}</h1>
            <h3 v-if="locationString">{{ locationString }}</h3>
            <p><strong>Försenad:</strong> {{ outputDelay() }}</p>
            <form @submit.prevent="submitNewTicket">
                <label>Orsakskod</label><br>
                <select v-model="selectedReasonCode">
                    <option v-for="code in reasonCodes" :key="code.Code" :value="code.Code">{{ code.Code }} - {{
                        code.Level3Description }}</option>
                </select><br><br>
                <input type="submit" value="Skapa nytt ärende" />
            </form>
        </div>
        <br>
        <div class="old-tickets">
            <h2>Befintliga ärenden</h2>
            <div v-for="ticket in tickets" :key="ticket.id">{{ ticket.id }} - {{ ticket.code }} - {{ ticket.trainnumber }} -
                {{ ticket.traindate }}</div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { defineProps } from 'vue';
import { useTrainStore } from '../stores/train.js';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const backend = import.meta.env.VITE_BACKEND_URL;
console.log(backend);


const tickets = ref([]);
const reasonCodes = ref([]);
const selectedReasonCode = ref(null);
const newTicketId = ref(0);
const train = ref({})
const locationString = computed(() => {
    if (train.value.FromLocation) {
        return `Tåg från ${train.value.FromLocation[0].LocationName} till ${train.value.ToLocation[0].LocationName}. Just nu i ${train.value.LocationSignature}.`;
    }
    return "";
});

const renderMainView = () => {
    router.push({
        name: 'home',
    });
};

const outputDelay = () => {
    const advertised = new Date(train.value.AdvertisedTimeAtLocation);
    const estimated = new Date(train.value.EstimatedTimeAtLocation);
    const diffInMinutes = Math.floor(Math.abs(estimated - advertised) / (1000 * 60));

    return `${diffInMinutes} minuter`
};

const submitNewTicket = () => {
    const newTicket = {
        code: selectedReasonCode.value,
        trainnumber: train.value.OperationalTrainNumber,
        traindate: train.value.EstimatedTimeAtLocation.substring(0, 10),
    };

    fetch(`${backend}/tickets`, {
        body: JSON.stringify(newTicket),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST'
    })
        .then(response => response.json())
        .then(() => {
            fetchTickets();
        });
};

const fetchTickets = () => {
    fetch(`${backend}/tickets`)
        .then(response => response.json())
        .then(result => {
            tickets.value = result.data;
            const lastId = tickets.value[1] ? tickets.value[1]._id : 0;
            newTicketId.value = lastId + 1;
        });
};

const fetchReasonCodes = () => {
    fetch(`${backend}/codes`)
        .then(response => response.json())
        .then(result => {
            reasonCodes.value = result.data;
        });
};

onMounted(() => {
    const trainStore = useTrainStore();
    train.value = trainStore.currentTrain;
    fetchTickets();
    fetchReasonCodes();
});
</script>