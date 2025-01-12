<template>
  <div style="display: flex;">
    <div style="flex: 1; margin-right: 10px;">
      <ItemsList @item-added="addToBasket" />
    </div>
    <div style="flex: 1; margin-left: 10px;">
      <BasketList :basket="basket" />
    </div>
  </div>
</template>

<script>
import ItemsList from '@/views/ItemList.vue';
import BasketList from '@/components/BasketList.vue';

export default {
  name: "ShopBuy",
  components: {
    ItemsList,
    BasketList,
  },
  data() {
    return {
      basket: [],
    };
  },
  methods: {
    addToBasket(item) {
      this.basket.push(item);
    },
  },
};
</script>