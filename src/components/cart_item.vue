<template>
  <ion-col class="parent ion-no-padding">
    <ion-button size=small @click="decrease" color="medium">
      -
    </ion-button>
    <ion-button size=small @click="increase">+</ion-button>
    <ion-label>
      {{ item.quantite }} {{ item.product.nom }} à {{ money(item.getTotal()) }}
    </ion-label>
    <ion-button size=small fill=clear @click="remove">
      <ion-icon :src="getIcon('close')" color="danger"/>
    </ion-button>
  </ion-col>
</template>

<script>
export default {
  props: {
    item:{type:Object, required:true}
  },
  data(){
    return {
    }
  },
  computed:{
    cart(){
      return this.$store.state.cart
    }
  },
  methods: {
    decrease(){
      this.cart.decrease(this.item.product.id)
    },
    increase(){
      this.cart.increase(this.item.product.id)
    },
    remove(){
      this.cart.remove(this.item.product.id)
    },
  },
};
</script>
<style scoped>
.parent{
  display: flex;
  align-items: center;
}
ion-label{
  flex-grow: 1;
  margin-top: 0;
}
</style>