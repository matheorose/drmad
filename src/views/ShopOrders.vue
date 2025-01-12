<template>
  <div>
    <h2>Mes Commandes</h2>
    <ul>
      <li v-for="order in orders" :key="order.uuid">
        <div>
          <p><strong>Montant :</strong> {{ order.total }}€</p>
          <p><strong>État :</strong> {{ order.status }}</p>

          <div v-if="order.status === 'waiting_payment'">
            <button @click="payOrder(order.uuid)">Payer</button>
            <button @click="cancelOrder(order.uuid)">Annuler</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import ShopService from '../services/shop.service';

export default {
  data() {
    return {
      orders: [],
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const response = await ShopService.getOrders(this.$store.state.shopUser._id);
      if (response.error === 0) {
        this.orders = response.data;
      } else {
        console.error('Erreur de récupération des commandes:', response.data);
      }
    },
    payOrder(orderId) {
      this.$router.push(`/shop/pay/${orderId}`);
    },
    async cancelOrder(orderId) {
      const response = await ShopService.cancelOrder(this.$store.state.shopUser._id, orderId);
      if (response.error === 0) {
        this.fetchOrders();  // Réactualiser la liste des commandes
      } else {
        console.error('Erreur d\'annulation de la commande:', response.data);
      }
    },
  },
};
</script>