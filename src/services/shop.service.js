import LocalSource from "@/datasource/controller";

async function shopLoginFromLocalSource(data) {
  try {
    const response = await shopLogin(data);
    return response;
  } catch (error) {
    return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
}

async function getAllVirusesFromLocalSource() {
  try {
    const response = await LocalSource.getAllViruses();
    console.log("Données récupérées depuis LocalSource :", response); // Vérification des données
    return response;
  } catch (err) {
    console.error("Erreur lors de la récupération des viruses :", err);
    return { error: 1, status: 404, data: "Erreur réseau, impossible de récupérer la liste des viruses." };
  }
}


async function shopLogin(data) {
  try {
    return await shopLoginFromLocalSource(data);
  } catch (err) {
    return { error: 1, status: 404, data: "Erreur réseau, impossible de se loguer." };
  }
}

async function getAllViruses() {
  try {
    const response = await getAllVirusesFromLocalSource();
    console.log("Réponse de getAllViruses dans le service :", response); // Log complet de la réponse
    // Vérifiez si la structure de la réponse est conforme à vos attentes
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((virus, index) => {
        console.log(`Virus ${index + 1}:`, virus);
      });
      console.log("Viruses récupérés avec succès :", response.data);
      return { error: 0, data: response.data };
    } else {
      console.warn("Aucun virus trouvé dans la réponse :", response);  // Log pour un tableau vide ou réponse incorrecte
      return { error: 0, data: [] };  // Retournez un tableau vide si pas de données
    }
  } catch (err) {
    console.error("Erreur dans getAllViruses :", err);  // Log d'erreur
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les viruses." };
  }
}


async function updateUserBasket(userId, basket) {
  try {
    return await LocalSource.updateUserBasket(userId, basket);
  } catch (err) {
    console.error(`Erreur lors de la mise à jour du panier pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de mettre à jour le panier." };
  }
}

async function getUserBasket(userId) {
  try {
    const response = await LocalSource.getUserBasket(userId);
    console.log(`Panier récupéré pour l'utilisateur ${userId}:`, response);
    return response;
  } catch (err) {
    console.error(`Erreur lors de la récupération du panier pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer le panier." };
  }
}

async function createOrder(userId, order) {
  try {
    return await LocalSource.createOrderForUser(userId, order);
  } catch (err) {
    console.error(`Erreur lors de la création de la commande pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de créer la commande." };
  }
}

async function payOrder(userId, orderId) {
  try {
    return await LocalSource.payOrderForUser(userId, orderId);
  } catch (err) {
    console.error(`Erreur lors du paiement de la commande ${orderId} pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de payer la commande." };
  }
}

async function getOrders(userId) {
  try {
    return await LocalSource.getOrdersForUser(userId);
  } catch (err) {
    console.error(`Erreur lors de la récupération des commandes pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les commandes." };
  }
}

async function cancelOrder(userId, orderId) {
  try {
    return await LocalSource.cancelOrderForUser(userId, orderId);
  } catch (err) {
    console.error(`Erreur lors de l'annulation de la commande ${orderId} pour l'utilisateur ${userId}:`, err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible d'annuler la commande." };
  }
}

async function shopLoginService(data) {
  try {
    return await shopLoginFromLocalSource(data);
  } catch (err) {
    return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
}

export default {
  getAllViruses,
  updateUserBasket,
  getUserBasket,
  createOrder,
  payOrder,
  getOrders,
  cancelOrder,
  shopLoginService,
};
