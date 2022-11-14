<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
          <ion-buttons slot="start">
            <ion-button slot="start" routerLink="/home/stats">
              <ion-icon :src="getIcon('arrowBack')"></ion-icon>
            </ion-button>
          </ion-buttons>
        <ion-title>UMUHORA</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="kiosk">
        <h3>Alimentation UMUCO</h3>
        <div class="img-user">
          <img src="/img/ic_user.png" alt="">
        </div>
        <div class="licence">Licence active jusqu'à Avril 2022</div>
      </div>
      <ion-list>
        <ion-item-divider color="light">PROFILE BASIC</ion-item-divider>
        <ion-item>
          <ion-icon :src="getIcon('person')"/>
          <ion-label>Alimentation umuco</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :src="getIcon('planet')"/>
          <ion-label>https://www.umucopharma.com</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :src="getIcon('informationCircle')"/>
          <ion-label>Un peu d'informations sur nous. Ca continue et ca continue</ion-label>
        </ion-item>
        <ion-item-divider color="light">INFORMATION PRIVEES</ion-item-divider>
        <ion-item>
          <ion-icon :src="getIcon('mail')"/>
          <ion-label>umuco@gmail.com</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :src="getIcon('call')"/>
          <ion-label>+257 75 202 231</ion-label>
        </ion-item>
        <ion-item-divider color="light">CHANGER MOT DE PASSE</ion-item-divider>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type=password placeholder="Password" v-model="password" clearInput/>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input type=password placeholder="Password" v-model="password" clearInput/>
        </ion-item>
        <ion-button color="primary" expand="block">Valider</ion-button>
        <ion-item-divider color="light">ACCESSIBILITE</ion-item-divider>
        <ion-item>
          <ion-icon :src="getIcon('colorPalette')"/>
          <ion-label class="descr">
            <label>Couleurs pour mal voyants</label>
            <div>
              lorem ipsum dolor sit amet, consectetur
              adipisicing elit, sed do eiusmod tempor
            </div>
          </ion-label>
          <ion-toggle/>
        </ion-item>
        <ion-item-divider color="light">ABOUT</ion-item-divider>
        <ion-item>
          <ion-icon :src="getIcon('logoWhatsapp')"/>
          <ion-label>Aide</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :src="getIcon('lockClosed')"/>
          <ion-label>Confindentialité</ion-label>
        </ion-item>
        <ion-item>
          <ion-icon :src="getIcon('documentText')"/>
          <ion-label>Termes et condition</ion-label>
        </ion-item>
        <ion-button color="danger" expand="block">Déconnexion</ion-button>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
</script>
<style scoped>
.kiosk{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.licence{
  color: green;
  margin-top: 10px;
}
ion-button{
  margin: 10px;
}
ion-label label{
  font-weight: 650;
}
.descr{
  white-space: wrap!important;
}
</style>
