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
        <component
            :is="currentComponent"
            v-bind="currentComponent === BankHistory ? { transactions: accountTransactions } : {}"
        />
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
import {mapActions, mapState} from "vuex";
import BankAccount from "./BankAccountView.vue";
import BankOperation from "./BankOperation.vue";
import BankHistory from "@/views/BankHistory.vue";

export default {
  data() {
    return {
      currentComponent: null, // Composant affiché au centre
    };
  },
  computed: {
    BankHistory() {
      return BankHistory
    },
    ...mapState("bank", ["currentAccount", "accountNumberError", "accountTransactions"]),
    isAccountValid() {
      return this.currentAccount !== null && this.accountNumberError === 0;
    },
  },
  methods: {
    ...mapActions("bank", ["logout"]),
    showBalance() {
      alert(`Solde disponible : ${this.currentAccount.amount} €`);
    },
    makeTransaction() {
      this.currentComponent = BankOperation; // Affiche BankOperation
    },
    showHistory() {
      this.currentComponent = BankHistory; // Affiche BankHistory
    },
    goToMyAccount() {
      this.currentComponent = BankAccount; // Affiche BankAccount
    },
    handleLogout() {
      this.logout(); // Appelle l'action logout du store
      this.currentComponent = null; // Réinitialise la vue centrale
    },
  },
  components: {
    BankAccount,
    BankOperation,
    BankHistory,
  },
};
</script>