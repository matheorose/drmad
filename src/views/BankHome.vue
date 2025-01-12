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
        <!-- Message d'erreur pour numéro invalide -->
        <p v-if="accountNumberError === -1" style="color: red;">
          Numéro de compte invalide. Veuillez réessayer.
        </p>
      </div>

      <!-- Composant de droite -->
      <div>
        <button @click="goToMyAccount">Mon Compte</button>
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
      accountNumber: "", // Numéro de compte saisi
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount", "accountNumberError"]),
    isAccountValid() {
      console.log("currentAccount :", this.currentAccount);
      console.log("accountNumberError :", this.accountNumberError);
      return this.currentAccount !== null && this.accountNumberError === 0;
    },
  },
  methods: {
    ...mapActions(["getAccount"]),
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
  },
};
</script>