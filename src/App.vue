<template>
  <ion-app>
    <div v-if="!!active_user">
      <KioskChooser :active="must_choose_kiosk"/>
      <keep-alive>
        <ion-router-outlet id="main"/>
      </keep-alive>
      <ion-menu side="start" class="drawer-layout" content-id="main">
      <div class="menu-content">
        <div class="session-info">
          <div class="img-user">
            <img :src="!!active_kiosk?active_kiosk.logo:''" alt="">
          </div>
          <div>{{ !!active_kiosk?active_kiosk.nom:'' }}</div>
          <div>{{ active_user_fullname }}</div>
        </div>
        <div class="menus" @click="doThings">
          <ion-list lines="none">
            <ion-item-divider>menu</ion-item-divider>
            <ion-item button routerLink="/home/vente">
              <ion-icon :src="getIcon('cartOutline')"/>
              <ion-label>Vente</ion-label>
            </ion-item>
            <ion-item button routerLink="/home/stock">
              <ion-icon :src="getIcon('basketOutline')"/>
              <ion-label>Stock</ion-label>
            </ion-item>
            <ion-item button routerLink="/home/stats">
              <ion-icon :src="getIcon('statsChart')"/>
              <ion-label>Statistiques</ion-label>
            </ion-item>
          </ion-list>
          <ion-list lines="none">
            <ion-item-divider>Compte</ion-item-divider>
            <ion-item button routerLink="/profile">
              <ion-icon :src="getIcon('personOutline')"/>
              <ion-label>Edition</ion-label>
            </ion-item>
            <ion-item button @click="logOut">
              <ion-icon :src="getIcon('logOutOutline')"/>
              <ion-label>Deconnexion</ion-label>
            </ion-item>
          </ion-list>
          <ion-list lines="none">
            <ion-item-divider>Autres</ion-item-divider>
            <ion-item button @click="openWhatsapp">
              <ion-icon :src="getIcon('logoWhatsapp')"/>
              <ion-label>Demander l'aide</ion-label>
            </ion-item>
          </ion-list>
        </div>
      </div>
      </ion-menu>
    </div>
    <LoginForm v-else/>
  </ion-app>
</template>
<script>
import { useIonRouter, menuController } from '@ionic/vue';
import LoginForm from "./components/login_form"
import KioskChooser from "./components/kiosk_chooser"
import CustomPlugins from './plugins'

export default {
  components: { LoginForm, KioskChooser },
  data(){
    return {
    }
  },
  computed:{
    must_choose_kiosk(){
      return !!this.active_user.kiosks &&
             this.active_user.kiosks.length>1 &&
             !this.$store.state.active_kiosk
    },
    active_kiosk(){
      return this.getActiveKiosk()
    }
  },
  watch:{
    "$store.state.user":{
      deep:true,
      handler(new_val){
        if(!!new_val){
          localStorage.setItem('user', JSON.stringify(new_val));
        } else {
          localStorage.removeItem('user')
        }
      }
    },
    "$store.state.active_kiosk"(new_val){
      if(!!new_val){
        localStorage.setItem('active_kiosk', JSON.stringify(new_val));
        this.loadData()
      } else {
        localStorage.removeItem('active_kiosk')
      }
    },
  },
  methods:{
    openWhatsapp(){
      CustomPlugins.openWhatsapp()
    },
    doThings(event){
      menuController.close();
    },
    loadData(){
      let user = this.$store.state.user;
      let active_kiosk = this.$store.state.active_kiosk;

      if(!user || !active_kiosk) return

      var db_produits = JSON.parse(localStorage.getItem('produits')) || []

      var produits = Object.values(db_produits).filter(x => x.kiosk == active_kiosk.id)

      this.$store.state.produits = new Set(produits.slice(0, 21))
      this.$store.state.ibidandazwa = new Set(produits.filter(x => x.quantite > 0).slice(0, 21))
    }
  },
  mounted(){
    let user = JSON.parse(localStorage.getItem('user'));
    let active_kiosk = JSON.parse(localStorage.getItem('active_kiosk'));
    let url_mode = localStorage.getItem("url_mode")

    if(user) this.$store.state.user = user;
    if(active_kiosk) this.$store.state.active_kiosk = active_kiosk;
    if(url_mode) this.$store.state.url_mode = url_mode;

    if(!!active_kiosk) this.loadData()
  },
};
</script>
<style src="./style.css">
</style>
