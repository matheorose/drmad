<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Login:</label>
        <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Entrez votre login"
            required
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Entrez votre mot de passe"
            required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ShopLoginView",
  data() {
    return {
      username: "", // Champs pour stocker le login
      password: "", // Champs pour stocker le mot de passe
    };
  },
  methods: {
    handleLogin() {
      // Vérifie les champs et effectue une action (comme appeler une API ou valider localement)
      if (this.username && this.password) {
        console.log(`Utilisateur: ${this.username}, Mot de passe: ${this.password}`);
        this.$router.push("/shop/buy"); // Redirige vers /shop/buy
      } else {
        alert("Veuillez remplir tous les champs !");
      }
    },
  },
};
</script>


<!--
<template>
  <div>
    <h1>Login</h1>

    <span>login</span><input v-model="login" type="text">
    <span>password</span><input v-model="password" type="password">
    <button @click="handleLogin">Login</button>

    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'ShopLoginView',
  data: () => ({
    login: '',
    password: '',
    errorMessage: '',
  }),
  computed: {
    ...mapState(['shopUser']),
  },
  methods: {
    ...mapActions(['shopLogin']),
    async handleLogin() {
      const response = await this.shopLogin({ login: this.login, password: this.password });

      if (response.error) {
        this.errorMessage = 'Login ou mot de passe incorrect.';
      } else {
        this.$router.push('/shop/buy');
      }
    },
  },
};
</script>
-->