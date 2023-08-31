<template>
    <div>
      <div class="delayed">
        <h1>Försenade tåg</h1>
        <table>
          <thead>
            <tr>
              <th>Tågnummer</th>
              <th>Nuvarande station</th>
              <th>Försening</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in delayedTrains" :key="item.OperationalTrainNumber" @click="openTicketView(item)">
              <td class="train-number">{{ item.OperationalTrainNumber }}</td>
              <td class="current-station">
                <div>{{ item.LocationSignature }}</div>
                <div>
                  {{ item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "" }}
                  {{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}
                </div>
              </td>
              <td class="delay">{{ computeDelay(item) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const delayedTrains = ref([]);
  onMounted(() => {
    fetchDelayedTrains();
  });
  
  async function fetchDelayedTrains() {
    const response = await fetch("http://localhost:1337/delayed");
    const result = await response.json();
    delayedTrains.value = result.data;
  }
  
  function computeDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);
    return Math.floor(diff / (1000 * 60)) + " minuter";
  }
  
  function openTicketView(train) {
    // Handle opening the ticket view, either with Vue Router or with a modal
  }
  </script>
  
  <style scoped>
  /* Styles */

  
  .delayed {
    max-height: 95vh;
      overflow: scroll;
      background-color: white;
  }
  
  .delayed-trains {
      display: flex;
      flex-direction: column;
  }
  
  .delayed-trains>div {
      display: flex;
      flex-direction: row;
      border-top: 1px solid #ccc;
      padding: 0.2rem 0.8rem;
      align-items: center;
      cursor: pointer;
  }
  
  .delayed-trains>div:nth-of-type(2n) {
      background-color: #eee;
  }
  
  .train-number {
      font-size: 2rem;
      font-weight: bold;
      width: 30%;
  }
  
  .current-station {
      width: 30%;
  }
  
  .ticket-container {
      padding: 2rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;

  }

  th, td {
    /* padding: 8px 12px; */
    border-bottom: 1px solid #ccc;
  }

  th {
    background-color: #f5f5f5;
  }

  /* Alternating row colors */
  tr:nth-child(even) {
    background-color: #e9e9e9;
  }


  tr:hover {
    background-color: #ddd;
    cursor: pointer;
  }
  </style>


