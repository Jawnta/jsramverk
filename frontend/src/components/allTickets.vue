<template>
    <div class="ticket-container">
        <a @click.prevent="renderMainView">« Tillbaka</a>
        <ExistingTickets v-if="tickets" :tickets="tickets" :reasonCodes="reasonCodes" @ticket-updated="fetchTickets" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ExistingTickets from './existingTickets.vue';
const backend = import.meta.env.VITE_BACKEND_URL
const tickets = ref([])
const reasonCodes = ref([])
const newTicketId = ref(0)
const router = useRouter()
import axios from 'axios';

const fetchTickets = async () => {
    try {
        const response = await axios.get(`${backend}/tickets`, {
            withCredentials: true,
        });
        const result = response.data;
        tickets.value = result.data;
        const lastId = tickets.value[1] ? tickets.value[1]._id : 0;
        newTicketId.value = lastId + 1;
    } catch (error) {
        console.error('Error fetching reason codes:', error);
    }
};


const fetchReasonCodes = async () => {
    try {
        const response = await fetch(`${backend}/codes`);
        const result = await response.json();
        reasonCodes.value = result.data;
    }
    catch (error) {
        console.error('Error fetching reason codes:', error);
    }

};


onMounted(async () => {
    await fetchTickets()
    await fetchReasonCodes()
})

const renderMainView = () => {
    router.push({
        name: 'home'
    })
}
</script>

