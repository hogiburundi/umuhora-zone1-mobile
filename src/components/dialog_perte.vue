<template>
  <div class="dialog" v-if="active">
    <div class="body ion-padding">
      <h3>Perte de {{ item.produit.nom }}</h3>
        <ion-item class="ion-no-padding">
          <ion-label position="floating">quantite</ion-label>
          <ion-input type=number placeholder="quantite" :value="qtt"
            @IonChange="qtt=$event.target.value" clearInput/>
        </ion-item>
        <div class="field">
          <label>Motif</label>
          <textarea placeholder="Insiguro itomoye y'ukuntu vyagenze"
            v-model="details"/>
        </div>
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
      qtt:"", details:""
    }
  },
  methods: {
    close(){
      this.$emit("close")
    },
    save(){
      if(!this.qtt || this.qtt > this.item.quantite_actuelle){
        this.makeToast("Erreur", "iyo quantité ntishoboka")
        return;
      }
      if(this.details.length < 32){
        this.makeToast("Erreur", "insiguro ntihagije")
        return;
      }
      let id = this.generateId("pertes")
      let data = {
        id: id,
        quantite: this.qtt,
        date: new Date(),
        details: this.details,
        updated_at: new Date(),
        stock: `${this.item.produit.nom} du ${new Date(this.item.date).toLocaleDateString()}`,
        kiosk: 1,
        user: this.active_user.username,
        validated_by: null,
        prix: this.item.prix_unitaire*this.qtt,
        created:{
          quantite: this.qtt,
          details: this.details,
          stock: this.item.id
        },
        user_id: this.active_user.id,
        kiosk_id: this.getActiveKiosk().id
      }
      this.saveInDB("pertes", data)
      this.item.quantite_actuelle -= this.qtt
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
.field{
  margin-top: 10px;
}
</style>