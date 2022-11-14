<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-buttons slot="secondary">
          <ion-button routerLink="/cart">
            <ion-icon slot="icon-only" :src="getIcon('cartOutline')"/>
            <ion-badge color="danger" v-if="$store.state.cart.content.length>0">
              {{ $store.state.cart.content.length }}
            </ion-badge>
          </ion-button>
          <ion-button @click="showSearch">
            <ion-icon slot="icon-only" :icon="getIcon('search')"/>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button id="menu-toggler">
            <ion-icon slot="icon-only"
              :ios="getIcon('ellipsisHorizontal')"
              :md="getIcon('ellipsisVertical')"/>
          </ion-button>
        </ion-buttons>
        <ion-title>UMUHORA</ion-title>
      </ion-toolbar>
      <ion-popover trigger="menu-toggler" dismiss-on-select="true" show-backdrop="false">
        <ion-content>
          <ion-list lines="none">
            <ion-item button size="small">
              <ion-label>Notifications</ion-label>
              <ion-icon :icon="getIcon('notificationsOutline')"/>
              <ion-badge color="danger" class="notif">
                {{ $store.state.cart.content.length }}
              </ion-badge>
            </ion-item>
            <ion-item button size="small" @click="showSync">
              <ion-label>Synchroniser</ion-label>
              <ion-icon :icon="getIcon('sync')"/>
            </ion-item>
            <ion-item button routerLink="/profile">
              <ion-label>Edition</ion-label>
              <ion-icon :src="getIcon('personOutline')"/>
            </ion-item>
            <ion-item button @click="backup">
              <ion-label>Sauvegarder</ion-label>
              <ion-icon :src="getIcon('saveOutline')"/>
            </ion-item>
            <ion-item button @click="restore">
              <ion-label>Restaurer</ion-label>
              <ion-icon :src="getIcon('reloadCircleOutline')"/>
            </ion-item>
            <ion-item button @click="logOut">
              <ion-label>Deconnexion</ion-label>
              <ion-icon :src="getIcon('powerOutline')"/>
            </ion-item>
            <ion-item button @click="openWhatsapp">
              <ion-label>Demander l'aide</ion-label>
              <ion-icon :src="getIcon('logoWhatsapp')"/>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>
    </ion-header>
    <ion-content>
      <keep-alive>
        <ion-router-outlet :key="$route.fullPath"/>
      </keep-alive>
    </ion-content>
    <ion-footer>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="vente" href="/home/vente">
          <ion-icon :src="getIcon('cartOutline')"></ion-icon>
          <ion-label>Vente</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="stock" href="/home/stock">
          <ion-icon :src="getIcon('basketOutline')"></ion-icon>
          <ion-label>Produit</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="stats" href="/home/stats">
          <ion-icon :src="getIcon('statsChart')"></ion-icon>
          <ion-label>Statistiques</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
      <ion-button tab="stats" @click="startScan">
        <ion-icon :src="getIcon('qrCode')"></ion-icon>
      </ion-button>
    </ion-footer>
    <ion-searchbar show-cancel-button="always" debounce="0" id="searchbar"
      @ionCancel="closeSearch" @search="search($event.target.value)"/>
    <DialogProduit :active="produit_shown" @close="closeDialog"
      :item="active_stock_item"/>
    <DialogSync :active="sync_shown" @close="closeDialog"/>
    <DialogAchat :active="achat_shown" @close="closeDialog"
      :item="active_stock_item"/>
  </ion-page>
</template>

<script>
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import DialogProduit from "../components/dialog_produit"
import DialogAchat from "../components/dialog_achat"
import DialogSync from "../components/dialog_sync"
import CustomPlugins from '../plugins'

export default {
  components:{ DialogProduit, DialogAchat, DialogSync },
  data(){
    return {
      menu_shown:false,
      produit_shown:false,
      achat_shown:false,
      active_stock_item:null,
      produit_shown: false,
      achat_shown:false,
      sync_shown:false,
      search_shown:false
    }
  },
  watch:{
    "$store.state.dialog_produit_shown"(new_val){
      this.produit_shown = new_val
    },
    "$store.state.dialog_achat_shown"(new_val){
      this.achat_shown = new_val
    },
    "$store.state.active_stock_item"(new_val){
      this.active_stock_item = new_val
    }
  },
  methods:{
    closeDialog(){
      this.$store.state.dialog_produit_shown = false
      this.$store.state.dialog_achat_shown = false
      this.$store.state.active_stock_item = null
      this.sync_shown = false
    },
    startScan(){
      CustomPlugins.startScan().then((result) => {
        let item = JSON.parse(localStorage.getItem('produits'))[result.value.toString()]
        if(item.quantite > 0){
          this.$store.state.cart.add(item)
        }
      });
    },
    closeSearch(event){
      let searchbar = document.getElementById("searchbar")
      this.$store.state.home_keyword = ""
      searchbar.classList.remove("shown")
    },
    showSearch(){
      let searchbar = document.getElementById("searchbar")
      searchbar.classList.add("shown")
    },
    showSync(){
      this.sync_shown=true
    },
    search(keyword){
      this.$store.state.home_keyword = keyword.toLowerCase()
    },
    toggleFab(){
      let vue = this
      this.fab_shown = true
      window.clearTimeout(window.current_event)
      window.current_event = window.setTimeout(() => {
        vue.fab_shown = false
      }, 5000)
    },
    openWhatsapp(){
      CustomPlugins.openWhatsapp()
    },
    backup(){
      if(!this.getActiveKiosk()){
        return
      }
      let data = {
        clients: JSON.parse(localStorage.getItem("clients")),
        commandes: JSON.parse(localStorage.getItem("commandes")),
        produits: JSON.parse(localStorage.getItem("produits")),
        stocks: JSON.parse(localStorage.getItem("stocks")),
        pertes: JSON.parse(localStorage.getItem("pertes")),
        payments: JSON.parse(localStorage.getItem("payments"))
      }
      let kiosk = this.getActiveKiosk().nom
      data = JSON.stringify(data);
      Filesystem.writeFile({
        path: `${kiosk}_${new Date().getTime()}.json`,
        data: data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      }).then((result) => {
        this.makeToast("backup", `Une sauvegarde a été créée dans ${result.uri}`)
        this.$store.state.saved = true
      }, (err) => {
        this.makeToast("error", JSON.stringify(err))
      });
      // const blob = new Blob([data], {type: 'text/json;charset=windows-1252;'});
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.setAttribute('hidden', '');
      // a.setAttribute('href', url);
      // a.setAttribute('download', 'model.json');
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    },
    restore(){
      this.makeToast("Attention", "tout les données seront remplaçées...")
      this.$store.state.synchronized = false
      const input = document.createElement('input');
      input.type = 'file';
      input.hidden = true;
      // input.accept = 'application/JSON';
      input.onchange = e => {
         var file = e.target.files[0];
         var reader = new FileReader();
         reader.readAsText(file,'UTF-8');
         reader.onload = readerEvent => {
            let content = JSON.parse(readerEvent.target.result);
            for(let table of Object.keys(content)){
              localStorage.setItem(table, JSON.stringify(content[table]))
            }
            this.makeToast("Success", "les données ont été a été restorées")
            this.$store.state.synchronized = true
         }
      }
      input.click();
    },
  },
  mounted(){
    if(!this.$store.state.saved){
      this.backup()
    }
  }
}
</script>
<style scoped>
ion-fab-button{
  position: fixed;
  right: 10px;
  bottom: 70px;
}
ion-tab-bar{
  display: flex!important;
}
ion-badge{
  position: absolute;
  top: -5px;
  right: -7px;
  font-size: .8em;
}
ion-badge.notif{
  position: absolute;
  top: 5px;
  right: 20px;
  font-size: .8em;
}
ion-tab-bar{
  width: calc(100% - 50px);
  display: inline-block;
}
ion-footer{
  display: flex;
  align-items: center;
}
</style>
