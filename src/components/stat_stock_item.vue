<template>
<div>
  <ion-col :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <div class="between">
        <b style="margin-right:5px">{{ item.produit.nom }}</b>
        <span> {{ date(item.date) }}</span>
      </div>
      <div class="inline">
        <div class="group">
          <div class="key">Qtt init.: </div>
          <div>{{ item.quantite_initiale }}</div>
        </div>
        <div class="group">
          <div class="key">Qtt act.: </div>
          <div>{{ item.quantite_actuelle }}</div>
        </div>
        <div class="group">
          <div class="key">PT: </div>
          <div>{{ money(item.prix_total) }}</div>
        </div>
      </div>
    </div>
    <div class="inline">
      <ion-col class="inline" v-if="!item.validated_by">
        <ion-button size="small" expand="full" fill="clear"
          class="ion-no-padding" @click="validateStock">
          <ion-icon slot="icon-only" :src="getIcon('checkmarkDone')"/>
        </ion-button>
        <ion-button size="small" expand="full" fill="clear"
          style="margin: 0;" @click="deleteStock">
          <ion-icon slot="icon-only" color="danger" :src="getIcon('close')"/>
        </ion-button>
      </ion-col>
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="perdre" v-else>
        <ion-icon slot="icon-only" :src="getIcon('removeCircleOutline')"/>
      </ion-button>
    </div>
  </ion-col>
  <div class="sep"></div>
</div>
</template>

<script >
import { alertController } from '@ionic/vue'
export default {
  props: {
    item:{type:Object, required:true}
  },
  data(){
    return {
      cart : this.$store.state.cart,
      editable:false
    }
  },
  methods:{
    validateStock(){
      alertController.create({
        header: 'Attention!',
        message: 'êtes-vous sur de vouloir valider ce stock?',
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              if(!this.item.id || this.item.id < 0){
                this.makeToast("Erreur", "ce stock n'est pas encore synchronisée")
                return
              }
              console.log(this.item.user, this.active_user.username)
              if(this.item.user == this.active_user.username){
                this.makeToast("Erreur", "Vous ne puvez pas valider vos propres faits")
                return
              }
              this.item.validated_by = this.active_user.id
              this.saveInListDB("validated_stocks", this.item.id)
              this.saveInDB("stocks", this.item)
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    },
    deleteStock(){
      alertController.create({
        header: 'Attention!',
        message: "êtes-vous sur de vouloir supprimer ce stock?",
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              let elapsed = (new Date() - new Date(this.item.updated_at)) / (1000*60)
              if(elapsed > 120){
                this.makeToast("Erreur", "durrée de suppression écoulée")
                return
              }
              if(this.item.quantite_initiale != this.item.quantite_actuelle){
                this.makeToast("Erreur", "les stocks changés ne peuvent pas être annulé")
                return
              }
              let produit = this.item.produit
              produit.quantite -= this.item.quantite_initiale
              if(this.item.id > 0){
                this.saveInListDB("deleted_stocks", this.item.id)
              } 
              this.deleteFromDB("stocks", this.item.id)
              this.saveInDB("produits", produit)
              this.$emit("deleted")
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    },
    perdre(){
      this.$emit("perte")
    }
  }
};
</script>
<style scoped>
.parent{
  display: flex;
  margin: 0 10px 5px 10px;
}
.item{
  flex-grow: 1;
}
.inline{
  display: flex;
  justify-content: space-between;
}
.group>*{
  display: inline-block;
}
.key{
  font-size: .8em;
  margin-right: 2px;
}
.sep{
  height: 1px;
  background-color: lightgray;
  margin: 0 20px;
}
.between{
  display: flex;
  justify-content: space-between;
}
</style>