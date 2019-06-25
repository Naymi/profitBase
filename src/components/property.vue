<template>
  <el-card shadow="hover">
    <div class="cardHeader" slot="header">
      <div>{{data.projectName}} | {{data.houseName}}</div>
    </div>
    <div class="cardBody">
      <img class="propertyImg" :src="data.preset" alt>
      <table style="font-size:15px" border="1" bordercolor="#e7e7e7" cellpadding="1">
        <thead>
          <tr>
            <td colspan="2" align="center">Параметры квартиры</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(v, name) in property" :key="name">
            <td>{{name}}:</td>
            <td>{{name === 'Цена' ? v.toLocaleString('ru') +' руб' : v}}</td>
          </tr>
        </tbody>
      </table>
      <el-button>Рассчитать ипотеку</el-button>
    </div>
  </el-card>
</template>

<style>
.cardBody {
  display: grid;
  justify-content: center;
  grid-gap: 20px;
}
.propertyImg {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: 220px;
}
</style>


<script>
function platesh(sum, period, rate) {
  let i, koef, result
  // ставка в месяц
  i = rate / 12 / 100
  // коэффициент аннуитета
  koef = (i * Math.pow(1 + i, period)) / (Math.pow(1 + i, period) - 1)
  // итог
  result = sum * koef
  // округлим до целых
  return ~~result
}
export default {
  methods: {
    platesh
  },
  props: ["data"],
  computed: {
    property() {
      let {
        floor: Этаж,
        area: { area_total: Площадь },
        price: { value: Цена },
        rooms_amount: Комнатность
      } = this.data
      return {
        Площадь,
        Цена,
        Комнатность,
        Этаж
      }
    }
  }
}
</script>
