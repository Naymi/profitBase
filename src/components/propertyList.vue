<template>
  <div class="propertysGrid">
    <div class="propertysGrid__loading" v-if="process">Загрузка... Пожалуйста подождите</div>
    <div class="propertysGrid__body">
      <div v-for="p in data" :key="p.id" style="animation: fadeAndScaleIn 0.3s;">
        <property :data="p"/>
      </div>
    </div>
  </div>
</template>

<style>
.propertysGrid__loading {
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  min-height: 200px;

  color: white;
  background-color: rgba(100, 100, 100, 0.5);

  font-size: 20px;
}
.propertysGrid {
  position: relative;

  min-height: 200px;
}
.propertysGrid__body {
  display: grid;
  justify-content: center;

  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 30px;
}
</style>


<script>
import property from "@/components/property"
export default {
  components: {
    property
  },
  props: {
    data: {
      type: Array
    },
    process: Boolean
  }
}
</script>