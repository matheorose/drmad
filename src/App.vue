<template>
  <div id="app">
    <NavBar :titles="titles" @menu-clicked="goTo($event)" />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";

export default {
  name: "App",
  components: { NavBar },
  data: () => ({
    titles: [
      { text: "Boutique", color: "blue" },
      { text: "Banque", color: "red" },
    ],
  }),
  methods: {
    goTo(index) {
      if (index === 0) {
        this.$router.push("/shop"); // Navigue vers la boutique
      } else if (index === 1) {
        this.$router.push("/bank/account"); // Navigue vers la banque
      }
    },
  },
};
</script>

<style>
/* Ajoutez ici vos styles globaux, si nécessaire */
</style>