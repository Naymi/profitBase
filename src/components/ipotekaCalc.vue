<template>
  <div class="ipotekaCalc paddingBox_s">
    <div class="ipotekaCalc__body">
      <div class="inputLabel">Первый взнос {{firstInstallment.toLocaleString('ru')}}</div>
      <el-slider
        :format-tooltip="formatFirstInstallment"
        v-model="firstInstallment"
        :min="firstInstallmentMin"
        :max="firstInstallmentMax"
        :step="10e3"
      ></el-slider>
      <div class="inputLabel">Срок кредита {{this.creditTerm}}</div>
      <el-slider v-model="creditTerm" :min="3" :max="30" :step="1"></el-slider>
    </div>
    <div class="resultBlock">
      <table border="1" bordercolor="e7e7e7" cellpading="10" style="width: 100%">
        <tbody>
          <tr>
            <td>Ставка</td>
            <td>7%</td>
          </tr>
          <tr>
            <td>Ежемесячный платёж</td>
            <td>{{resultPlatesh.toLocaleString('ru')}} руб.</td>
          </tr>
          <tr>
            <td>Срок кредита</td>
            <td>{{creditTerm}} лет</td>
          </tr>
          <tr>
            <td>Сумма кредита</td>
            <td>
              {{
              (this.data.price - this.firstInstallment).toLocaleString('ru')}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

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
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    formatFirstInstallment(v) {
      return Number(v).toLocaleString("ru")
    }
  },
  computed: {
    firstInstallmentMax() {
      return this.data.price - 500e3
    },
    firstInstallmentMin() {
      return ~~(this.data.price * 0.15)
    },
    resultPlatesh() {
      return platesh(
        this.data.price - this.firstInstallment,
        this.creditTerm * 12,
        7
      )
    }
  },
  data() {
    return {
      firstInstallment: 0,
      creditTerm: 3
    }
  }
}
</script>

<style lang="scss">
.ipotekaCalc {
  &__title {
    text-align: center;
    text-transform: uppercase;
  }
}
</style>