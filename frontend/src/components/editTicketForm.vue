<template>
    <div class="ticket">
        <a @click.prevent="renderMainView">« Tillbaka</a>
        <h1>Redigera ärende #{{ ticket[0]._id }}</h1>
        <form @submit.prevent="updateTicketReason(ticket[0])">
            <label>Orsakskod</label><br />
            <select v-model="selectedReasonCode">
                <option v-for="code in reasonCodes" :key="code.Code" :value="code.Code">
                    {{ code.Code }} - {{ code.Level3Description }}
                </option>
            </select><br /><br />
            <input type="submit" value="Uppdatera nytt ärende" />
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useTrainStore } from '../stores/train.js'
const router = useRouter()
const selectedReasonCode = ref(null);
const trainStore = useTrainStore()
const backend = import.meta.env.VITE_BACKEND_URL
const train = ref({})
const emits = defineEmits(['ticket-created']);
const { ticket, reasonCodes } = defineProps({
    ticket: Object,
    reasonCodes: Array,
})
onMounted(() => {
    train.value = trainStore.currentTrain
})
const renderMainView = () => {
    router.push({
        name: 'home'
    })
}

const updateTicketReason = (currentTicket) => {
    console.log("??")
    console.log(currentTicket)
    if (!selectedReasonCode.value) return;
    const updatedTicket = {
        code: selectedReasonCode.value,
    };
    console.log("inte denna")
    fetch(`${backend}/tickets/${currentTicket._id}`, {
        body: JSON.stringify(updatedTicket),
        headers: {
            'content-type': 'application/json'
        },
        method: 'PUT'
    })
        .then((response) => response.json())
        .then(() => {
            emits('ticket-updated');
        });
}

</script>

<style scoped>
.ticket {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px;
    background-color: #f9f9f9;
    margin-bottom: 20px;
}

.ticket a {
    display: block;
    margin-bottom: 16px;
    color: #008CBA;
    text-decoration: none;
}

.ticket h1 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 24px;
}

.ticket h3 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 18px;
}

.ticket p {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
}

.ticket label {
    font-weight: bold;
    margin-bottom: 4px;
    display: block;
}

.ticket select {
    width: 33%;
    /* or use a fixed width like 200px */
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 16px;
    display: block;
}

.ticket input[type="submit"] {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background-color: #008CBA;
    color: white;
    cursor: pointer;
    font-size: 16px;
}

.ticket input[type="submit"]:hover {
    background-color: #005f5f;
}
</style>