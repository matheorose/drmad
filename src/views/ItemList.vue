<template>
  <div>
    <h1>Liste des items</h1>
    <!-- Vérification que 'filterViruses' contient des éléments -->
    <CheckedList
        :data="filterViruses"
        :fields="['name', 'price', 'promotion']"
        :item-check="false"
        :item-button="{ show: true, text: 'Ajouter au panier' }"
        :list-button="{ show: true, text: 'Ajouter tout' }"
        :item-amount="true"
        @item-button-clicked="addItemToBasket"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CheckedList from "@/components/CheckedList";

export default {
  name: "ItemsList",
  components: { CheckedList },
  data() {
    return {
      selected: [],
    };
  },
  computed: {
    ...mapState(["viruses", "shopUser", "basket"]),
    filterViruses() {
      return this.viruses || []; // Assure que viruses est un tableau
    },
  },
  methods: {
    ...mapActions([
      "addItemToBasket",
      "removeItemFromBasket",
      "clearBasket",
      "getAllViruses",
      "fetchBasket"
    ]),

    async addItemToBasketMethod(index, amount) {
      const virus = this.filterViruses[index];
      await this.addItemToBasket({ item: virus, amount });
    },

    async removeItemFromBasketMethod(itemId) {
      await this.removeItemFromBasket(itemId);
    },

    async clearBasketMethod() {
      await this.clearBasket();
    },

    async updateBasket() {
      if (this.shopUser) {
        await this.fetchBasket(this.shopUser._id);
      }
    },
  },
  created() {
    // Vérifier si l'utilisateur est connecté avant de récupérer les données
    if (this.shopUser) {
      // Récupération des viruses et du panier dès que l'utilisateur est connecté
      this.getAllViruses()
          .then(() => {
            console.log("Viruses récupérés avec succès");
          })
          .catch((error) => {
            console.log("Erreur lors de la récupération des viruses", error);
          });

      this.fetchBasket(this.shopUser._id)
          .then(() => {
            console.log("Panier récupéré avec succès");
          })
          .catch((error) => {
            console.log("Erreur lors de la récupération du panier", error);
          });
    }
  },
  watch: {
    basket: {
      handler() {
        if (this.shopUser) {
          this.updateBasket();
        }
      },
      immediate: true,
    },
  },
};
</script>