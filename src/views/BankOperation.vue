<template>
  <div>
    <h2>Débit/Virement</h2>

    <!-- Champ pour le montant -->
    <div>
      <label for="amount">Montant à débiter/virer :</label>
      <input
          type="number"
          id="amount"
          v-model.number="amount"
          min="0.01"
          placeholder="Entrez un montant"
      />
    </div>

    <!-- Case à cocher pour choisir un destinataire -->
    <div>
      <input type="checkbox" id="chooseRecipient" v-model="chooseRecipient" />
      <label for="chooseRecipient">Choisir destinataire</label>
    </div>

    <!-- Champ pour le numéro de compte destinataire -->
    <div v-if="chooseRecipient">
      <label for="recipientNumber">n° de compte destinataire :</label>
      <input
          type="text"
          id="recipientNumber"
          v-model="recipientNumber"
          placeholder="Entrez un numéro de compte"
      />
    </div>

    <!-- Bouton Valider -->
    <div>
      <button v-if="amount > 0" @click="validateOperation">Valider</button>
    </div>

    <!-- Message de confirmation -->
    <div v-if="transactionUuid">
      <p>
        Opération validée avec n° : "{{ transactionUuid }}". Vous pouvez la retrouver
        dans l'historique.
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      amount: 0, // Montant à débiter ou virer
      chooseRecipient: false, // État de la case à cocher
      recipientNumber: "", // Numéro de compte destinataire
      transactionUuid: null, // UUID de la transaction validée
    };
  },
  methods: {
    ...mapActions("bank", ["createTransaction"]),
    async validateOperation() {
      try {
        const data = {
          idAccount: this.$store.state.bank.currentAccount._id,
          amount: this.amount,
          destNumber: this.chooseRecipient ? this.recipientNumber : null,
        };

        const response = await this.createTransaction(data);
        this.transactionUuid = response.data.uuid; // Affiche l'UUID après validation
      } catch (error) {
        alert("Erreur : " + error.message);
      }
    },
  },
};
</script>