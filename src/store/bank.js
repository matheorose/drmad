import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import BankAccountService from "@/services/bankaccount.service";

export default {
    namespaced: true,
    state: () => ({
        currentAccount: null, // Compte connecté
        accountNumberError: 0, // Erreur (1 = valide, -1 = invalide)
    }),
    mutations: {
        updateCurrentAccount(state, account) {
            console.log("Mutation updateCurrentAccount appelée avec :", account);
            state.currentAccount = account; // Affectation directe pour conserver la réactivité
        },
        updateAccountNumberError(state, error) {
            console.log("Mutation updateAccountNumberError appelée avec :", error);
            state.accountNumberError = error;
        },
    },
    actions: {
        async getAccount({ commit }, number) {
            console.log("getAccount appelé avec le numéro :", number); // Vérifie l'entrée
            const response = await BankAccountService.getAccount({ number });
            console.log("Réponse de getAccount :", response); // Vérifie la réponse de l'API

            if (response.error === 0) {
                commit("updateCurrentAccount", response.data);
                commit("updateAccountNumberError", 0); // Compte valide
            } else {
                commit("updateAccountNumberError", -1); // Compte invalide
            }
        },
    },
};