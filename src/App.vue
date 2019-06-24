<template>
  <div id="app">
    <el-row :gutter="40">
      <el-col :span="7">
        <el-select :disabled="process" placeholder="Выберите дом" v-model="currentHouse">
          <el-option v-for="i in houses" :key="i.id" :label="i.title" :value="i.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="7">
        <div class="block">
          <span class="demonstration">Введите этаж: {{currentFloor}}</span>
          <el-slider show-stops show-tooltip :min="1" :max="14" v-model="currentFloor" :step="1"/>
        </div>
      </el-col>
      <el-col :span="7">
        <span>Введите количество комнат: {{ currentRoomCount }}</span>
        <el-slider show-stops show-tooltip v-model="currentRoomCount" :min="1" :step="1" :max="3"></el-slider>
      </el-col>
    </el-row>
    <el-container></el-container>
    <el-pagination layout="prev, pager, next" :total="propertys.length" background :page-size="50"></el-pagination>
  </div>
</template>

<script>
import axios from "axios"
export default {
  mounted() {
    const coors = this.$el.getBoundingClientRect().bottom
    if (coors < window.innerHeight) {
      this.getHouses()
      return
    }
    const that = this
    let handler = event => {
      const coors = that.$el.getBoundingClientRect().bottom
      if (coors < window.innerHeight) {
        that.getHouses()
        document.removeEventListener("scroll", handler)
        return
      }
    }
    document.addEventListener("scroll", handler)
  },
  data() {
    return {
      process: false,
      currentRoomCount: 1,
      propertys: [],
      houses: [],
      currentHouse: null,
      currentFloor: null
    }
  },
  computed: {
    filteredPropertys() {
      return this.propertys.filter
    }
  },
  watch: {
    currentHouse(newValue) {
      if (this.propertys.find(itm => itm.houseId === newValue)) {
        return
      }
      this.process = true
      this.getPropertys(newValue)
        .then(r => {
          this.process = false
          let data = r.data.data
          this.propertys.push(...data)
        })
        .catch(e => {
          console.error(e)
        })
    }
  },
  methods: {
    getPropertys(houseId) {
      let data = new FormData()
      data.append("target", "/property")
      data.append("houseid", houseId)
      return axios({
        method: "POST",
        url: "/api/",
        data
      })
    },
    getHouses() {
      let data = new FormData()
      data.append("target", "house")
      this.process = true
      axios({
        method: "POST",
        url: "/api/",
        data
      })
        .then(d => {
          this.process = false
          this.houses = d.data.data
        })
        .catch(e => console.error("e :", e))
    }
  }
}
</script>