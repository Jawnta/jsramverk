<template>
  <div class="wrapper">
    <div class="trainList">
      <trainsTable data-testid="trainsTableComponent" />
    </div>

    <div class="map">
      <mapComponentVue data-testid="mapComponentVue"/>
    </div>

  </div>
</template>

<script setup>
import mapComponentVue from '../components/mapComponent.vue'
import trainsTable from '../components/delayedTrainsTable.vue'

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