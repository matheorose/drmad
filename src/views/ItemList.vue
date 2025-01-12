<template>
  <div class="container my-4">
    <!-- En-tête : titre -->
    <div class="row">
      <div class="col-12">
        <h1>Les virus :</h1>
      </div>
    </div>

    <!-- Formulaire de filtre -->
    <div class="card p-3 my-3">
      <div class="form-row">
        <div class="col-md-2 mb-2">
          <label for="filterName">Nom :</label>
          <input
              type="text"
              class="form-control"
              id="filterName"
              v-model="searchName"
              placeholder="Ex: covid"
          />
        </div>
        <div class="col-md-2 mb-2">
          <label for="priceMin">Prix min :</label>
          <input
              type="number"
              class="form-control"
              id="priceMin"
              v-model.number="searchMinPrice"
              placeholder="0"
          />
        </div>
        <div class="col-md-2 mb-2">
          <label for="priceMax">Prix max :</label>
          <input
              type="number"
              class="form-control"
              id="priceMax"
              v-model.number="searchMaxPrice"
              placeholder="1000"
          />
        </div>
        <div class="col-md-2 mb-2">
          <label for="stockMin">Stock min :</label>
          <input
              type="number"
              class="form-control"
              id="stockMin"
              v-model.number="searchMinStock"
              placeholder="0"
          />
        </div>
        <div class="col-md-2 mb-2">
          <label for="stockMax">Stock max :</label>
          <input
              type="number"
              class="form-control"
              id="stockMax"
              v-model.number="searchMaxStock"
              placeholder="9999"
          />
        </div>
      </div>
    </div>

    <!-- Zone d'affichage : si aucun virus, message -->
    <div v-if="!viruses || viruses.length === 0" class="alert alert-info">
      Chargement des données...
    </div>
    <!-- Sinon, on affiche le tableau filtré -->
    <div v-else>
      <table class="table table-hover">
        <thead class="thead-light">
        <tr>
          <th></th> <!-- Colonne pour la case à cocher -->
          <th>Nom</th>
          <th>Prix</th>
          <th>Stock</th>
          <th>Promotions</th>
          <th style="width:120px;">Quantité</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <!-- On parcourt la liste filtrée -->
        <tr v-for="(virus, index) in filteredViruses" :key="virus._id">
          <td>
            <!-- Case à cocher pour la sélection multiple -->
            <input type="checkbox" v-model="selectedViruses" :value="virus" />
          </td>
          <td>{{ virus.name }}</td>
          <td>{{ virus.price }}</td>
          <td>{{ virus.stock }}</td>
          <td>
            <div v-if="virus.promotion && virus.promotion.length">
              <ul class="mb-0">
                <li v-for="(promo, iPromo) in virus.promotion" :key="iPromo">
                  <strong>-{{ promo.discount }}%</strong> x {{ promo.amount }}
                </li>
              </ul>
            </div>
            <div v-else>
              Aucune promo
            </div>
          </td>
          <td>
            <input
                type="number"
                class="form-control form-control-sm"
                min="1"
                v-model.number="quantities[index]"
                @focus="ensureQuantityIsNotNull(index)"
            />
          </td>
          <td>
            <button
                class="btn btn-sm btn-primary"
                @click="addItemToBasketMethod(virus, quantities[index])"
            >
              Ajouter
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="text-right">
        <button class="btn btn-success" @click="addAllToBasket">
          Ajouter tout
        </button>
        <button class="btn btn-info ml-2" @click="addSelectedToBasket">
          Ajouter sélectionnés
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "ItemList",
  data() {
    return {
      searchName: "",
      searchMinPrice: null,
      searchMaxPrice: null,
      searchMinStock: null,
      searchMaxStock: null,
      quantities: [],
      selectedViruses: []  // Stocke les virus sélectionnés
    };
  },
  computed: {
    ...mapState("shop", {
      viruses: (state) => state.viruses,
      shopUser: (state) => state.shopUser,
      basket: (state) => state.basket,
    }),
    filteredViruses() {
      if (!Array.isArray(this.viruses)) {
        return [];
      }

      let results = this.viruses;

      if (this.searchName.trim() !== "") {
        const lowerName = this.searchName.toLowerCase();
        results = results.filter((v) =>
            v.name.toLowerCase().includes(lowerName)
        );
      }

      if (this.searchMinPrice !== null && !isNaN(this.searchMinPrice)) {
        results = results.filter((v) => v.price >= this.searchMinPrice);
      }

      if (this.searchMaxPrice !== null && !isNaN(this.searchMaxPrice)) {
        results = results.filter((v) => v.price <= this.searchMaxPrice);
      }

      if (this.searchMinStock !== null && !isNaN(this.searchMinStock)) {
        results = results.filter((v) => v.stock >= this.searchMinStock);
      }

      if (this.searchMaxStock !== null && !isNaN(this.searchMaxStock)) {
        results = results.filter((v) => v.stock <= this.searchMaxStock);
      }

      this.syncQuantitiesWithResults(results);
      return results;
    },
  },
  methods: {
    ...mapActions("shop", [
      "getAllViruses",
      "fetchBasket",
      "updateBasket",
    ]),

    addItemToBasketMethod(virus, qty) {
      const amount = qty && qty > 0 ? qty : 1;
      this.$store.commit("shop/addToBasket", {
        item: virus,
        amount: amount,
      });
    },

    addAllToBasket() {
      this.filteredViruses.forEach((virus, index) => {
        const amount = this.quantities[index] || 1;
        this.$store.commit("shop/addToBasket", {
          item: virus,
          amount: amount,
        });
      });
    },

    ensureQuantityIsNotNull(index) {
      if (!this.quantities[index]) {
        this.$set(this.quantities, index, 1);
      }
    },

    syncQuantitiesWithResults(results) {
      if (results.length > this.quantities.length) {
        for (let i = this.quantities.length; i < results.length; i++) {
          this.quantities.push(1);
        }
      } else if (results.length < this.quantities.length) {
        this.quantities.splice(results.length);
      }
    },

    addSelectedToBasket() {
      this.selectedViruses.forEach((virus) => {
        const index = this.filteredViruses.findIndex(v => v._id === virus._id);
        const amount = index !== -1 ? (this.quantities[index] || 1) : 1;
        this.$store.commit("shop/addToBasket", {
          item: virus,
          amount: amount,
        });
      });
      // Réinitialiser la sélection après l'ajout
      this.selectedViruses = [];
    },
  },
  created() {
    this.getAllViruses()
        .then(() => {
          if (!this.viruses || this.viruses.length === 0) {
            console.warn("Aucun virus récupéré.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des viruses :", error);
        });

    if (this.shopUser && this.shopUser._id) {
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
          this.updateBasket({
            userId: this.shopUser._id,
            basket: this.basket,
          });
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.table td {
  vertical-align: middle;
}

thead th {
  text-transform: capitalize;
}

.card {
  background-color: #fafafa;
  border: 1px solid #ddd;
}
</style>
