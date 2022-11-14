import Vue from 'vue'
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'
import Stats from '../views/Stats.vue'
import Stock from '../views/Stock.vue'
import Vente from '../views/Vente.vue'
import Commande from '../views/Commande.vue'
import Clientele from '../views/Clientele.vue'
import Dettes from '../views/Dettes.vue'
import Pertes from '../views/Pertes.vue'
import StatStock from '../views/StatStock.vue'
import Versement from '../views/Versement.vue'
import Profile from '../views/Profile.vue'
import Cart from '../views/Cart.vue'

const routes = [
  { path: '/', redirect: 'home' },
  {
    path:"/home/", 
    name: 'home',
    component: Home,
    children: [
      {path: "", redirect: "/home/vente"},
      { path: "vente", component: Vente},
      { path: "stock", component: Stock},
      { path: "stats", component: Stats}
    ],
  },
  { path: '/commande', name: 'commande', component: Commande},
  { path: '/clients', name: 'clients', component: Clientele},
  { path: '/dettes', name: 'dettes', component: Dettes},
  { path: '/pertes', name: 'pertes', component: Pertes},
  { path: '/statstock', name: 'statstock', component: StatStock},
  { path: '/versement', name: 'versement', component: Versement},
  { path: '/profile', name: 'profile', component: Profile},
  { path: '/cart', name: 'cart', component: Cart},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
