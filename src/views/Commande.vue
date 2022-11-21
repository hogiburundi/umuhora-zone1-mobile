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
        <CommandeItem v-for="commande in commandes" :item="commande"
          @print="displayFacture(commande)" @deleted="remove(commande)"/>
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
  <ion-searchbar show-cancel-button="always" debounce="500" id="search_com"
    @ionCancel="closeSearch" @ionInput="search($event.target.value)"/>
<div class="invoice" id="invoice">
  <center class="header">
      <img width=100 :src="getActiveKiosk().logo" style="display:block" />
      <div v-if="!!active_commande">
        Facture no. {{active_commande.id}} du {{datetime(active_commande.date)}}<br>
      </div>
      <div style="text-align: left; display: inline-block;">
          RC 23606/20<br />
          NIF 4001409707
      </div>
      <div>
        {{ getActiveKiosk().tel }}<br />
        {{ getActiveKiosk().nom }}<br />
        {{ getActiveKiosk().details }}
      </div>
      <div v-if="!!active_commande && !!active_commande.client">
        <b v-if="active_commande.id<0">
          {{`${active_commande.client.nom} ${active_commande.client.tel}`}}
        </b>
        <b v-else>
          {{active_commande.client}}
        </b>
      </div>
  </center>
  <table style="width:100%;">
    <tbody v-if="!!active_commande">
      <tr style="border-bottom: 1px solid #aaa;text-align: left;">
        <th>Article</th>
        <th style="">P.U.</th>
        <th>Qt.</th>
        <th style="text-align: right;">Total</th>
      </tr>
      <tr style="text-align: left;" v-for="item in active_commande.ventes">
        <td>{{ item.produit }}</td>
        <td>{{ item.prix_unitaire }} Fbu</td>
        <td>x {{ item.quantite }}</td>
        <td style="text-align: right;">{{ item.prix_total }} Fbu</td>
      </tr>
      <tr style="border-top: 1px solid #aaa;text-align: left;">
        <th colspan="3">Total</th>
        <th style="text-align: right;"><b>{{ money(active_commande.prix) }} Fbu</b></th>
      </tr>
    </tbody>
  </table>
  <div style="margin:10px" v-if="!!active_commande">
      Caissier: {{ active_commande.user }}
  </div>
  <center>
    <strong>Murakoze, Merci, Thank you!</strong>
  </center>
</div>
</ion-page>
</template>
<script>
import CommandeItem from "../components/commande_item"
import DialogDateFilter from "../components/dialog_date_filter"
import CustomPlugins from '../plugins'

export default {
  components:{ CommandeItem, DialogDateFilter},
  data(){
    return {
      date_shown:false, commandes:[],
      active_commande:null, montant:0, payee:0, reste:0
    }
  },
  watch:{
    commandes(new_val){
      this.montant = 0;
      this.payee = 0;
      this.reste = 0;
      new_val.forEach(x => {
        this.montant += x.prix;
        this.payee += x.payee;
        this.reste += x.prix-x.payee;
      })
    },
    active_commande(new_val){
      console.log(new_val)
    }
  },
  methods:{
    showDateDialog(){
      this.date_shown = true
    },
    closeSearch(event){
      event.target.classList.remove("shown")
    },
    showSearch(){
      let search_view = document.getElementById("search_com")
      search_view.classList.add("shown")
    },
    search(keyword){
      this.commandes = Object.values(this.$store.state.commandes).filter(x => {
        return JSON.stringify(x).toLowerCase().includes(keyword)
      })
    },
    displayFacture(commande){
      if(commande.id > 0){
        this.makeToast(null, "téléchargement des ventes en cours...", 3000)
        axios.get(this.url+`/commande/${commande.id}/`, this.headers)
        .then((response) => {
          this.active_commande = response.data
          let invoice = document.getElementById("invoice")
          CustomPlugins.launchPrint({"html":invoice.innerHTML})
        }).catch((error) => {
          this.displayErrorOrRefreshToken(error, () => this.displayFacture(commande))
        });
      } else {
        let ventes = []
        let produit
        for(let vente of commande.created.ventes){
          produit = JSON.parse(localStorage.getItem("produits"))[vente.produit]
          ventes.push({
            produit: produit.nom,
            prix_unitaire: produit.prix_vente,
            prix_total:produit.prix_vente * vente.quantite,
          })
        }
        this.active_commande = commande
        this.active_commande.ventes = ventes
        setTimeout(() =>{
          let invoice = document.getElementById("invoice")
          console.log(invoice.innerHTML)
          CustomPlugins.launchPrint({"html":invoice.innerHTML})
        },1000)
      }
    },
    calculateTotal(){
      this.commandes.forEach(x => {
        this.montant += x.prix;
        this.payee += x.payee;
        this.reste += x.prix-x.payee;
      })
    },
    remove(item){
      this.commandes.splice(this.commandes.indexOf(item), 1)
    }
  },
  mounted(){
    this.commandes = Object.values(JSON.parse(localStorage.getItem("commandes"))).sort((x, y) => {
      return new Date(y.date) - new Date(x.date)
    })
    this.calculateTotal()
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
.invoice{
  display: none;
}
</style>
