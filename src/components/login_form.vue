<template>
  <ion-page>
    <ion-content>
    <div class="mode">
      {{ url_mode }}
    </div>
    <ion-col class="center-h ion-padding">
      <ion-col size=12>
        <ion-item class="ion-no-padding">
          <ion-label position="floating">Username</ion-label>
          <ion-input type=text placeholder="Username"
            @IonChange="username=$event.target.value" clearInput/>
        </ion-item>
        <ion-item class="ion-no-padding">
          <ion-label position="floating">Password</ion-label>
          <ion-input type=password placeholder="Password"
            @IonChange="password=$event.target.value" clearInput/>
        </ion-item>
        <ion-label color="danger">{{ logs }}</ion-label>
        <ion-button expand="block" @click="login">
          <ion-spinner v-if="loging_in"
            name="crescent" color="light" style="margin: 0 10px;"/>
          CONNEXION
        </ion-button>
      </ion-col>
      <div>
        <span
          @touchstart="touchStarted"
          @touchend="touchEnded"
          @mousedown="touchStarted"
          @mouseup="touchEnded">
          Mot de passe oublié?
        </span>
        <a @click="openWhatsapp">
          Demandez de l'aide
          <ion-icon :src="getIcon('logoWhatsapp')"></ion-icon>
        </a>
      </div>
    </ion-col>
    </ion-content>
  </ion-page>
</template>

<script>
import CustomPlugins from '../plugins'

export default {
  data(){
    return {
      username:"",
      password:"",
      logs:"",
      loging_in:false,
      touch_time:0,
      url_mode: this.$store.state.url_mode
    }
  },
  watch:{
    "$store.state.url_mode"(new_val){
      this.url_mode = new_val
      localStorage.setItem("url_mode", new_val)
    }
  },
  methods:{
    touchStarted(){
      this.touch_time = new Date()
    },
    touchEnded(){
      let end_time = new Date() - this.touch_time
      if(end_time > 2000){
        this.switchUrlMode()
      }
    },
    switchUrlMode(){
      this.$store.state.url_mode = !this.url_mode?"test.":""
    },
    login(){
      this.logs = ""
      this.loging_in = true
      axios.post(this.url+"/login/", 
        {"username": this.username, "password":this.password}
      ).then((response) => {
        let active_kiosk = JSON.parse(localStorage.getItem("active_kiosk"))
        if(active_kiosk){
          let ids = response.data.kiosks.map(x => x.id)
          if(!ids.includes(active_kiosk.id)){
            this.logs = `Seul les utilisateurs du kiosk "${active_kiosk.nom}" peuvent se connecter`
            return
          }
        }
        this.$store.state.user = response.data
        this.$store.state.user.username = this.username
      }).catch((error) => {
        console.log(error)
        this.logs = error.response.data
      }).finally(() => {
        this.loging_in = false
      })
    },
    openWhatsapp(){
      CustomPlugins.openWhatsapp()
    }
  }
}
</script>
<style>
.center-h{
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
}
</style>