<template>
  <ion-col :data-id='item.id' class="parent ion-no-padding" :class="{'danger':item.quantite==0}">
    <div class="item">
      <div class="name">{{ item.nom }}</div>
      <div class="qtt">{{item.quantite || 0}} {{item.unite}}</div>
      <div class="prix">{{ money(item.prix_vente) }} Fbu</div>
    </div>
    <ion-list class="buttons ion-no-padding">
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="decreaseQtt">-
      </ion-button>
      <div class="input">
        <input v-if="editable" type="number"
          class="item_qtt" v-model="qtt"
          @keydown.stop :max="item.quantite" min="0">
        <div v-else @click="enableEdition">{{qtt}}</div>
      </div>
      <ion-button size="small" expand="full" class="bg-blue"
        style="margin: 0;" @click="increaseQtt">+
      </ion-button>
    </ion-list>
  </ion-col>
</template>

<script >
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
    increaseQtt : function(){
      this.cart.add(this.item);
    },
    decreaseQtt : function(){
      this.cart.decrease(this.item.id);
    },
    enableEdition(){
      if(this.item.quantite!=0) this.editable=true
    }
  },
  computed:{
    qtt:{
      get(){
        return this.cart.getQuantite(this.item.id);
      },
      set(value){
        if(value.length==0) return;
        if(value == 0){
          this.cart.remove(this.item.id)
          return
        }
        this.cart.add(this.item, value);
      }
    }
  }
};
</script>
<style scoped>
.parent{
  border: 1px solid var(--ion-color-primary);
  display: flex;
  flex-direction: column;
  grid-gap: 0;
}
.item{
  padding: 3px;
  border-bottom: 1px solid var(--ion-color-primary);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.name{
  flex-grow: 1;
  word-break: break-all;
}
.qtt, .prix{
  font-size: .8em;
}
.buttons{
  display: flex;
}
.input{
  flex-grow: 1;
}
ion-button[fill="clear"]{
  border-right: 1px solid var(--ion-color-primary);
}
.input *{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>