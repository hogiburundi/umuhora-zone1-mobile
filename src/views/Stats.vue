<template>
  <ion-page>
    <ion-content>
      <ion-col>
        <ion-col class="menu" routerLink="/commande">
          <div>HISTORIQUE DES VENTES</div>
          <ion-icon :src="getIcon('bagCheckOutline')"/>
          <ion-button size="small">VOIR LES VENTES</ion-button>
        </ion-col>
        <ion-col class="menu" routerLink="/statstock">
          <div>HISTORIQUE DES STOCKS</div>
          <ion-icon :src="getIcon('pieChartOutline')"/>
          <ion-button size="small">VOIR LES STOCKS</ion-button>
        </ion-col>
        <ion-col class="menu" routerLink="/dettes">
          <div>HISTORIQUE DES DETTES</div>
          <ion-icon :src="getIcon('receiptOutline')"/>
          <ion-button size="small">VOIR LES DETTES</ion-button>
        </ion-col>
        <ion-col class="menu" routerLink="/pertes">
          <div>HISTORIQUE DES PERTES</div>
          <ion-icon :src="getIcon('barChartOutline')"/>
          <ion-button size="small">VOIR LES PERTES</ion-button>
        </ion-col>
        <ion-col class="menu" routerLink="/clients">
          <div>HISTORIQUE DU CLIENTÈLE</div>
          <ion-icon :src="getIcon('peopleOutline')"/>
          <ion-button size="small">VOIR LES CLIENTS</ion-button>
        </ion-col>
        <ion-col class="menu" routerLink="/versement">
          <div>VERSEMENT</div>
          <ion-icon :src="getIcon('walletOutline')"/>
          <ion-button size="small">LES VERSEMENTS</ion-button>
        </ion-col>
      </ion-col>
    </ion-content>
  </ion-page>
</template>
<script>
export default {
  data(){
    return {
    }
  },
}
</script>
<style scoped>
ion-col{
  max-height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 5px;
  grid-row-gap: 5px;
  background: #eee;
  align-items: flex-start;
  align-content: flex-start;
  overflow-x: hidden;
}
.menu{
  height: 160px;
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.menu ion-icon{
  flex-grow: 1;
  width: 100%;
  color: var(--ion-color-primary);
}
ion-button{
  width: 100%;
}
</style>