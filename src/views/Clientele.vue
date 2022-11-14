<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button slot="start" routerLink="/home/stats">
              <ion-icon :src="getIcon('arrowBack')"></ion-icon>
            </ion-button>
          </ion-buttons>
        <ion-title>URUFATANAMENDE</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-col>
        <StatClientItem v-for="client in clients" :item="client"/>
      </ion-col>
    </ion-content>
    <ion-footer>
      <div class="group">
        <div>Nombre: </div>
        <div>{{ clients.length }}</div>
      </div>
      <div class="group">
        <div>Payée: </div>
        <div>{{ money(
          clients.reduce((acc, x) => acc+=x.payee, 0)
        )}}</div>
      </div>
      <div class="group">
        <div>Reste: </div>
        <div>{{ money(
          clients.reduce((acc, x) => acc+=x.prix-x.payee, 0)
        )}}</div>
      </div>
    </ion-footer>
  </ion-page>
</template>
<script>
import StatClientItem from "../components/stat_client_item"
export default {
  components:{StatClientItem},
  data(){
    return {
      clients:this.$store.state.stats_clients
    }
  },
  watch:{
    "$store.state.stats_clients"(new_val){
      this.clients = new_val
    }
  },
  methods:{
    fetchData(){
      let link = ""
      if(this.getActiveKiosk()==null){
        return
      }
      let kiosk_id = this.getActiveKiosk().id
      link = this.url+`/commande/stats/?kiosk=${kiosk_id}`;
      axios.get(link, this.headers)
      .then((response) => {
        this.$store.state.stats_clients.push(...response.data)
      }).catch((error) => {
        this.displayErrorOrRefreshToken(error, this.fetchData)
      });
    },
  },
  mounted(){
    if(this.$store.state.stats_clients.length<1){
      this.fetchData()
    }
  }
}
</script>
<style scoped>
ion-footer{
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
}
.group{
  display: flex;
}
</style>
