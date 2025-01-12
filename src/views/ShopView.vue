<template>
  <div>
    <h1>Bienvenue à la boutique</h1>
    <!-- Si l'utilisateur n'est pas connecté -->
    <div v-if="!isLoggedIn">
      <button @click="goToLogin">Login</button>
      <router-view /> <!-- Affiche ShopLogin uniquement si non connecté -->
    </div>
    <!-- Si l'utilisateur est connecté -->
    <div v-else>
      <button @click="goToBuy">Buy</button>
      <button @click="goToPay">Pay</button>
      <button @click="goToOrders">Orders</button>
      <button @click="logout">Logout</button>
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ShopView",
  computed: {
    ...mapState({
      isLoggedIn: (state) => state.shop.isLoggedIn,
    }),
  },
  methods: {
    goToLogin() {
      this.$router.push("/shop/login");
    },
    goToBuy() {
      this.$router.push("/shop/buy");
    },
    goToPay() {
      this.$router.push("/shop/pay");
    },
    goToOrders() {
      this.$router.push("/shop/orders");
    },
    logout() {
      this.$router.push("/shop/logout");
    },

  },
};
</script>
