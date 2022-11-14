<template>
  <div class="dialog" v-if="active">
    <ion-col class="body ion-padding">
      <h3>Achat {{ item.nom }}</h3>
      <ion-item class="ion-no-padding">
        <ion-label position="floating">Quantité</ion-label>
        <ion-input type=number placeholder="Quantité"
          @IonChange="qtt=$event.target.value" clearInput/>
      </ion-item>
      <ion-label v-if="!!escompte">
        la somme escomptée est {{ escompte }}
      </ion-label>
      <ion-item class="ion-no-padding">
        <ion-label position="floating">
          Prix d'achat <span>: {{ money(prix_vente) }} FBu</span>
        </ion-label>
        <ion-input type=number placeholder="Prix d'achat"
          @IonChange="prix_vente=$event.target.value" clearInput/>
      </ion-item>
      <ion-item class="ion-no-padding" :class="{'active':du_shown}" button @click="showDu">
        <ion-label for="du">Date d'expiration</ion-label>
        <ion-text slot=end>{{ datetime(du) }}</ion-text>
      </ion-item>
      <ion-datetime @ionChange="choosedDu" presentation="date"
        :min="min_date" :max="max_date"
        :value="du" v-if="du_shown"/>
      <ion-col class="options">
        <ion-button fill=clear color="medium" @click="close">
          ANULLER
        </ion-button>
        <ion-button fill=clear @click="postStock"
          v-if="!!prix_vente && escompte>prix_vente">
          VALIDER
        </ion-button>
      </ion-col>
    </ion-col>
  </div>
</template>

<script >
export default {
  props: {
    active:{type:Boolean, required:true},
    item:{type:Object, required:false}
  },
  data(){
    return {
      qtt:0, prix_vente:0, date:null, escompte:"", du_shown:false,
      du:null
    }
  },
  computed:{
    min_date(){
      return new Date().toISOString()
    },
    max_date(){
      let date = new Date()
      date.setFullYear(date.getFullYear() + 4)
      return date.toISOString()
    }
  },
  watch:{
    qtt(new_val){
      this.escompte = new_val*this.item.prix_vente
    },
    item(new_val){
      if(!new_val){
        this.close()
      }
    }
  },
  methods: {
    close(){
      this.qtt = 0
      this.prix_vente = 0
      this.date = null
      this.escompte = ""
      this.du_shown = false,
      this.du = null
      this.$emit("close")
    },
    choosedDu(event){
      this.du = event.target.value
      this.du_shown = false
    },
    showDu(){
      this.du_shown = !this.du_shown
    },
    postStock(){
      let created = {
        quantite_actuelle:this.qtt,
        date_expiration:!this.du?null:new Date(this.du).toISOString().split('T')[0],
        prix_total:this.prix_vente,
        produit:this.item.id,
        user: this.active_user.id,
        kiosk:this.getActiveKiosk().id,
        date:new Date().toISOString().split('T')[0]
      }
      let id = this.generateId("stocks")
      let new_stock = {
        id: id,
        quantite_initiale: this.qtt,
        quantite_actuelle: this.qtt,
        date: created.date,
        date_expiration: created.date_expiration,
        prix_unitaire: created.prix_total/this.qtt,
        prix_total: created.prix_total,
        updated_at: new Date().toISOString(),
        produit: JSON.parse(JSON.stringify(this.item)),
        user: this.active_user.username,
        created:created,
        user_id: this.active_user.id,
        kiosk_id: this.getActiveKiosk().id
      }
      this.saveInDB("stocks", new_stock)
      this.item.quantite = parseInt(this.item.quantite) + parseInt(this.qtt)
      this.saveInDB("produits", this.item)
      this.close()
    },
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
.active{
  font-weight: 700;
  color: var(--ion-color-primary);
}
</style>