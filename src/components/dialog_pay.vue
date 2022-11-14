<template>
  <div class="dialog" v-if="active">
    <div class="body ion-padding">
      <h3>Reglage facture #{{ item.id }}</h3>
      <div class="payment">
        <ion-label>Montant à payer:</ion-label>
        <b>{{ money(ideni) }}</b>
        <ion-label>BIF</ion-label>
      </div>
      <ion-item class="ion-no-padding">
        <ion-label position="floating">Payée</ion-label>
        <ion-input type=number placeholder="Payée" :value="ideni"
          @IonChange="payee=$event.target.value" clearInput/>
      </ion-item>
      <ion-label position="floating">
      <div class="payment">
        <ion-label>{{ ingaru>0?"ayo kugarura":"haburako" }}:</ion-label>
        <b>{{ money(Math.abs(ingaru)) }}</b>
        <ion-label>BIF</ion-label>
      </div>
      </ion-label>
      <ion-col class="options">
        <ion-button fill=clear color="medium" @click="close">
          ANULLER
        </ion-button>
        <ion-button fill=clear @click="save">SOUMETTRE</ion-button>
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
      payee:0, ingaru:0
    }
  },
  computed:{
    ideni(){
      return this.item.prix - this.item.payee
    },
  },
  watch:{
    payee(new_val){
      this.ingaru = new_val - this.ideni
    },
    item(new_val){
      if(!!new_val){
        this.payee = new_val.prix - new_val.payee
      }
    }
  },
  methods: {
    close(){
      this.$emit("close")
    },
    save(){
      if(!this.payee || this.payee <= 10){
        this.makeToast("Erreur", "Ayo mahera yarishwe ntashoboka")
        return;
      }
      let id = this.generateId("payments")
      let data = {
        id: id,
        client: this.item.client,
        montant: this.payee,
        date: new Date().toISOString(),
        details: "",
        updated_at: new Date().toISOString(),
        commande: this.item.id,
        user: this.active_user.username,
        created:{
          montant: this.payee,
          details: "",
          commande: this.item.id
        },
        user_id: this.active_user.id,
        kiosk_id: this.getActiveKiosk().id
      }
      this.saveInDB("payments", data)
      this.item.payee = parseInt(this.item.payee) + parseInt(this.payee)
      this.saveInDB("commandes", this.item)
      this.close()
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