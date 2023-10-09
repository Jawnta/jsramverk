<template>
    <div class="ticket-container" v-if="!isLocked">
        <EditTicketFormVue v-if="ticketId" :ticket="selectedTicket" :reasonCodes="reasonCodes"
            @ticket-updated="fetchTickets" />
        <NewTicketForm v-if="newTicketId && !ticketId" :newTicketId="newTicketId" :reasonCodes="reasonCodes"
            @ticket-created="fetchTickets" />
        <ExistingTickets v-if="tickets" :tickets="filteredTickets" :reasonCodes="reasonCodes" @ticket-updated="fetchTickets"
            :edit-mode="true" />
    </div>
    <div v-if="isLocked">
        <h1>Det är redan någon som redigerar ärenden för detta tåg.</h1>
    </div>
</template>

<script setup>
import { io } from 'socket.io-client'
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute();
import ExistingTickets from './existingTickets.vue';
import NewTicketForm from './newTicketForm.vue';
import EditTicketFormVue from './editTicketForm.vue';
const backend = import.meta.env.VITE_BACKEND_URL
const tickets = ref([])
const reasonCodes = ref([])
const newTicketId = ref(0)
const socket = ref(null)
const isLocked = ref(false)
const trainNumber = route.params.trainNumber
const ticketId = ref("")
const filteredTickets = computed(() => {
    return tickets.value.filter(ticket => ticket.trainnumber === trainNumber);
}); // use computed to create a reactive filtered list
const selectedTicket = computed(() => {
    return tickets.value.filter(ticket => ticket._id === ticketId.value);
}); // use computed to create a reactive filtered list

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

onBeforeUnmount(() => {
    // Disconnect the socket before unmounting the component
    if (socket.value) {
        socket.value.disconnect()
    }
})

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

const openSocket = async () => {

    socket.value = io(`${backend}/tickets`)
    socket.value.emit('ticketLocked', trainNumber);
    socket.value.on('connectionError', () => {
        isLocked.value = true
    });
};


onMounted(async () => {
    await openSocket()
    await fetchTickets()
    await fetchReasonCodes()
    ticketId.value = route.params.ticketId
})
</script>

