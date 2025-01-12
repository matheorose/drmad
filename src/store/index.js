import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import bank from "@/store/bank";
import shop from "@/store/shop";

export default new Vuex.Store({
    modules: {
        bank,
        shop,
    },
});
