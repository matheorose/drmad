<template>
  <div>
    <h2>Historique des transactions</h2>

    <table>
      <thead>
      <tr>
        <th>Montant</th>
        <th>Date</th>
        <th>Détails</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="transaction in transactions" :key="transaction._id">
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
  methods: {
    formatDate(date) {
      return date ? new Date(date).toLocaleString() : "Date inconnue"; // Vérifie la validité de la date
    },
    viewDetails(transaction) {
      alert(
          `Transaction:\nMontant: ${transaction.amount} €\nDate: ${
              transaction.date ? this.formatDate(transaction.date.$date) : "Date inconnue"
          }`
      );
    },
  },
};
</script>