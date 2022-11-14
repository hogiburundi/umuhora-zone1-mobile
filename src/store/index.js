import { createStore } from 'vuex'

export default createStore({
  state: {
    user:null,
    url_mode:"",
    api: "/api",
    dialog_produit_shown:false,
    saved:false,
    dialog_achat_shown:false,
    active_stock_item:null,
    synchronized:false,
    
    notifs:[], read_notif:new Set(),

    valid_stocks:new Set(),
    valid_pertes:new Set(),

    deleted_commandes:new Set(), 
    deleted_stocks:new Set(), 
    deleted_pertes:new Set(),

    versements:[],
    stats_clients:[],

    roles:["owner", "gerant", "vendeur"],
    active_kiosk:null,
    cart:new Object({
      content: [],
      getTotal(){
        let tot = 0;
        for (let i = 0; i < this.content.length; i++) {
          tot += this.content[i].getTotal();
        }
        return tot;
      },
      getLength(){
        return this.content.length
      },
      find(product_id){
        for (let i = 0; i < this.content.length; i++) {
          let item = this.content[i];
          if (item.product.id == product_id) {
            return i;
          }
        }
        return -1;
      },
      getQuantite(product_id){
        let position = this.find(product_id);
        if(position>=0){
          return this.content[position].quantite;
        }
        return 0;
      },
      remove(product_id){
        let position = this.find(product_id);
        return this.content.splice(position, 1)
      },
      increase(product_id){
        let position = this.find(product_id);
        if(position>=0){
          let item = this.content[position];
          if(item.quantite<item.product.quantite)
            item.quantite++;
        }
      },
      decrease(product_id){
        let position = this.find(product_id);
        if(position>=0){
          let item = this.content[position];
          if(item.quantite>1){
            item.quantite--;
          } else {
            this.content.splice(position,1)
          }
        }
      },
      add(produit, qtt){
        if(produit.quantite==0) return;
        let position = this.find(produit.id);
        if(position>=0){
          let item = this.content[position]
          if(!!qtt){
            item.quantite = produit.quantite>=qtt?qtt:produit.quantite
          } else {
            item.quantite += produit.quantite>item.quantite?1:0
          }
        } else {
          let ikintu = new Object({
            product: produit,
            quantite : !!qtt ? qtt : 1, // si la qtt est donnée
            getTotal(){
              return this.product.prix_vente*this.quantite
            }
          });
          this.content.push(ikintu);
        }
      },
    }),
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

