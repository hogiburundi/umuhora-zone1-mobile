<template>
  <ion-col :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <b>No. {{ Math.abs(item.id) }} du {{ datetime(item.date) }}</b>
      <div class="inline">
        <div class="group">
          <span class="key">Montant: </span>
          <span>{{ money(item.prix) }}</span>
        </div>
        <div class="group">
          <div class="key">Payée: </div>
          <div>{{ item.payee }}</div>
        </div>
        <div class="group">
          <span class="key">Reste: </span>
          <span>{{ item.prix - item.payee }}</span>
        </div>
      </div>
      <div class="group">
        <div class="key">Client: </div>
        <div>{{ item.id<0?`${item.client.nom} ${item.client.tel}`:item.client }}</div>
      </div>
    </div>
    <div>
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="pay">
        <ion-icon slot="icon-only" :src="getIcon('checkmarkDone')"/>
      </ion-button>
      <ion-button size="small" expand="full" fill="clear"
        style="margin: 0;" @click="payments">
        <ion-icon slot="icon-only" :src="getIcon('documentText')"/>
      </ion-button>
    </div>
  </ion-col>
</template>

<script >
export default {
  props: {
    item:{type:Object, required:true}
  },
  data(){
    return {
    }
  },
  watch:{
    "item.payee"(new_val){
      this.$emit("changed")
    }
  },
  methods: {
    pay(){
      this.$emit("pay")
    },
    payments(){
      this.$emit("payments")
    },
  },
};
</script>
<style scoped>
.parent{
  display: flex;
  margin: 0 0 5px 10px;
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
</style>