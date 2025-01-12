<template>
  <div>
    <h2>Payer une commande</h2>

    <div>
      <label for="order-id">ID de la commande :</label>
      <input
          type="text"
          id="order-id"
          v-model="orderId"
          :placeholder="orderIdProp ? orderIdProp : 'Entrez l\'ID de la commande'"
      />
    </div>

    <button @click="payOrder">Payer</button>
  </div>
</template>

<script>
import ShopService from '../services/shop.service';

export default {
  props: {
    orderIdProp: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      orderId: this.orderIdProp || '', // Si une ID est passée en prop, l'utiliser
    };
  },
  methods: {
    async payOrder() {
      // Vérification si l'ID correspond à une commande existante de l'utilisateur
      const response = await ShopService.payOrder(this.$store.state.shopUser._id, this.orderId);
      if (response.error === 0) {
        // Si la commande est trouvée et validée, rediriger vers la page des commandes de l'utilisateur
        this.$router.push('/shop/orders');
      } else {
        console.error('Erreur : ' + response.data);
      }
    },
  },
};
</script>