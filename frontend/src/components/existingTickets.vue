<template>
    <div class="old-tickets">
        <h2>Befintliga ärenden</h2>
        <table>
            <thead>
                <tr>
                    <th>Orsakskod</th>
                    <th>Tågnummer</th>
                    <th>Datum</th>
                    <th v-if="editMode">Orsakskod</th>
                    <th v-if="editMode">Uppdatera</th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="ticket in tickets" :key="ticket.id" @click="routeToTrainDetails(ticket)">
                    <td>{{ ticket.code }}</td>
                    <td>{{ ticket.trainnumber }}</td>
                    <td>{{ ticket.traindate }}</td>

                    <td v-if="editMode">
                        <select v-model="ticket.selectedReasonCode" class="reason-code-select">
                            <option v-for="code in reasonCodes" :key="code.Code" :value="code.Code">
                                {{ code.Code }} - {{ code.Level3Description }}
                            </option>
                        </select>
                    </td>
                    <td v-if="editMode">
                        <button @click="updateTicketReason(ticket)" class="update-button">Uppdatera Orsak</button>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios';
const router = useRouter()
const backend = import.meta.env.VITE_BACKEND_URL
const { tickets, reasonCodes, editMode } = defineProps(['tickets', 'reasonCodes', 'editMode']);
const routeToTrainDetails = (ticket) => {
    console.log(ticket)
    router.push({
        name: 'editTicket',
        params: { trainNumber: ticket.trainnumber, ticketId: ticket._id }
    })

}

const emits = defineEmits(['ticket-updated']);

const updateTicketReason = async (ticket) => {
    if (!ticket.selectedReasonCode) return;

    const updatedTicket = {
        code: ticket.selectedReasonCode,
    };

    try {
        const response = await axios.put(`${backend}/tickets/${ticket._id}`, updatedTicket, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        if (response.status === 200) {
            emits('ticket-updated');
        }
    } catch (error) {
        console.error('Update error:', error);
    }
};



</script>

<style scoped>
.old-tickets {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.old-tickets table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
}

.old-tickets th:nth-child(1),
.old-tickets td:nth-child(1) {
    width: 10%;
}

.old-tickets th:nth-child(2),
.old-tickets td:nth-child(2) {
    width: 15%;
}

.old-tickets th:nth-child(3),
.old-tickets td:nth-child(3) {
    width: 15%;
}

.old-tickets th:nth-child(4),
.old-tickets td:nth-child(4) {
    width: 15%;
}

.old-tickets th:nth-child(5),
.old-tickets td:nth-child(5) {
    width: 20%;
}

.old-tickets th:nth-child(6),
.old-tickets td:nth-child(6) {
    width: 25%;
}

.old-tickets h2 {
    margin: 0;
    padding: 16px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
}

.old-tickets table {
    width: 100%;
    border-collapse: collapse;
}

.old-tickets th,
.old-tickets td {
    padding: 8px 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
}

.old-tickets th {
    background-color: #f9f9f9;
    font-weight: bold;
}

.old-tickets .reason-code-select {
    width: 33%;
    padding: 4px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.old-tickets .update-button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background-color: #008CBA;
    color: white;
    cursor: pointer;
}

.old-tickets .update-button:hover {
    background-color: #005f5f;
}
</style>
