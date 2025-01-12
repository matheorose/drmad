<template>
  <div>
    <h1>Bienvenue à la boutique</h1>
    <!-- Si l'utilisateur n'est pas connecté, afficher le bouton login -->
    <button v-if="!isLoggedIn" @click="goToLogin">Login</button>
    <router-view v-if="!isLoggedIn" /> <!-- Affiche ShopLogin uniquement si non connecté -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ShopView",
  computed: {
    ...mapState({
      isLoggedIn: (state) => state.shop.isLoggedIn, // Récupère l'état de connexion
    }),
  },
  methods: {
    goToLogin() {
      this.$router.push("/shop/login"); // Redirection vers la page de login
    },
  },
};
</script>