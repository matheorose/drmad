import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import BankAccountService from "@/services/bankaccount.service";

export default {
    namespaced: true,
    state: () => ({
        currentAccount: null,
        accountNumberError: 0,
        accountTransactions: [],
    }),
    mutations: {
        updateCurrentAccount(state, account) {
            state.currentAccount = account;
        },
        updateAccountNumberError(state, error) {
            state.accountNumberError = error;
        },
        updateAccountTransactions(state, transactions) {
            state.accountTransactions = transactions; // Met à jour les transactions
        },
        clearAccount(state) {
            state.currentAccount = null; // Réinitialise le compte courant
            state.accountNumberError = 0; // Réinitialise les erreurs
        },
        addTransaction(state, transaction) {
            state.accountTransactions.push(transaction); // Ajouter une transaction localement
        },
    },
    actions: {
        async getAccount({ commit }, number) {
            const response = await BankAccountService.getAccount({ number });
            if (response.error === 0) {
                commit("updateCurrentAccount", response.data);

                // Récupérer les transactions liées au compte courant
                const transactionsResponse = await BankAccountService.getAccountTransactions(response.data._id);
                if (transactionsResponse.error === 0) {
                    commit("updateAccountTransactions", transactionsResponse.data); // Appelle la mutation
                } else {
                    console.error("Erreur lors de la récupération des transactions :", transactionsResponse.data);
                }
            } else {
                commit("updateAccountNumberError", -1);
            }
        },

        logout({ commit }) {
            commit("clearAccount"); // Déclenche la mutation pour déconnecter l'utilisateur
        },
        async createTransaction({ commit }, transactionData) {
            const response = await BankAccountService.createTransaction(transactionData);
            if (response.error === 0) {
                commit("addTransaction", response.data);
            } else {
                throw new Error(response.data); // Gérer les erreurs ici
            }
            return response;
        },
    },
};