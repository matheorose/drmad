import Vue from 'vue'
import Vuex from 'vuex'
import ShopService from '../services/shop.service'

Vue.use(Vuex)

export default({
    state: () => ({
        shopUser: null,
        viruses: [],
        basket: { items: [] },
        isLoggedIn: false,
    }),
    mutations: {
        updateShopUser(state, user) {
            state.shopUser = user;
            state.isLoggedIn = !!user;
        },
        logoutUser(state) {
            state.shopUser = null;
            state.isLoggedIn = false; // Déconnexion
        },
        updateViruses(state, viruses) {
            state.viruses = viruses;
        },
        setBasket(state, basket) {
            state.basket = basket || { items: [] };
        },
        addToBasket(state, { item, amount }) {
            const existingItem = state.basket.items.find(i => i.item === item);
            if (existingItem) {
                existingItem.amount += amount;
            } else {
                state.basket.items.push({ item, amount });
            }
        },


        removeFromBasket(state, itemId) {
            state.basket.items = state.basket.items.filter(i => i.item !== itemId);
        },
        clearBasket(state) {
            state.basket.items = [];
        },
    },
    actions: {
        // Action pour récupérer tous les viruses
        async getAllViruses({ commit }) {
            try {
                console.log("Récupération des viruses...");
                let response = await ShopService.getAllViruses();
                if (response.error === 0 && Array.isArray(response.data)) {
                    commit("updateViruses", response.data);
                } else {
                    console.log("Erreur lors de la récupération des viruses:", response.data);
                }
            } catch (error) {
                console.error("Erreur réseau lors de la récupération des viruses:", error);
            }
        },

        // Action pour récupérer le panier de l'utilisateur
        async fetchBasket({ commit }, userId) {
            try {
                let response = await ShopService.getUserBasket(userId);
                if (response.error === 0) {
                    commit("setBasket", response.data || { items: [] });
                } else {
                    console.log("Erreur lors de la récupération du panier:", response.data);
                    commit("setBasket", { items: [] });
                }
            } catch (error) {
                console.error("Erreur réseau lors de la récupération du panier:", error);
                commit("setBasket", { items: [] });
            }
        },

        // Action pour mettre à jour le panier
        async updateBasket({ commit }, { userId, basket }) {
            try {
                await ShopService.updateUserBasket(userId, basket);
                commit("setBasket", basket);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du panier:", error);
            }
        },

        // Action pour la connexion de l'utilisateur
        async shopLogin({ commit }, { username, password }) {
            try {
                // Simuler la connexion ici
                if (username === "drmad" && password === "drmad") {
                    const user = { username, _id: "user-drmad" };
                    commit("updateShopUser", user);
                    return user;
                } else {
                    commit("updateShopUser", null);
                    throw new Error("Identifiants invalides");
                }
            } catch (error) {
                commit("updateShopUser", null);
                throw error;  // Relancer l'erreur pour que l'appelant puisse la gérer
            }
        },

        // Action pour la déconnexion de l'utilisateur
        logout({ commit }) {
            commit("logoutUser");
        },
    }
})