import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import BankAccountService from "@/services/bankaccount.service";

export default {
    namespaced: true,
    state: () => ({
        currentAccount: null,
        accountNumberError: 0,
    }),
    mutations: {
        updateCurrentAccount(state, account) {
            state.currentAccount = account;
        },
        updateAccountNumberError(state, error) {
            state.accountNumberError = error;
        },
        clearAccount(state) {
            state.currentAccount = null; // Réinitialise le compte courant
            state.accountNumberError = 0; // Réinitialise les erreurs
        },
    },
    actions: {
        async getAccount({ commit }, number) {
            const response = await BankAccountService.getAccount({ number });
            if (response.error === 0) {
                commit("updateCurrentAccount", response.data);
                commit("updateAccountNumberError", 0);
            } else {
                commit("updateAccountNumberError", -1);
            }
        },
        logout({ commit }) {
            commit("clearAccount"); // Déclenche la mutation pour déconnecter l'utilisateur
        },
    },
};