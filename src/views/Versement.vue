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
          <ion-button @ionClick="showDateDialog">
            <ion-icon slot="icon-only" :icon="getIcon('calendar')"/>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-col>
        <VersementItem v-if="today_vers" :item="today_vers"/>
        <VersementItem v-for="versement in versements" :item="versement"/>
      </ion-col>
    </ion-content>
    <ion-fab-button @click="verser">
      <ion-spinner v-if="en_cours"/>
      <ion-icon :src="getIcon('walletOutline')" v-else/>
    </ion-fab-button>
    <ion-footer>
      <div class="group" v-if="!today_vers">
        <div>Ventes: </div>
        <div>{{ money(
          versements.reduce(
            (acc, x) => acc+=x.vente,
            (!!today_vers?today_vers.vente:0)
          )
        )}}</div>
      </div>
      <div class="group">
        <div>Dettes: </div>
        <div>{{ money(
          versements.reduce((acc, x) => acc+=x.dettes,
            (!!today_vers?today_vers.dettes:0)
          )
        )}}</div>
      </div>
      <div class="group">
        <div>Reste: </div>
        <div>{{ money(
          versements.reduce((acc, x) => acc+=x.vente+x.dettes,
            (!!today_vers?today_vers.vente+today_vers.dettes:0)
          )
        )}}</div>
      </div>
    </ion-footer>
  </ion-page>
  <DialogDateFilter :active="date_shown" @close="date_shown=false"/>
  <DialogVersement :active="versement_shown" :item="today_vers"
    @close="versement_shown=false"/>
</ion-page>
</template>
<script>
import VersementItem from "../components/versement_item"
import DialogDateFilter from "../components/dialog_date_filter"
import DialogVersement from "../components/dialog_versement"

export default {
  components:{VersementItem, DialogDateFilter, DialogVersement},
  data(){
    return {
      date_shown:false, versements:this.$store.state.versements,
      today_vers:null, en_cours:false, versement_shown:false,
    }
  },
  watch:{
    "$store.state.versements"(new_val){
      this.versements = new_val
    }
  },
  methods:{
    showDateDialog(){
      this.date_shown = true
    },
    fetchData(){
      let link = ""
      if(this.getActiveKiosk()==null){
        return
      }
      let kiosk_id = this.getActiveKiosk().id
      if(!this.next){
        link = this.url+`/versement/?kiosk=${kiosk_id}`;
      } else {
        link = this.next
      }
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.versements.push(...response.data.results)
        if(response.data.next.length > 0){
          this.next = response.data.next
          this.fetchData()
        } else {
          this.next = null
        }
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchData)
      });
    },
    fetchToday(){
      if(this.getActiveKiosk()==null){
        return
      }
      let kiosk_id = this.getActiveKiosk().id
      let link = this.url+`/versement/today/?kiosk=${kiosk_id}`;
      axios.get(link, this.headers)
      .then((response) => {
        this.today_vers = response.data
      });
    },
    verser(){
      this.versement_shown = true
    }
  },
  mounted(){
    if(this.$store.state.versements.length<1){
      this.fetchData()
      this.fetchToday()
    }
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
ion-fab-button{
  position: fixed;
  right: 10px;
  bottom: 40px;
}
ion-spinner{
  position: fixed;
}
</style>
