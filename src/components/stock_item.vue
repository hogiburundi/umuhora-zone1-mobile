<template>
  <div :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <div>{{ item.nom }}</div>
      <div class="inline">
        <div class="info">
          <div>Qtt.:</div>
          {{item.quantite || 0}} {{item.unite}}
        </div>
        <div class="info">
          <div>PU:</div>
          {{ money(item.prix_vente) }} Fbu
        </div>
      </div>
    </div>
    <ion-list class="inline">
      <ion-button size="small" fill="clear" class="ion-no-padding" @click="editStock">
        <ion-icon slot="icon-only" :src="getIcon('pencil')"/>
      </ion-button>
      <ion-button size="small" fill="clear" class="ion-no-padding" @click="increaseQtt">
        <ion-icon slot="icon-only" :src="getIcon('bagAdd')"/>
      </ion-button>
    </ion-list>
  </div>
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
  methods:{
    editStock(){
      this.$emit("edit")
    },
    increaseQtt(){
      this.$emit("buy")
    }
  }
};
</script>
<style scoped>
.parent{
  display: flex;
  padding: 10px 0 0 10px;
  width: 100%;
}
.item{
  flex-grow: 1;
}
.info{
  font-size: .8em;
  margin-right: 5px;
  display: flex;
  flex-grow: 1;
}
.info>*{
  margin-right: 5px;
  display: flex;
}
.inline{
  display: flex;
}
ion-button{
  margin: 0
}
</style>