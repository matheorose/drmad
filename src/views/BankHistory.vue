<template>
  <div>
    <h2>Historique des transactions</h2>
    <hr>

    <!-- Case à cocher pour filtrer par date -->
    <div>
      <input type="checkbox" id="filterByDate" v-model="filterByDate" />
      <label for="filterByDate">Filtrer par date</label>
    </div>

    <!-- Champs de texte pour la plage de dates et bouton réinitialiser -->
    <div v-if="filterByDate">
      <label for="startDate">Du :</label>
      <input type="date" id="startDate" v-model="startDate" />

      <label for="endDate">Au :</label>
      <input type="date" id="endDate" v-model="endDate" />

      <button @click="resetFilter">Réinitialiser</button>
    </div>
    <hr>

    <table>
      <thead>
      <tr>
        <th>Montant</th>
        <th>Date</th>
        <th>Détails</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transaction in filteredTransactions" :key="transaction._id">
        <td>{{ transaction.amount }} €</td>
        <td>{{ transaction.date ? formatDate(transaction.date.$date) : "Date inconnue" }}</td>
        <td>
          <button @click="viewDetails(transaction)">Détails</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filterByDate: false, // État de la case à cocher
      startDate: "", // Date de début
      endDate: "", // Date de fin
    };
  },
  computed: {
    filteredTransactions() {
      return this.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date.$date);

        if (this.startDate && !this.endDate) {
          return transactionDate >= new Date(this.startDate);
        }

        if (!this.startDate && this.endDate) {
          return transactionDate <= new Date(this.endDate);
        }

        if (this.startDate && this.endDate) {
          return (
              transactionDate >= new Date(this.startDate) &&
              transactionDate <= new Date(this.endDate)
          );
        }

        return true; // Si aucun filtre, retourne toutes les transactions
      });
    },
  },
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleString() : "Date inconnue";
    },
    viewDetails(transaction) {
      alert(
          `Transaction:\nID: ${transaction._id}\nMontant: ${transaction.amount} €\nDate: ${
              transaction.date ? this.formatDate(transaction.date.$date) : "Date inconnue"
          }`
      );
    },
    resetFilter() {
      this.startDate = "";
      this.endDate = "";
      this.filterByDate = false;
    },
  },
};
</script>