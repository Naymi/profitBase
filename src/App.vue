<template>
  <div id="app">
    <el-container>
      <el-main>
        <el-button @click="refresh">Refresh</el-button>
        <div class="mainContainer">
          <el-row :gutter="40">
            <el-col :span="7">
              <el-select
                multiple
                collapse-tags
                :disabled="process"
                placeholder="Выберите дом"
                v-model="currentHouse"
              >
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
          <el-row>
            <el-col :span="4">Сортировать по:</el-col>
            <el-col :span="4" v-for="sortParam in sortParams" :key="sortParam.value">
              <span
                class="sortToogler"
                @click="sort.desc = sort.type === sortParam.value ? !sort.desc:true; sort.type = sortParam.value;"
              >
                {{sortParam.label}}
                <span
                  v-if="sort.type === sortParam.value"
                  :class="`el-icon-arrow-${sort.desc ? 'up' : 'down'}`"
                ></span>
              </span>
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
.sortToogler {
  cursor: pointer;
  user-select: none;
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
      this.refresh()
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
      sort: {
        type: "",
        desc: false
      },
      process: false,
      currentRoomCount: [1, 3],
      propertys: [],
      houses: [],
      currentHouse: [],
      currentFloor: [1, 14],
      page: 1,
      sortParams: [
        {
          label: "Площадь",
          value: "area"
        },
        {
          label: "Цена",
          value: "price"
        },
        {
          label: "Комнатность",
          value: "rooms_amount"
        }
      ]
    }
  },
  computed: {
    currentHouseData() {
      return this.houses.find(itm => itm.id === this.currentHouse)
    },
    currentShowPropertys() {
      function paramSort(a, b, desc) {
        if (!desc) {
          return a > b ? -1 : a < b ? 1 : 0
        } else {
          return a < b ? -1 : a > b ? 1 : 0
        }
      }
      return [...this.filteredPropertys]
        .sort((a, b) => {
          return paramSort(a[this.sort.type], b[this.sort.type], this.sort.desc)
        })
        .slice((this.page - 1) * 10, this.page * 10)
    },
    filteredPropertys() {
      return this.propertys
        .map(
          ({
            floor,
            price: { value: price },
            area: { area_total: area },
            rooms_amount,
            houseName,
            projectName,
            preset
          }) => {
            return {
              price,
              area,
              rooms_amount,
              floor,
              houseName,
              projectName,
              preset
            }
          }
        )
        .filter(itm => {
          if (
            (this.currentHouse.length &&
              this.currentHouse.find(house => house === itm.house_id)) ||
            !this.currentHouse.length
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
  methods: {
    refresh() {
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
    },
    getPropertys(houseId) {
      let data = new FormData()
      data.append("target", "/property")
      houseId && data.append("houseid", houseId)
      return axios({
        method: "POST",
        url: "/api/",
        data,
        maxRedirects: 5,
        mode: "no-cors"
        // baseURL: "http://xn---33-6cdtkqbn7a8bm4o.xn--p1ai/"
      })
    },
    getHouses() {
      let data = new FormData()
      data.append("target", "house")
      this.process = true
      return axios({
        method: "POST",
        url: "/api/",
        data,
        maxRedirects: 5,
        mode: "no-cors"
        // baseURL: "http://xn---33-6cdtkqbn7a8bm4o.xn--p1ai/"
      })
    }
  }
}
</script>