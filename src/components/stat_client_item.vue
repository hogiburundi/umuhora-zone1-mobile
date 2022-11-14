<template>
  <div :data-id='item.id' :class="{'parent':true,'danger':item.quantite==0}">
    <div class="item">
      <b>{{ item.client || "autres" }}</b>
      <div class="inline">
        <div class="group">
          <div class="key">fois: </div>
          <div>{{ item.fois }}</div>
        </div>
        <div class="group">
          <div class="key">Montant: </div>
          <div>{{ money(item.prix) }} FBu</div>
        </div>
      </div>
      <div class="inline">
        <div class="group">
          <div class="key">du: </div>
          <div>{{ datetime(item.du) }}</div>
        </div>
        <div class="group">
          <div class="key">au: </div>
          <div>{{ datetime(item.du) }}</div>
        </div>
      </div>
    </div>
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
  methods: {
    enableEdition(){
      if(this.item.quantite!=0) this.editable=true
    }
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
  margin: 0 10px 15px 10px;
}
.item{
  flex-grow: 1;
}
.inline{
  display: flex;
  justify-content: flex-start;
}
.group>*{
  display: inline-block;
}
.group{
  margin-right: 10px;
}
.key{
  margin-right: 2px;
  font-size: .8em;
}
</style>