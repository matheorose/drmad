import Vue from "vue";
import Vuex from "vuex";
import ShopService from "../services/shop.service";

Vue.use(Vuex);

export default {

    namespaced: true,

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
            state.isLoggedIn = false;
        },
        updateViruses(state, viruses) {
            console.log("Mise à jour des viruses avant :", state.viruses);
            state.viruses = viruses;
            console.log("Mise à jour des viruses après :", state.viruses);
        },
        setBasket(state, basket) {
            Vue.set(state, "basket", basket || { items: [] });
        },
        addToBasket(state, { item, amount }) {
            const existingItem = state.basket.items.find((i) => i.item._id === item._id);
            if (existingItem) {
                existingItem.amount += amount;
            } else {
                state.basket.items.push({ item, amount });
            }

            console.log('Article ajouté au panier :', { item, amount });
            // Journalisation de l'état complet du panier
            console.log('État actuel du panier :', state.basket);
        },
        removeFromBasket(state, itemId) {
            state.basket.items = state.basket.items.filter((i) => i.item._id !== itemId);
        },
        clearBasket(state) {
            state.basket.items = [];
        },
    },
    actions: {
        async getAllViruses({ commit }) {
            try {
                let response = await ShopService.getAllViruses();
                console.log("Réponse de getAllViruses :", response);
                if (response.error === 0 && Array.isArray(response.data)) {
                    console.log("Viruses récupérés avec succès :", response.data);
                    commit("updateViruses", response.data);
                } else {
                    console.error("Erreur lors de la récupération des viruses :", response.data);
                    commit("updateViruses", []); // Défaut si les données ne sont pas valides
                }
            } catch (error) {
                console.error("Erreur réseau lors de la récupération des viruses :", error);
                commit("updateViruses", []); // Défaut en cas d'erreur
            }
        },
        async fetchBasket({ commit }, userId) {
            try {
                let response = await ShopService.getUserBasket(userId);
                if (response.error === 0 && response.data && Array.isArray(response.data.items)) {
                    commit("setBasket", response.data);
                } else {
                    console.error("Erreur lors de la récupération du panier:", response.data);
                    commit("setBasket", { items: [] }); // Défaut en cas d'échec
                }
            } catch (error) {
                console.error("Erreur réseau lors de la récupération du panier:", error);
                commit("setBasket", { items: [] }); // Défaut en cas d'échec réseau
            }
        },
        async updateBasket({ commit }, { userId, basket }) {
            try {
                await ShopService.updateUserBasket(userId, basket);
                commit("setBasket", basket);
            } catch (error) {
                console.error("Erreur lors de la mise à jour du panier:", error);
            }
        },
        async shopLogin({ commit }, { username, password }) {
            try {
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
                throw error;
            }
        },
        logout({ commit }) {
            commit("logoutUser");
        },
    },
};
