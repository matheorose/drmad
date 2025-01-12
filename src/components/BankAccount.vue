<template>
  <div>
    <h2>Compte bancaire</h2>
    <div>
      <label for="account-number">n° de compte</label>
      <input type="text" id="account-number" v-model="accountNumber" />
      <button @click="validateAccount">Valider</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountNumber: "",
    };
  },
  methods: {
    validateAccount() {
      // Logic pour valider le numéro de compte
      alert(`Numéro de compte validé : ${this.accountNumber}`);
    },
  },
};
</script>