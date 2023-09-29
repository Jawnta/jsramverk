<template>
    <div class="ticket-container">
        <NewTicketForm v-if="newTicketId" :newTicketId="newTicketId" :reasonCodes="reasonCodes" @ticket-created="fetchTickets"/>
        <ExistingTickets v-if="tickets" :tickets="tickets" :reasonCodes="reasonCodes" @ticket-updated="fetchTickets"/>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ExistingTickets from './existingTickets.vue';
import NewTicketForm from './newTicketForm.vue';
const backend = import.meta.env.VITE_BACKEND_URL
const tickets = ref([])
const reasonCodes = ref([])
const newTicketId = ref(0)

const fetchTickets = async () => {
    try {
        const response = await fetch(`${backend}/tickets`);
        const result = await response.json();
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
</script>

