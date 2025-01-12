import { items, shopusers, bankaccounts, transactions} from './data'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

function getAllViruses() {
  return { error: 0, data: items }
}

function getAccountAmount(number) {
  if (!number) return { error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni' }
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return { error: 1, status: 404, data: 'numéro de compte bancaire incorrect' }
  return { error: 0, status: 200, data: account.amount }
}

function getAccountTransactions(number) {
  if (!number) return { error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni' }
  let account = bankaccounts.find(a => a.number === number)
  if (!account) return { error: 1, status: 404, data: 'numéro de compte bancaire incorrect' }
  let trans = transactions.filter(t => t.account === account._id)
  return { error: 0, status: 200, data: trans }
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

  let total = 0;
  order.items.forEach(item => {
    total += item.item.price * item.amount;
    item.item.promotion.forEach(promo => {
      total -= promo.discount * promo.amount;
    });
  });

  const newOrder = {
    ...order,
    total,
    status: 'waiting_payment',
    date: new Date(),
    uuid: uuidv4(),
  };

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

  order.status = "finalized";
  return { error: 0, status: 200, data: "Commande payée avec succès" };
}

function getOrdersForUser(userId) {
  const user = shopusers.find(u => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: 'Utilisateur non trouvé' };
  }
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

  order.status = 'cancelled';
  return { error: 0, status: 200, data: 'Commande annulée avec succès' };
}


function shopLogin(data) {
  return new Promise((resolve, reject) => {
    if (!data || !data.login || !data.password) {
      return reject({ error: 1, status: 400, data: "Données de connexion manquantes" });
    }

    const user = shopusers.find(u => u.login === data.login);
    if (!user) {
      return reject({ error: 1, status: 404, data: "Utilisateur non trouvé" });
    }

    bcrypt.compare(data.password, user.password, (err, result) => {
      if (err) {
        console.error("Erreur lors de la comparaison du mot de passe :", err);
        return reject({ error: 1, status: 500, data: "Erreur interne" });
      }
      if (!result) {
        console.error("Mot de passe incorrect pour l'utilisateur :", data.login);
        return reject({ error: 1, status: 401, data: "Mot de passe incorrect" });
      }

      const userWithoutPassword = {
        _id: user._id,
        login: user.login,
        name: user.name,
        email: user.email,
      };

      resolve({ error: 0, status: 200, data: userWithoutPassword });
    });
  });
}

export {
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
  updateUserBasket,
  getUserBasket,
  createOrderForUser,
  payOrderForUser,
  getOrdersForUser,
  cancelOrderForUser,
};
