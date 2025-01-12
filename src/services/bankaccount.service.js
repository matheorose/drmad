import LocalSource from "@/datasource/controller";

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

async function getAccountAmountFromLocalSource(number) {
  // récupération auprès de la source locale
  return LocalSource.getAccountAmount(number)
}

async function getAccountTransactionsFromLocalSource(number) {
  // récupération auprès de la source locale
  return LocalSource.getAccountTransactions(number)
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

async function getAccountTransactions(number) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAccountTransactionsFromLocalSource(number)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}

export default {
  getAccount,
  getAccountAmount,
  getAccountTransactions
}
