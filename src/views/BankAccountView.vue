<template>
  <div>
    <div>
      <div v-if="!isAccountValid">
        <label for="account-number">n° de compte</label>
        <input type="text" id="account-number" v-model="accountNumber" />
        <button @click="validateAccount">Valider</button>
        <p v-if="accountNumberError === -1" style="color: red;">
          Numéro de compte invalide. Veuillez réessayer.
        </p>
      </div>
      <div v-else>
        <p>Connecté au compte {{ currentAccount.number }}</p>
        <p>Solde disponible : {{ currentAccount.amount }} €</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      accountNumber: "",
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount", "accountNumberError"]),
    isAccountValid() {
      return this.currentAccount !== null && this.accountNumberError === 0;
    },
  },
  methods: {
    ...mapActions("bank", ["getAccount"]),
    async validateAccount() {
      await this.getAccount(this.accountNumber);
    },
  },
};
</script>