<template>
  <ion-page>
    <ion-content id="stock_parent">
      <ion-col id="stock">
        <ion-button style="margin: 0 10px 5px 10px;" size=block @click="createProduit">
          Ajouter un produit
        </ion-button>
        <StockItem v-for="item in chunk" :item="item"
          @edit="editStock(item)" @buy="makeAchat(item)" :key="item.id"/>
      </ion-col>
    </ion-content>
  </ion-page>
</template>
<script>
import StockItem from "../components/stock_item"

export default {
  components:{ StockItem },
  data(){
    return  {
      chunk:[], last:21, load_more:false
    }
  },
  watch:{
    "$store.state.home_keyword"(new_val){
      this.last = 21
      if(this.$route.path != "/home/stock") return
      let produits = Object.values(JSON.parse(localStorage.getItem("produits")))
      this.chunk = produits.filter(x => {
        return x.nom.toLowerCase().includes(new_val)
      }).slice(0, 21)
    },
    "$store.state.synchronized"(new_val){
      if(new_val){
        this.loadData()
      }
    }
  },
  methods:{
    createProduit(){
      this.$store.state.active_stock_item = null
      this.$store.state.dialog_produit_shown = true
    },
    editStock(item){
      this.$store.state.active_stock_item = item
      this.$store.state.dialog_produit_shown = true
    },
    makeAchat(item){
      this.$store.state.active_stock_item = item
      this.$store.state.dialog_achat_shown = true
    },
    loadData(){
      let db = Object.values(JSON.parse(localStorage.produits))
      this.chunk = db.slice(0, 21)
    },
    loadMore(event){
      let produits = JSON.parse(localStorage.produits)
      this.chunk.push(
        ...produits.slice(this.chunk.length, this.chunk.length+this.last)
      )
      this.load_more = false
    }
  },
  mounted(){
    if(this.chunk.length == 0){
      this.loadData()
    }
  },
}
</script>
<style scoped>
#stock{
  display: block;
  height: 100%;
  overflow-y: auto;
}
</style>