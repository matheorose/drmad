<template>
  <div>
    <h2>Mon Panier</h2>
    <div v-if="isLoading">
      <p>Chargement du panier...</p>
    </div>
    <div v-else-if="!basket || !basket.items || basket.items.length === 0">
      <p>Votre panier est vide.</p>
    </div>
    <ul v-else>
      <li v-for="(item, index) in (basket.items || [])" :key="index">
        <div>
          <span>{{ item.item.name }} (x{{ item.amount }})</span>
          <button @click="removeItem(item.item._id)">Supprimer</button>
        </div>
      </li>
    </ul>
    <div v-if="basket && basket.items && basket.items.length > 0">
      <button @click="clearBasket">Vider le panier</button>
      <button @click="buy">Acheter</button>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";
import ShopService from "../services/shop.service";

export default {
  data() {
    return {
      isLoading: true,
    };
  },
  computed: {
    ...mapState({
      basket: (state) => state.basket, // Récupère le panier depuis le store
      shopUser: (state) => state.shopUser, // Récupère l'utilisateur depuis le store
    }),
  },
  methods: {
    async removeItem(itemId) {
      try {
        await this.$store.dispatch("removeItemFromBasket", itemId);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'article :", error);
      }
    },
    async clearBasket() {
      try {
        await this.$store.dispatch("clearBasket");
      } catch (error) {
        console.error("Erreur lors du vidage du panier :", error);
      }
    },
    async buy() {
      try {
        if (!this.basket || !this.basket.items) {
          console.error("Le panier est vide ou non défini.");
          return;
        }

        const order = {
          items: this.basket.items.map((item) => ({
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

        const response = await ShopService.createOrder(this.shopUser._id, order);
        if (response.error === 0) {
          await this.clearBasket();
          this.$router.push(`/shop/pay/${response.data.uuid}`);
        } else {
          console.error("Erreur lors de la création de la commande :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de l'achat :", error);
      }
    },
  },
  created() {

    console.log("Viruses dans BasketList.vue :", this.viruses);
    console.log("Basket dans BasketList.vue :", this.basket);
    this.isLoading = true;
    this.$store.commit("setBasket", { items: [] });
    if (this.shopUser) {
      this.$store
          .dispatch("fetchBasket", this.shopUser._id)
          .then(() => {
            console.log("Panier chargé avec succès :", this.basket);
          })
          .catch((error) => {
            console.error("Erreur lors du chargement du panier :", error);
            this.$store.commit("setBasket", { items: [] });
          })
          .finally(() => {
            this.isLoading = false;
          });
    } else {
      console.warn("Aucun utilisateur connecté. Panier par défaut.");
      this.isLoading = false;
    }
  },
};
</script>
