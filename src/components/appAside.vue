<template>
  <el-aside width="400px">
    <div class="wrapper" style="position:fixed; ">
      <div v-if="data">
        <div class="houseTitle">
          <span>{{data.title}}</span>
        </div>
        <div>
          <span>{{data.address.full}}</span>
        </div>
        <img style="max-width: 100%; display:block;" v-if="data" :src="data.image" alt>
      </div>
      <div v-else>
        <div class="shkTitle">ЖК Династия</div>
        <div class="shkImage">
          <img src="//via.placeholder.com/400" alt>
        </div>
        <div class="shkBody">
          Он оч классный.
          <br>Рекомендую
          <br>Однозначно
          <br>Мда
        </div>
      </div>
    </div>
  </el-aside>
</template>

<style>
.houseTitle,
.shkTitle {
  text-align: center;
  text-transform: uppercase;

  font-size: 20px;
}
</style>


<script>
export default {
  props: {
    data: {
      type: Object
    }
  }
}
</script>

<style>
</style>