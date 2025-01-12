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
        <td>{{ formatDate(transaction.date.$date) }}</td>
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
      required: true, // Assure que les transactions sont fournies
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(); // Formate la date
    },
    viewDetails(transaction) {
      alert(`Transaction: \nMontant: ${transaction.amount} €\nDate: ${this.formatDate(transaction.date.$date)}`);
    },
  },
};
</script>