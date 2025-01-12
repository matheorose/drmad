import LocalSource from "@/datasource/controller";

async function createTransaction(data) {
  try {
    const response = await LocalSource.createTransaction(data);
    return response;
  } catch (err) {
    return { error: 1, status: 500, data: "Erreur réseau" };
  }
}

async function getAccountFromLocalSource(data) {
  return LocalSource.getAccount(data);
}

async function getAccount(data) {
  let response = null;
  try {
    response = await getAccountFromLocalSource(data);
  } catch (err) {
    response = { error: 1, status: 500, data: "Erreur réseau" };
  }
  return response;
}

async function logout() {
  return { error: 0, status: 200, data: "Déconnexion réussie" };
}

async function getAccountAmountFromLocalSource(number) {
  // récupération auprès de la source locale
  return LocalSource.getAccountAmount(number)
}

async function getAccountAmount(number) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAccountAmountFromLocalSource(number)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}

async function getAccountTransactions(idAccount) {
  try {
    return await LocalSource.getAccountTransactionsFromLocalSource(idAccount);
  } catch (err) {
    return { error: 1, status: 500, data: "Erreur lors de la récupération des transactions" };
  }
}
export default {
  createTransaction,
  getAccount,
  logout,
  getAccountAmount,
  getAccountTransactions
}
