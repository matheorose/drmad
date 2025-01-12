<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Login:</label>
        <input
            type="text"
            id="username"
            v-model="login"
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
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "ShopLoginView",
  data() {
    return {
      login: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    ...mapActions('shop', ['shopLogin']),
    async handleLogin() {
      if (!this.login || !this.password) {
        this.errorMessage = "Veuillez remplir tous les champs !";
        return;
      }

      try {
        const response = await this.shopLogin({login: this.login, password: this.password});
        if (response && response.error === 0) {
          this.$router.push('/shop/buy');
        } else {
          this.errorMessage = response.data || "Login ou mot de passe incorrect.";
        }
      } catch (error) {
        this.errorMessage = error.message || "Une erreur s'est produite lors de la connexion.";
      }
    },
  },
};
</script>

<style scoped>
/* Styles pour le formulaire de connexion */
form {
  max-width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
}

div {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px;
}
</style>
