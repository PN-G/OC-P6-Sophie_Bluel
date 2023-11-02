// ajout d'un event listener au submit
const logInForm = document.querySelector(".login-form");
logInForm.addEventListener("submit", logInSend);

// Création de l’objet d'une nouvelle connexion.
function logInBody(event) {
  const newLogIn = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=password]").value,
  };
  const newLogInBody = JSON.stringify(newLogIn);
  return newLogInBody
}

async function logInSend(event) {
  event.preventDefault();
  // envoi de la requete à l'API
  try {
    const appelApi = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: logInBody(event),
    })
    // recuperation de la réponse
    const reponseApi = await appelApi.json();
    logInCheck(reponseApi)
  } catch(err) {
      alert("Une erreur est survenue, merci de réessayer ultérieurement");
  }
}

// verification des identifiants
function logInCheck(reponseApi) {
  if (reponseApi.message === "user not found") {
    alert("Les identifiants ne sont pas corrects")  
  }
  if (reponseApi.userId !== undefined) {
    // Enregistre le token dans le local storage et redirige sur la page d'accueil
    sessionStorage.setItem("token", reponseApi.token);
    sessionStorage.setItem("userId", reponseApi.userId)
    document.location.href = "index.html";
  }
}