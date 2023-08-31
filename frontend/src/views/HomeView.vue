<template>
  <div class="wrapper"> 
    <div class="trainList">
      <trainsTable />
    </div>
    <div class="map">
      <mapComponentVue />
    </div>



</div>
</template>

<script setup>
  import mapComponentVue from '../components/mapComponent.vue'
  import trainsTable from '../components/trainsTable.vue'
  import { ref } from 'vue'
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-flow: row;
  text-align: center;
}
.map {
  display: flex;
  height: auto;
  width: 100%;
  padding-left: 5px;
}
.trainList {
  width: 40%;
  padding-right: 5px;
}

</style>