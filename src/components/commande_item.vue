<template>
  <ion-col :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <b>No. {{item.id}} du {{ datetime(item.date) }}</b>
      <div class="inline">
        <div class="group">
          <div class="key">Montant: </div>
          <div>{{ money(item.prix) }}</div>
        </div>
        <div class="group">
          <div class="key">Payée: </div>
          <div>{{ item.payee }}</div>
        </div>
        <div class="group">
          <div class="key">Reste: </div>
          <div>{{ item.prix - item.payee }}</div>
        </div>
      </div>
      <div class="group">
        <div class="key">Client: </div>
        <div>{{ client }}</div>
      </div>
    </div>
    <div text-center button>
      <ion-button size="small" expand="full" fill="clear" @click="$emit('print')">
        <ion-icon color="dark" slot="icon-only" :src="getIcon('print')"/>
      </ion-button>
      <ion-button size="small" expand="full" fill="clear" @click.stop="deleteCommande">
        <ion-icon color="danger" slot="icon-only" :src="getIcon('close')"/>
      </ion-button>
    </div>
  </ion-col>
</template>

<script >
import { alertController } from '@ionic/vue';

export default {
  props: {
    item:{type:Object, required:true}
  },
  computed:{
    client(){
      if(!!this.item.client){
        if(this.item.id > 0){
          return this.item.client
        } else {
          return `${this.item.client.nom} ${this.item.client.tel}`
        }
      } else {
        return "-"
      }
    }
  },
  methods: {
    deleteCommande(){
      alertController.create({
        header: 'Attention!',
        message: 'Voulez-vous vraiment supprimer cette commande?',
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              let elapsed = (new Date() - new Date(this.item.date)) / (1000*60)
              if(elapsed > 60){
                this.makeToast("Erreur", "Le temps de suppression expirée")
              } else {
                if(this.item.id < 0){
                  let produits = []
                  let produit = null
                  for(let vente of this.item.created.ventes){
                    produit = JSON.parse(localStorage.getItem("produits"))[vente.produit]
                    produit.quantite += vente.quantite
                    produits.push(produit)
                  }
                  this.saveInDB("produits", produits)
                } else {
                  this.saveInListDB("deleted_commandes", this.item.id)
                }
                this.deleteFromDB("commandes", this.item.id)
                this.$emit("deleted")
              }
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    }
  },
};
</script>
<style scoped>
*{
  color: #666;
}
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
ion-button{
  margin: 0;
  padding: 0;
}
</style>