<template>
  <div>
    <h2>Solde Actuel</h2>
    <p>Votre solde disponible est :</p>
    <h3>{{ currentAccount.amount }} €</h3>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("bank", ["currentAccount"]), // Récupère l'état du compte actuel
  },
};
</script>