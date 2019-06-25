<template>
  <div id="app">
    <el-container>
      <el-main>
        <div class="mainContainer">
          <el-row :gutter="40">
            <el-col :span="7">
              <el-select :disabled="process" placeholder="Выберите дом" v-model="currentHouse">
                <el-option v-for="i in houses" :key="i.id" :label="i.title" :value="i.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7">
              <div class="block">
                <span
                  class="demonstration"
                >Введите этаж: {{ currentFloor[0] }} - {{ currentFloor[1] }}</span>
                <el-slider
                  range
                  show-stops
                  show-tooltip
                  :min="1"
                  :max="14"
                  v-model="currentFloor"
                  :step="1"
                />
              </div>
            </el-col>
            <el-col :span="7">
              <span>Введите количество комнат: {{ currentRoomCount[0] }} - {{currentRoomCount[1]}}</span>
              <el-slider range v-model="currentRoomCount" :min="1" :step="1" :max="3"></el-slider>
            </el-col>
          </el-row>
          <div class="paddingBox_l" style="display:flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :total="filteredPropertys.length"
              background
              :current-page.sync="page"
              :page-size="10"
            ></el-pagination>
          </div>
          <property-list :data="currentShowPropertys" :process="process"/>
        </div>
      </el-main>
      <app-aside :data="currentHouseData"/>
    </el-container>
  </div>
</template>

<style>
.mainContainer {
  max-width: 1300px;
  margin: 0 auto;
}
</style>


<script>
import axios from "axios"
import appAside from "@/components/appAside"
import propertyList from "@/components/propertyList"
export default {
  components: {
    propertyList,
    appAside
  },
  mounted() {
    const coors = this.$el.getBoundingClientRect().bottom
    if (coors < window.innerHeight) {
      Promise.all([this.getHouses(), this.getPropertys()])
        .then(([houses, propertys]) => {
          this.houses.push(...houses.data.data)
          houses = Array.isArray(propertys.data.data[1])
            ? [...propertys.data.data]
            : propertys.data.data
          this.propertys.push(...houses)
          this.process = false
        })
        .catch(e => alert("Произошла ошибка при загрузке данных"))
      return
    }
    const that = this
    let handler = event => {
      const coors = that.$el.getBoundingClientRect().bottom
      if (coors < window.innerHeight) {
        this.getHouses()
        this.getPropertys()
          .then(r => {
            this.process = false
            let data = r.data.data
            this.propertys.push(...data)
          })
          .catch(e => {
            console.error(e)
          })
        document.removeEventListener("scroll", handler)
        return
      }
    }
    document.addEventListener("scroll", handler)
  },
  data() {
    return {
      process: false,
      currentRoomCount: [1, 3],
      propertys: [],
      houses: [],
      currentHouse: null,
      currentFloor: [1, 14],
      page: 1
    }
  },
  computed: {
    currentHouseData() {
      return this.houses.find(itm => itm.id === this.currentHouse)
    },
    currentShowPropertys() {
      return this.filteredPropertys.slice((this.page - 1) * 10, this.page * 10)
    },
    filteredPropertys() {
      return this.propertys.filter(itm => {
        if (
          (this.currentHouse && itm.house_id === this.currentHouse) ||
          !this.currentHouse
        ) {
          if (
            this.currentFloor &&
            itm.floor >= this.currentFloor[0] &&
            itm.floor <= this.currentFloor[1]
          ) {
            if (
              this.currentRoomCount &&
              itm.rooms_amount >= this.currentRoomCount[0] &&
              itm.rooms_amount <= this.currentRoomCount[1]
            ) {
              return true
            }
          }
        }
        return false
      })
    }
  },
  watch: {
    currentHouse(newValue) {
      if (this.propertys.find(itm => itm.house_id === newValue)) {
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
      houseId && data.append("houseid", houseId)
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
      return axios({
        method: "POST",
        url: "/api/",
        data
      })
    }
  }
}
</script>