import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/shop',
    component: () => import('../views/ShopView.vue'),  // Vue principale du shop
    children: [
      {
        path: '',
        component: () => import('../views/ShopHome.vue'),  // Composant d'accueil du shop
      },
      {
        path: 'login',
        component: () => import('../views/ShopLoginView.vue'),
      },
      {
        path: 'buy',
        component: () => import('../views/ShopBuy.vue'),
      },
      {
        path: 'pay/:orderId',
        component: () => import('../views/ShopPay.vue'),
        props: true,
      },
      {
        path: 'orders',
        component: () => import('../views/ShopOrders.vue'),
      },
    ],
  },
  {
    path: '/bank',
    name: 'bank',
    component: () => import('../views/BankHome.vue'),
  },
  {
    path: '/bank/account',
    name: 'bankaccount',
    component: () => import('../views/BankAccountView.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;