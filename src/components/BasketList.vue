<template>
  <div>
    <h2>Mon Panier</h2>
    <ul>
      <li v-for="(item, index) in basket.items" :key="index">
        <div>
          <span>{{ item.item.name }} (x{{ item.amount }})</span>
          <button @click="removeItem(item.item._id)">Supprimer</button>
        </div>
      </li>
    </ul>

    <div v-if="basket.items.length > 0">
      <button @click="clearBasket">Vider le panier</button>
      <button @click="buy">Acheter</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ShopService from '../services/shop.service';

export default {
  computed: {
    ...mapState({
      basket: state => state.basket,
      shopUser: state => state.shopUser,
    }),
  },
  methods: {
    async removeItem(itemId) {
      // Appel de l'action Vuex pour supprimer l'item
      await this.$store.dispatch('removeItemFromBasket', itemId);
    },
    async clearBasket() {
      // Appel de l'action Vuex pour vider le panier
      await this.$store.dispatch('clearBasket');
    },
    async buy() {
      // Création de la commande à partir du panier
      const order = {
        items: this.basket.items.map(item => ({
          item: {
            name: item.item.name,
            description: item.item.description,
            price: item.item.price,
            promotion: item.item.promotion,
            object: item.item.object,
          },
          amount: item.amount,
        })),
      };

      // Appel à la méthode de service pour créer la commande
      const response = await ShopService.createOrder(this.shopUser._id, order);
      if (response.error === 0) {
        // Vidage du panier
        await this.clearBasket();
        // Redirection vers la page de paiement avec l'uuid de la commande
        this.$router.push(`/shop/pay/${response.data.uuid}`);
      } else {
        console.error(response.data);
      }
    },
  },
  created() {
    // Charger le panier de l'utilisateur au démarrage
    if (this.shopUser) {
      this.$store.dispatch('fetchBasket', this.shopUser._id);
    }
  },
};
</script>