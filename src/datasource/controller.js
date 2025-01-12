import { items, shopusers, bankaccounts, transactions } from './data'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs';
/* controllers: les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Ces paramètres sont généralement les mêmes qu'ils faudrait envoyer à l'API, mais pas forcément.

  Exemple 1 : se loguer auprès de la boutique
 */

function getAllViruses() {
  return {error: 0, data: items}
}


function getAccount(data) {
  const account = bankaccounts.find(a => a.number === data.number);
  if (!account) {
    return { error: 1, status: 404, data: "Numéro de compte invalide" };
  }
  return { error: 0, status: 200, data: account };
}

function getAccountAmount(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
  return {error: 0, status: 200, data: account.amount}
}

function getAccountTransactions(number) {
  if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
  // récupérer les transaction grâce à l'_id du compte
  let trans = transactions.filter(t => t.account === account._id)
  return {error: 0, status: 200, data: trans}
}

function updateUserBasket(userId, basket) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }
  user.basket = basket;
  return { error: 0, status: 200, data: user.basket };
}

function getUserBasket(userId) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }
  return { error: 0, status: 200, data: user.basket || { items: [] } };
}

function createOrderForUser(userId, order) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  // Calcul du total avec promotions
  let total = 0;
  order.items.forEach(item => {
    total += item.item.price * item.amount;
    item.item.promotion.forEach(promo => {
      total -= promo.discount * promo.amount;
    });
  });

  // Création de la commande
  const newOrder = {
    ...order,
    total,
    status: 'waiting_payment',
    date: new Date(),
    uuid: uuidv4(),
  };

  // Ajout à la liste des commandes de l'utilisateur
  if (!user.orders) {
    user.orders = [];
  }
  user.orders.push(newOrder);

  return { error: 0, status: 200, data: { uuid: newOrder.uuid } };
}

function payOrderForUser(userId, orderId) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  const order = user.orders.find(o => o.uuid === orderId);
  if (!order) {
    return { error: 1, status: 404, data: "Commande non trouvée" };
  }

  // Modifier le statut de la commande à "finalized"
  order.status = "finalized";

  // Retourner la réponse avec succès
  return { error: 0, status: 200, data: "Commande payée avec succès" };
}

function getOrdersForUser(userId) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
  }

  // Retourner les commandes de l'utilisateur
  return { error: 0, status: 200, data: user.orders || [] };
}

function cancelOrderForUser(userId, orderId) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
  }

  const order = user.orders.find(o => o.uuid === orderId);
  if (!order) {
    return { error: 1, status: 404, data: 'Commande non trouvée' };
  }

  // Annuler la commande
  order.status = 'cancelled';

  return { error: 0, status: 200, data: 'Commande annulée avec succès' };
}

function shopLogin(data) {
  return new Promise((resolve, reject) => {
    if (!data || !data.login || !data.password) {
      reject({ error: 1, status: 400, data: "Données de connexion manquantes" });
      return;
    }

    // Recherche de l'utilisateur dans shopusers
    const user = shopusers.find(user => user.login === data.login);
    if (!user) {
      reject({ error: 1, status: 404, data: "Utilisateur non trouvé" });
      return;
    }

    // Comparaison du mot de passe
    bcrypt.compare(data.password, user.password, (err, result) => {
      if (err || !result) {
        reject({ error: 1, status: 401, data: "Mot de passe incorrect" });
        return;
      }

      // Générer un session (par exemple, ici on renvoie l'utilisateur sans mot de passe)
      const userWithoutPassword = {
        login: user.login,
        name: user.name,
        email: user.email
      };

      resolve({ error: 0, status: 200, data: userWithoutPassword });
    });
  });
}

export default{
  shopLogin,
  getAccount,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
  updateUserBasket,
  getUserBasket,
  createOrderForUser,
  payOrderForUser,
  getOrdersForUser,
  cancelOrderForUser,
}