<template>
  <div class="container my-4">
    <!-- En-tête : titre -->
    <div class="row">
      <div class="col-12">
        <h1>Les virus</h1>
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
          <td>{{ virus.name }}</td>
          <td>{{ virus.price }}</td>
          <td>{{ virus.stock }}</td>
          <td>
            <!-- Si le virus a un tableau de promotions, on l'affiche -->
            <div v-if="virus.promotion && virus.promotion.length">
              <ul class="mb-0">
                <li
                    v-for="(promo, iPromo) in virus.promotion"
                    :key="iPromo"
                >
                  <strong>-{{ promo.discount }}%</strong> x {{ promo.amount }}
                </li>
              </ul>
            </div>
            <div v-else>
              Aucune promo
            </div>
          </td>
          <td>
            <!-- Champ pour saisir la quantité -->
            <input
                type="number"
                class="form-control form-control-sm"
                min="1"
                v-model.number="quantities[index]"
                @focus="ensureQuantityIsNotNull(index)"
            />
          </td>
          <td>
            <!-- Bouton "Ajouter au panier" -->
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

      <!-- Bouton pour tout ajouter d'un coup -->
      <div class="text-right">
        <button class="btn btn-success" @click="addAllToBasket">
          Ajouter tout
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
      // Champs de filtre
      searchName: "",
      searchMinPrice: null,
      searchMaxPrice: null,
      searchMinStock: null,
      searchMaxStock: null,

      // Tableau des quantités saisies (chaque index correspond à un virus filtré)
      quantities: [],
    };
  },
  computed: {
    // States du module "shop"
    ...mapState("shop", {
      viruses: (state) => state.viruses,
      shopUser: (state) => state.shopUser,
      basket: (state) => state.basket, // on peut conserver l'accès au basket si on souhaite le synchroniser
    }),

    /**
     * On filtre la liste des viruses en fonction des champs de recherche
     */
    filteredViruses() {
      if (!Array.isArray(this.viruses)) {
        return [];
      }

      let results = this.viruses;

      // Filtre par nom
      if (this.searchName.trim() !== "") {
        const lowerName = this.searchName.toLowerCase();
        results = results.filter((v) =>
            v.name.toLowerCase().includes(lowerName)
        );
      }

      // Filtre par prix min
      if (this.searchMinPrice !== null && !isNaN(this.searchMinPrice)) {
        results = results.filter((v) => v.price >= this.searchMinPrice);
      }

      // Filtre par prix max
      if (this.searchMaxPrice !== null && !isNaN(this.searchMaxPrice)) {
        results = results.filter((v) => v.price <= this.searchMaxPrice);
      }

      // Filtre par stock min
      if (this.searchMinStock !== null && !isNaN(this.searchMinStock)) {
        results = results.filter((v) => v.stock >= this.searchMinStock);
      }

      // Filtre par stock max
      if (this.searchMaxStock !== null && !isNaN(this.searchMaxStock)) {
        results = results.filter((v) => v.stock <= this.searchMaxStock);
      }

      // On réinitialise le tableau "quantities" pour qu'il
      // soit toujours de la même taille que "results"
      this.syncQuantitiesWithResults(results);

      return results;
    },
  },
  methods: {
    ...mapActions("shop", [
      "getAllViruses",      // Action pour charger la liste de virus
      "fetchBasket",        // Action pour charger le panier (au besoin)
      "updateBasket",       // Action pour mettre à jour le panier (au besoin)
    ]),

    /**
     * Ajoute l'élément "virus" au panier avec la "qty" spécifiée
     */
    addItemToBasketMethod(virus, qty) {
      // Sécuriser la quantité
      const amount = qty && qty > 0 ? qty : 1;
      // Commit la mutation "addToBasket" du module "shop"
      this.$store.commit("shop/addToBasket", {
        item: virus,
        amount: amount,
      });
    },

    /**
     * Ajoute tous les articles filtrés au panier
     * (avec la quantité indiquée pour chacun)
     */
    addAllToBasket() {
      this.filteredViruses.forEach((virus, index) => {
        const amount = this.quantities[index] || 1;
        this.$store.commit("shop/addToBasket", {
          item: virus,
          amount: amount,
        });
      });
    },

    /**
     * On s'assure que la quantité ne soit pas nulle quand on clique
     */
    ensureQuantityIsNotNull(index) {
      if (!this.quantities[index]) {
        this.$set(this.quantities, index, 1);
      }
    },

    /**
     * Ajuste le tableau "quantities" pour qu'il corresponde
     * à la taille de "results"
     */
    syncQuantitiesWithResults(results) {
      // Si filteredViruses est plus grand que quantities,
      // on pousse des 1 par défaut
      if (results.length > this.quantities.length) {
        for (let i = this.quantities.length; i < results.length; i++) {
          this.quantities.push(1);
        }
      }
      // Si on a des quantités en trop, on les enlève
      else if (results.length < this.quantities.length) {
        this.quantities.splice(results.length);
      }
    },
  },

  /**
   * Lifecycle
   */
  created() {
    // Récupération initiale de la liste des virus
    this.getAllViruses()
        .then(() => {
          if (!this.viruses || this.viruses.length === 0) {
            console.warn("Aucun virus récupéré.");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des viruses :", error);
        });

    // Si on a un utilisateur logué, on peut charger le panier
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
    // Dès que le panier change, on peut enregistrer (updateBasket) si besoin
    basket: {
      handler() {
        // Si on est logué, on peut persister le panier sur le serveur
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
  vertical-align: middle; /* Centrer le contenu verticalement */
}

thead th {
  text-transform: capitalize;
}

.card {
  background-color: #fafafa;
  border: 1px solid #ddd;
}
</style>
