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
              <span>Введите количество комнат: {{ currentRoomCount }}</span>
              <el-slider v-model="currentRoomCount" :min="1" :step="1" :max="3"></el-slider>
            </el-col>
          </el-row>
          <div style="display:flex; justify-content: center">
            <el-pagination
              layout="prev, pager, next"
              :total="filteredPropertys.length"
              background
              :current-page.sync="page"
              :page-size="10"
            ></el-pagination>
          </div>
          <div class="propertysGrid">
            <div v-for="p in currentShowPropertys" :key="p.id" class="my-animate">
              <property :data="p"/>
            </div>
          </div>
        </div>
      </el-main>
      <el-aside width="400px">
        <div v-if="currentHouse">
          <div class="houseTitle">
            <span>{{currentHouseData.title}}</span>
          </div>
          <div>
            <span>{{currentHouseData.address.full}}</span>
          </div>
          <img
            style="max-width: 100%; display:block;"
            v-if="currentHouse"
            :src="currentHouseData.image"
            alt
          >
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<style>
.mainContainer {
  max-width: 1300px;
  margin: 0 auto;
}
.houseTitle {
  text-transform: uppercase;
  font-size: 20px;
  text-align: center;
}
.propertysGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 30px;
  justify-content: space-between;
}
@keyframes my {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.my-animate {
  animation: my 0.3s;
}
</style>


<script>
import axios from "axios"
import property from "@/components/property"
export default {
  components: {
    property
  },
  mounted() {
    const coors = this.$el.getBoundingClientRect().bottom
    if (coors < window.innerHeight) {
      this.getHouses()
      this.getPropertys()
        .then(r => {
          this.process = false
          let data = r.data.data
          if (Array.isArray(data[1])) {
            data = [...data]
          }
          this.propertys.push(...data)
        })
        .catch(e => {
          console.error(e)
        })
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
      currentRoomCount: 1,
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
        if (this.currentHouse && itm.house_id === this.currentHouse) {
          if (
            this.currentFloor &&
            itm.floor >= this.currentFloor[0] &&
            itm.floor <= this.currentFloor[1]
          ) {
            if (
              this.currentRoomCount &&
              this.currentRoomCount === itm.rooms_amount
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