<template>
  <ion-col :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <div class="inline">
        <div>
          <b style="margin-right: 3px;">3</b> {{ item.stock }}
        </div>
        <div style="white-space: nowrap;"><b>{{ money(item.prix) }} FBU</b></div>
      </div>
      <div class="group">
        <div>{{ item.user }}</div>
        <b>{{ datetime(item.date) }}</b>
      </div>
      <div class="descr">{{ item.details }}</div>
    </div>
    <div v-if="!item.validated_by">
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="validatePerte">
        <ion-icon slot="icon-only" :src="getIcon('checkmarkDone')"/>
      </ion-button>
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="deletePerte">
        <ion-icon slot="icon-only" color="danger" :src="getIcon('close')"/>
      </ion-button>
    </div>
    <div v-else style="min-width: 20px;">
    </div>
  </ion-col>
</template>

<script >
import { alertController } from "@ionic/vue"
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
  methods: {
    enableEdition(){
      if(this.item.quantite!=0) this.editable=true
    },
    validatePerte(){
      alertController.create({
        header: 'Attention!',
        message: "êtes-vous sur de vouloir valider cette perte?",
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              if(!this.item.id || this.item.id < 0){
                this.makeToast("Erreur", "cette perte n'est pas encore synchronisée")
                return
              }
              this.item.validated_by = this.active_user
              this.saveInListDB("validated_pertes", this.item.id)
              this.saveInDB("pertes", this.item)
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    },
    deletePerte(){
      alertController.create({
        header: 'Attention!',
        message: "êtes-vous sur de vouloir supprimer cette perte?",
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              if(this.item.id > 0){
                this.saveInListDB("deleted_pertes", this.item.id)
              } 
              this.deleteFromDB("pertes", this.item.id)
              this.$emit("deleted")
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    },
  },
  computed:{
    qtt:{
      get(){
        return 0
        // return this.cart.getQuantite(this.item.id);
      },
      set(value){
        if(value.length==0) return;
        this.cart.add(this.item, value);
      }
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
.group>div{
  margin-right: 10px;
}
.descr{
  font-size: .9em;
}
</style>