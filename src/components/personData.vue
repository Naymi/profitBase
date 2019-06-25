<template>
  <form>
    <form class="personData__body">
      <form action>
        <div class="paddingBox_s">
          <el-input name="name" v-model="name" placeholder="Введите имя"></el-input>
        </div>
        <div class="paddingBox_s">
          <el-input name="phone" v-model="phone" placeholder="Введите номер телефона"></el-input>
        </div>
      </form>
    </form>
  </form>
</template>

<script>
export default {}
</script>

<style lang='scss'>
.personData__title {
  text-align: center;
  text-transform: uppercase;
}
</style>