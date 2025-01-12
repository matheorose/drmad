<template>
  <div>
    <p v-for="(item, indexRow) in data" :key="indexRow">
      <input type="checkbox"
             v-if="itemCheck"
             :checked="checked[indexRow]"
             @click="$emit('checked-changed',indexRow)"
      >
      <span v-for="(field, indexCol) in fields" :key="indexCol">
        {{item[field]}}
      </span>
      <input
          v-if="itemAmount"
          type="number"
          v-model.number="amounts[indexRow]"
          min="1"
          :placeholder="'Qty'"
      >
      <button v-if="itemButton && itemButton.show" color="grey" @click="$emit('item-button-clicked',indexRow)">{{itemButton.text}}</button>
    </p>
    <button
        v-if="listButton && listButton.show"
        @click="handleListButtonClick">
      {{ listButton.text }}
    </button>
  </div>
</template>

<script>
export default {
  name: "CheckedList",
  props: {
    data: Array, // les données sources
    fields: Array, // le tableau contenant le nom des champs à afficher
    itemCheck: Boolean, // s'il y a des case à cocher
    checked: Array, // le tableau des cases cochées
    itemButton: Object, // l'objet pour les boutons d'items
    listButton: Object, // l'objet pour le bouton de liste
    itemAmount: Boolean,
  },
  data : () => {
    return {
      amounts: [],
    }
  },
  methods: {
    handleListButtonClick() {
      const selectedItems = this.data
          .map((_, index) => ({
            index,
            amount: this.itemAmount ? this.amounts[index] || 1 : undefined,
          }))
          .filter(item => this.checked[item.index]);
      this.$emit('list-button-clicked', selectedItems);
    },
  },
}
</script>