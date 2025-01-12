import LocalSource from "@/datasource/controller";

async function shopLoginFromLocalSource(data) {
  try {
    // Appel de la fonction shopLogin
    const response = await shopLogin(data);
    return response;  // Retourne la réponse de la fonction shopLogin
  } catch (error) {
    return error;  // En cas d'erreur, on retourne l'erreur
  }
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
  return LocalSource.getAllViruses()
}

/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}


async function getAllViruses() {
  let response = null;
  try {
    response = await getAllVirusesFromLocalSource();
    console.log("Réponse de getAllViruses depuis le service: ", response);
  } catch (err) {
    response = { error: 1, status: 404, data: 'Erreur réseau, impossible de récupérer la liste des viruses' };
    console.log("Erreur dans le service: ", err);
  }
  return response;
}

async function updateUserBasket(userId, basket) {
  return LocalSource.updateUserBasket(userId, basket);
}

async function getUserBasket(userId) {
  return LocalSource.getUserBasket(userId);
}

async function createOrder(userId, order) {
  return LocalSource.createOrderForUser(userId, order);
}

async function payOrder(userId, orderId) {
  return LocalSource.payOrderForUser(userId, orderId);
}

async function getOrders(userId) {
  return LocalSource.getOrdersForUser(userId);
}

async function cancelOrder(userId, orderId) {
  return LocalSource.cancelOrderForUser(userId, orderId);
}

async function shopLoginService(data) {
  let response = null;
  try {
    // Appel de la méthode shopLoginFromLocalSource pour gérer la logique de connexion
    response = await shopLoginFromLocalSource(data);
  } catch (err) {
    response = { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
  return response;
}

export default {
  getAllViruses,
  updateUserBasket,
  getUserBasket,
  createOrder,
  payOrder,
  getOrders,
  cancelOrder,
  shopLoginService
}