<template>
  <div class="dialog" v-if="active">
    <div class="body ion-padding">
      <h3>Versement</h3>
        <ion-item class="ion-no-padding">
          <ion-label position="floating">Montant dettes</ion-label>
          <ion-input type=number placeholder="dettes" :value="dettes"
            @IonChange="dettes=$event.target.value" clearInput/>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-label position="floating">Total des ventes</ion-label>
          <ion-input type=number placeholder="vente" :value="vente"
            @IonChange="vente=$event.target.value" clearInput/>
        </ion-item>
      <ion-col class="options">
        <ion-button fill=clear color="medium" @click="close">
          ANULLER
        </ion-button>
        <ion-button fill=clear @click="save">VALIDER</ion-button>
      </ion-col>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    active:{type:Boolean, required:true},
    item:{type:Object, required:false},
  },
  data(){
    return {
      vente : "", dettes:""
    }
  },
  watch:{
    item(new_val){
      this.vente = new_val.vente,
      this.dettes = new_val.dettes
    }
  },
  methods: {
    close(){
      this.$emit("close")
    },
    save(){
      let kiosk_id = this.getActiveKiosk().id
      let data = {
        vente: this.vente,
        dettes: this.dettes,
        kiosk: kiosk_id
      }
      let link = this.url+`/versement/`;
      axios.post(link, data, this.headers)
      .then((response) => {
        this.$store.state.versements.unshift(response.data)
        this.en_cours = false
      }).catch((error) => {
        if(!!error.response){
          this.makeToast("Erreur", error.response.data.status)
        }
        this.en_cours = false
      }).finally(() => {
        this.close()
      });

    }
  }
};
</script>
<style scoped>
.options{
  padding-bottom: 0;
}
.ion-padding{
  padding-bottom: 5px;
}
</style>