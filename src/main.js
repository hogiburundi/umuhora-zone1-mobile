import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {
  IonApp, IonPage, IonicVue, IonRouterOutlet, IonIcon, IonTabs, IonLabel,
  IonInput, IonItem, IonButton, IonButtons, IonCol, IonContent, IonTabButton,
  IonTabBar, IonTitle, IonToolbar, IonHeader, IonMenuButton, IonFabButton,
  IonList, IonMenu, IonToggle, IonFooter, IonItemDivider, IonPopover, IonBadge,
  IonSelectOption, IonSelect, IonText, IonDatetime, toastController, IonSearchbar,
  IonSpinner, alertController
} from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css'
import * as allIcons from "ionicons/icons";
import { App as CapacitorApp } from '@capacitor/app';

window.axios = axios;
const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)

app.component("IonRouterOutlet", IonRouterOutlet)
app.component("IonApp", IonApp)
app.component("IonPage", IonPage)
app.component("IonTabs", IonTabs)
app.component("IonLabel", IonLabel)
app.component("IonInput", IonInput)
app.component("IonItem", IonItem)
app.component("IonSearchbar", IonSearchbar)
app.component("IonButton", IonButton)
app.component("IonButtons", IonButtons)
app.component("IonCol", IonCol)
app.component("IonIcon", IonIcon)
app.component("IonContent", IonContent)
app.component("IonTabButton", IonTabButton)
app.component("IonTabBar", IonTabBar)
app.component("IonTitle", IonTitle)
app.component("IonToolbar", IonToolbar)
app.component("IonHeader", IonHeader)
app.component("IonMenuButton", IonMenuButton)
app.component("IonFabButton", IonFabButton)
app.component("IonList", IonList)
app.component("IonMenu", IonMenu)
app.component("IonToggle", IonToggle)
app.component("IonFooter", IonFooter)
app.component("IonItemDivider", IonItemDivider)
app.component("IonPopover", IonPopover)
app.component("IonBadge", IonBadge)
app.component("IonSelectOption", IonSelectOption)
app.component("IonSelect", IonSelect)
app.component("IonText", IonText)
app.component("IonDatetime", IonDatetime)
app.component("IonSpinner", IonSpinner)

app.mixin({
  methods: {
    getIcon(name) {
      return allIcons[name];
    },
    money(x) {
      let cash = parseFloat(x).toFixed(0)
      if(!x) return "0";
      return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    isNumeric(x) {
      let str = x.toString();
      if (str.match(/^[0-9]+$/)) return true;
      return false;
    },
    logOut(x) {
      alertController.create({
        header: 'Attention!',
        message: 'Voulez-vous vraiment vous deconnecter?',
        buttons: [
          {
            text: 'laisser',
            role: 'cancel'
          },
          {
            text: 'OUI',
            handler: () => {
              let full_disconnect = true
              let commandes = JSON.parse(localStorage.getItem("commandes"))
              let stocks = JSON.parse(localStorage.getItem("stocks"))
              let pertes = JSON.parse(localStorage.getItem("pertes"))
              let produits = JSON.parse(localStorage.getItem("produits"))
              let payments = JSON.parse(localStorage.getItem("payments"))
              let clients = JSON.parse(localStorage.getItem("clients"))

              if(!!commandes){
                commandes = Object.keys(commandes).filter(x => x < 0)
                if(commandes.length > 0){
                  full_disconnect = false
                } else {
                  localStorage.setItem("commandes", "{}")
                }
              }
              if(full_disconnect && !!stocks){
                stocks = Object.keys(stocks).filter(x => x < 0)
                if(stocks.length > 0){
                  full_disconnect = false
                } else {
                  localStorage.setItem("stocks", "{}")
                }
              } 
              if(full_disconnect && !!pertes){
                pertes = Object.keys(pertes).filter(x => x < 0)
                if(pertes.length > 0){
                  full_disconnect = false
                } else {
                  localStorage.setItem("pertes", "{}")
                }
              } 
              if(full_disconnect && !!produits){
                produits = Object.keys(produits).filter(x => x < 0)
                if(produits.length > 0){
                  full_disconnect = false
                } else {
                  localStorage.setItem("produits", "{}")
                }
              }
              if(full_disconnect && !!payments){
                payments = Object.keys(payments).filter(x => x < 0)
                if(payments.length > 0){
                  full_disconnect = false
                } else {
                  localStorage.setItem("payments", "{}")
                }
              }
              if(full_disconnect && !!clients){
                clients = Object.keys(clients).filter(x => x < 0)
                this.deleteFromDB("clients", clients)
              }
              this.$store.state.user = null
              if(full_disconnect) this.$store.state.active_kiosk = null
            },
          },
        ],
      }).then(res => {
        res.present();
      });
    },
    money(x) {
      let cash = parseFloat(x).toFixed(0)
      if(!x) return "0";
      return cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    makeToast(title, message, duration=5000){
      toastController.create({
        header: title,
        message: this.cleanString(message).slice(0, 240),
        icon: this.getIcon('informationCircleOutline'),
        duration:duration,
        buttons: [
          {
            text: 'OK',
            handler: () => {}
          }
        ]
      }).then(toast => {
        toast.present();
      });
    },
    cleanString(str){
      if (!str) return "";
      if(typeof(str)=='object'){
        let string = ""
        for( let [clef, valeur] of Object.entries(str)){
          if(typeof(valeur)=='object'){
            let child = ""
            for( let [key, value] of Object.entries(valeur)){
              child += `- ${key}: ${value}. `
            }
            valeur = child;
          }
          string+=`${clef}: ${valeur}. `
        }
        return string;
      };
      str = str.toString();
      return str.replace( /(<([^>]+)>)/ig, '');
    },
    getGroupName(id){
      let group = this.$store.state.groups.find(x => x.id == id)
      return !!group? group.name:"-";
    },
    getGroupId(name){
      let group = this.$store.state.groups.find(x => {
        return x.name.toLowerCase() == name.toLowerCase()
      })
      return !!group? group.id:-1;
    },
    userIs(personnel, group_id){
      let groups = personnel.user.groups;
      return groups.includes(group_id);
    },
    datetime(x) {
      if(!x) return "-"
      let date = new Date(x);
      return new Intl.DateTimeFormat(
        'en-GB',
        { dateStyle: 'short', timeStyle: 'short' }
      ).format(date)
    },
    date(x) {
      if(!x) return "-"
      let date = new Date(x);
      return new Intl.DateTimeFormat(
        'en-GB',
        { dateStyle: 'short' }
      ).format(date)
    },
    displayErrorOrRefreshToken(error, callback, elseCallback){
      if(!!error.response){
        if(error.response.data.code == "token_not_valid"){ 
          let refresh = this.$store.state.user.refresh
          if(!refresh){
            this.$store.state.user = null;
            return
          }
          axios.post(this.url+"/refresh/", {"refresh":refresh})
          .then((response) => {
            this.$store.state.user.access = response.data.access
            if(typeof callback == "function") callback()
          }).catch((error) => {
            this.$store.state.user = null;
            console.error(error)
          })
        } else {
          this.makeToast('erreur', this.cleanString(error.response.data))
          if(typeof(elseCallback) == 'function'){
            elseCallback()
          }
        }
      } else {
        console.error(error)
      }
    },
    getActiveKiosk(){
      if(!this.$store.state.active_kiosk && this.active_user){
        if(!!this.active_user.kiosks && this.active_user.kiosks.length == 1){
          this.$store.state.active_kiosk = this.active_user.kiosks[0]
        }
      }
      return this.$store.state.active_kiosk
    },
    updateStocksInDB(old_id, new_data){
      let stocks = Object.values(JSON.parse(localStorage.getItem("stocks"))).filter(x => {
        return x.produit.id == old_id
      })
      for(let stock of stocks){
        stock.created.produit = new_data.id
        stock.produit = new_data
      }
      this.saveInDB("stocks", stocks)
    },
    updateVentesInDB(old_id, new_id){
      let ventes = Object.values(JSON.parse(localStorage.getItem("commandes"))).filter(x => {
        return x.id < 0 && !!x.created
      })
      let updated = []
      for(let vente of ventes){
        for(var i=0; i<vente.created.ventes.length; i++){
          if(vente.created.ventes[i].produit == old_id){
            vente.created.ventes[i].produit = new_id
          }
        }
        updated.push(vente)
      }
      this.saveInDB("commandes", updated)
    },
    getMaxID(storage){
      let kiosk_id = this.getActiveKiosk().id;
      let id = null
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = []
        localStorage.setItem(storage, "{}")
      } else {
        db = Object.values(db)
        if(db.length == 0) return id
        id = db[0].id
        for(let item of db){
          if(item.id > id) id = item.id
        }
      }
      return id
    },
    generateId(storage){
      if(!storage) throw(`la table ${storage} est introuvable`)
      let kiosk_id = this.getActiveKiosk().id;
      let id = -1
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = []
        localStorage.setItem(storage, "{}")
      } else {
        db = Object.values(db).filter(x => x.id < 0)
        if(db.length == 0) return id
        let ids = db.map(x => x.id)
        return Math.min(...ids) -1
      }
      return id
    },
    getMaxTime(storage){
      let kiosk_id = this.getActiveKiosk().id;
      let date = null
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = []
        localStorage.setItem(storage, "{}")
      } else {
        db = Object.values(db)
        if(db.length == 0) return date
        date = new Date(db[0].updated_at)
        for(let item of db){
          let new_date = new Date(item.updated_at)
          if(new_date > date) date = new_date
        }
        date = date.toISOString()
      }
      return date
    },
    getCreated(storage){
      let results = []
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = []
        localStorage.setItem(storage, "{}")
      } else {
        results = Object.values(db).filter(x => !!x.created)
      }
      return results
    },
    getUpdated(storage){
      let results = []
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = []
        localStorage.setItem(storage, "{}")
      } else {
        results = Object.values(db).filter(x => !!x.updated)
      }
      return results
    },
    saveInDB(storage, data){
      let db = JSON.parse(localStorage.getItem(storage))
      if(Array.isArray(data)){
        for(let item of data){
          db[item.id.toString()] = item
        }
      } else {
        db[data.id.toString()] = data
      }
      localStorage.setItem(storage, JSON.stringify(db))
      console.log(`${storage.toUpperCase()} SAVED`)
    },
    saveInListDB(storage, data){
      let db = JSON.parse(localStorage.getItem(storage))
      if(!db){
        db = new Set()
        localStorage.setItem(storage, "[]")
      } else {
        db = new Set(db)
      }
      if(Array.isArray(data)){
        for(let item of data){
          db.add(item)
        }
      } else {
        db.add(data)
      }
      localStorage.setItem(storage, JSON.stringify(Array.from(db)))
      console.log(`${storage.toUpperCase()} SAVED`)
    },
    deleteFromDB(storage, data){
      let db = JSON.parse(localStorage.getItem(storage))
      if(Array.isArray(data)){
        for(let id of data){
          delete(db[id])
        }
      } else {
        delete(db[data])
      }
      localStorage.setItem(storage, JSON.stringify(db))
      console.log(`${storage.toUpperCase()} SAVED`)
    },
    deleteFromListDB(storage, data){
      let db = JSON.parse(localStorage.getItem(storage))
      if(Array.isArray(data)){
        // remove items in list using filter
        db = db.filter(x => !data.includes(x))
      } else {
        db.splice(db.indexOf(data), 1)
      }
      localStorage.setItem(storage, JSON.stringify(db))
      console.log(`${storage.toUpperCase()} SAVED`)
    }
  },
  computed:{
    active_user(){
      return this.$store.state.user;
    },
    active_user_fullname(){
      return `${this.active_user.first_name} ${this.active_user.last_name}`;
    },
    user_is_owner(){
      return !!this.getActiveKiosk() && this.active_user.owned.includes(this.getActiveKiosk().id)
    },
    base_url(){
      return `https://${this.$store.state.url_mode}umuhora.com`
    },
    url(){
      return this.base_url + this.$store.state.api;
    },
    headers(){
      return {
        headers:{
          "Authorization":"Bearer "+this.$store.state.user.access
        }
      }
    }
  }
})
CapacitorApp.addListener('backButton', ({canGoBack}) => {
  if((!canGoBack) || (window.history.state.back == null)){
    CapacitorApp.exitApp();
  } else {
    window.open(window.history.state.back, "_self")
  }
});
app.mount('#app');