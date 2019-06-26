<template>
  <el-card shadow="hover">
    <div class="cardHeader" slot="header">
      <div>{{data.projectName}} | {{data.houseName}}</div>
    </div>
    <div class="cardBody">
      <div class="propertyImg" @click="imgOpen = true">
        <div class="propertyImg__hoverScreen">+</div>
        <img class="propertyImg__content" :src="data.preset" alt>
      </div>
      <el-dialog :visible.sync="imgOpen" width="60%">
        <div class="propertyModal">
          <div class="propertyModalGrid">
            <div class="propertyModal__imgContainer">
              <img class="propertyModal__img" :src="data.preset" alt>
            </div>
            <div style="font-size:20px;" class="propertyModalGrid__leftSection">
              <table
                style="font-size:20px; width: 100%"
                border="1"
                bordercolor="#e7e7e7"
                cellpadding="1"
              >
                <thead>
                  <tr>
                    <td colspan="2" align="center">Параметры квартиры</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Цена</td>
                    <td>{{property.Цена.toLocaleString('ru')}} рублей</td>
                  </tr>
                  <tr>
                    <td>Площадь</td>
                    <td>
                      {{property.Площадь}}
                      м<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td>Комнатность</td>
                    <td>{{property.Комнатность}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="paymentPicker">
                <label class="paymentPicker__itm">
                  <input
                    class="paymentPicker__input"
                    type="radio"
                    name="payment"
                    v-model="payment"
                    value="Ипотека"
                  >
                  <span class="paymentPicker__caption">Ипотека</span>
                </label>
                <label class="paymentPicker__itm">
                  <input
                    class="paymentPicker__input"
                    type="radio"
                    name="payment"
                    v-model="payment"
                    value="Нал"
                  >
                  <span class="paymentPicker__caption">Наличные</span>
                </label>
              </div>
              <transition name="el-zoom-in-top">
                <ipoteka-calc v-show="payment==='Ипотека'" :data="{price: this.property.Цена}"></ipoteka-calc>
              </transition>
              <div class="paddingBox_s">
                <div class="personData__title">Заполните поля</div>
              </div>
              <person-data/>

              <div style="display: flex; justify-content: center" class="paddingBox_s">
                <el-button>Оставить заявку</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
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
    </div>
  </el-card>
</template>

<style lang='scss'>
.paymentPicker {
  display: grid;

  cursor: pointer;

  grid-template-columns: 1fr 1fr;
  &__input {
    position: absolute;

    width: 1px;
    height: 1px;

    opacity: 0;
    &:checked ~ .paymentPicker__caption {
      color: #409eff;
      border-color: #409eff;
    }
  }
  &__caption {
    display: block;

    width: 100%;
    height: 100%;

    text-align: center;

    border: 1px solid #e7e7e7;
    .paymentPicker__itm:first-child & {
      border-top-left-radius: 10px;
    }
    .paymentPicker__itm:last-child & {
      border-top-right-radius: 10px;
    }
  }
}
.cardBody {
  display: grid;
  justify-content: center;

  grid-gap: 20px;
}
.propertyModal__imgContainer {
  width: 400px;
}
.propertyModal__img {
  max-width: 100%;
}
.propertyModalGrid {
  display: grid;

  grid-template-columns: 400px 1fr;
  grid-gap: 20px;
}
.propertyImg {
  position: relative;
  &:hover &__hoverScreen {
    opacity: 1;
  }
  &__hoverScreen {
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 100%;

    cursor: pointer;
    transition: 0.5s all;

    opacity: 0;
    color: white;
    background-color: rgba(100, 100, 100, 0.5);

    font-size: 40px;
  }
  &__content {
    display: block;

    max-width: 100%;
    height: 220px;
    margin: 0 auto;
  }
  &_full {
    display: block;

    max-width: 100%;
    margin: 0 auto;
  }
}
</style>


<script>
import ipotekaCalc from "@/components/ipotekaCalc"
import personData from "@/components/personData"
export default {
  components: {
    personData,
    ipotekaCalc
  },
  props: ["data"],
  data() {
    return {
      payment: "Ипотека",
      imgOpen: false
    }
  },
  computed: {
    property() {
      let {
        floor: Этаж,
        area: Площадь,
        price: Цена,
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
