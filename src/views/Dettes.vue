<template>
<ion-page>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button slot="start" routerLink="/home/stats">
            <ion-icon :src="getIcon('arrowBack')"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>UMUHORA</ion-title>
        <ion-buttons slot="secondary">
          <ion-button @click="showDateDialog">
            <ion-icon slot="icon-only" :icon="getIcon('calendar')"/>
          </ion-button>
          <ion-button @click="showSearch">
            <ion-icon slot="icon-only" :icon="getIcon('search')"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-col>
        <DetteItem v-for="commande in commandes" :item="commande"
          @changed="calculateTotal" @pay="makePay(commande)"
          @payments="showPayments(commande)"/>
      </ion-col>
    </ion-content>
    <ion-footer>
      <div class="group">
        <div>Montant: </div>
        <div>{{ money(montant)}}</div>
      </div>
      <div class="group">
        <div>Payée: </div>
        <div>{{ money(payee)}}</div>
      </div>
      <div class="group">
        <div>Reste: </div>
        <div>{{ money(reste)}}</div>
      </div>
    </ion-footer>
  </ion-page>
  <DialogDateFilter :active="date_shown" @close="date_shown=false"/>
  <ion-searchbar show-cancel-button="always" debounce="500" id="search_det"
    @ionCancel="closeSearch" @ionInput="search($event.target.value)"/>
  <DialogPay :item="active_item" :active="pay_shown" @close="closeDialogs"/>
  <DialogPayments :item="active_item" :active="payments_shown" @close="closeDialogs"/>
</ion-page>
</template>
<script>
import DetteItem from "../components/dette_item"
import DialogDateFilter from "../components/dialog_date_filter"
import DialogPay from "../components/dialog_pay"
import DialogPayments from "../components/dialog_payments"

export default {
  components:{DetteItem, DialogDateFilter, DialogPay, DialogPayments},
  data(){
    return {
      commandes:[], date_shown:false, payments_shown:false, pay_shown:false,
      active_item:null, montant:0, payee:0, reste:0
    }
  },
  methods:{
    makePay(item){
      this.active_item = item
      this.pay_shown = true
    },
    showPayments(item){
      this.active_item = item
      this.payments_shown = true
    },
    closeDialogs(){
      this.active_item = null
      this.payments_shown = false
      this.pay_shown = false
    },
    showDateDialog(){
      this.date_shown = true
    },
    closeSearch(event){
      event.target.classList.remove("shown")
    },
    showSearch(){
      let search_view = document.getElementById("search_det")
      search_view.classList.add("shown")
    },
    search(keyword){
      this.commandes = Object.values(this.$store.state.commandes).filter(x => {
        return x.prix > x.payee && JSON.stringify(x).toLowerCase().includes(keyword)
      })
    },
    calculateTotal(){
      this.commandes.forEach(x => {
        this.montant += x.prix;
        this.payee += x.payee;
        this.reste += x.prix-x.payee;
      })
    },
    getCurrrentCommands(){
      this.commandes = Object.values(JSON.parse(localStorage.getItem("commandes")))
        .filter(x => x.prix > x.payee).sort((x, y) => {
          return Math.abs(y.id) - Math.abs(x.id)
        })
    }
  },
  mounted(){
    this.getCurrrentCommands()
  },
}
</script>
<style scoped>
ion-footer{
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
}
.group>*{
  display: inline-block;
}
</style>
