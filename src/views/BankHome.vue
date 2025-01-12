<template>
  <div>
    <!-- Titre principal -->
    <h1>Banque</h1>

    <!-- Ligne horizontale -->
    <hr />

    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <!-- Composant de gauche -->
      <div>
        <h3>Opérations:</h3>
        <button
            :disabled="!isAccountValid"
            :style="!isAccountValid ? { backgroundColor: '#d3d3d3', cursor: 'not-allowed' } : {}"
            @click="showBalance"
        >
          Solde
        </button>
        <button
            :disabled="!isAccountValid"
            :style="!isAccountValid ? { backgroundColor: '#d3d3d3', cursor: 'not-allowed' } : {}"
            @click="makeTransaction"
        >
          Débit/Virement
        </button>

        <h3>États :</h3>
        <button
            :disabled="!isAccountValid"
            :style="!isAccountValid ? { backgroundColor: '#d3d3d3', cursor: 'not-allowed' } : {}"
            @click="showHistory"
        >
          Historique
        </button>
      </div>

      <!-- Composant central -->
      <div>
        <h1>Bienvenu dans la banque</h1>
        <component :is="currentComponent" />
      </div>

      <!-- Composant de droite -->
      <div>
        <button v-if="isAccountValid" @click="handleLogout">Déconnexion</button>
        <button v-else @click="goToMyAccount">Mon Compte</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import BankAccount from "./BankAccountView.vue";

export default {
  data() {
    return {
      currentComponent: null,
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount", "accountNumberError"]),
    isAccountValid() {
      return this.currentAccount !== null && this.accountNumberError === 0;
    },
  },
  methods: {
    ...mapActions("bank", ["getAccount", "logout"]),
    showBalance() {
      alert(`Solde disponible : ${this.currentAccount.amount} €`);
    },
    makeTransaction() {
      alert("Débit ou virement à réaliser.");
    },
    showHistory() {
      alert("Historique des transactions.");
    },
    goToMyAccount() {
      this.currentComponent = BankAccount;
    },
    handleLogout() {
      // Appelle l'action du store pour déconnecter
      this.logout();
      // Réinitialise la vue centrale
      this.currentComponent = null;
    },
  },
};
</script>