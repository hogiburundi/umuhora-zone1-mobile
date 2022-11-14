<template>
  <div class="dialog" v-if="active">
    <div class="body ion-padding">
      <h3>Hitamwo</h3>
      <div class="item" v-for="kiosk in active_user.kiosks">
        <input type="radio" v-model="active_kiosk" :value="kiosk" :id="kiosk.id"/>
        <label :for="kiosk.id">{{ kiosk.nom }}</label>
      </div>
      <ion-col class="options">
        <ion-button fill=clear @click="chooseKiosk">
          VALIDER
        </ion-button>
      </ion-col>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    active:{type:Boolean, required:true}
  },
  data(){
    return {
      active_kiosk:null
    }
  },
  methods: {
    close(){
      this.$emit("close")
    },
    chooseKiosk(){
      this.$store.state.active_kiosk = this.active_kiosk
    }
  }
};
</script>
<style scoped>
.options{
  padding-bottom: 0;
}
input[type=radio]{
  margin-right: 5px;
}
.item{
  margin: 20px 0 0 0;
}
label{
  font-size: 1.2em;
  width: 100%;
}
.dialog{
  z-index: 1001;
}
</style>