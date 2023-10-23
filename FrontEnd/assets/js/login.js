// ajout d'un event listener au submit
const logInForm = document.querySelector(".login-form");
logInForm.addEventListener("submit", logInSend);

async function logInSend(event) {
  event.preventDefault();

  // Création de l’objet d'une nouvelle connexion.
  const newLogIn = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=password]").value,
  };
  const newLogInBody = JSON.stringify(newLogIn);

  // envoi de la requete à l'API
  try {
    const appelApi = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: newLogInBody,
    });

    // recuperation de la réponse
    const reponseApi = await appelApi.json();

    // verification des identifiants
    if (appelApi.status === 200) {
      // Enregistre le token dans le local storage et redirige sur la page d'accueil
      sessionStorage.setItem("token", reponseApi.token);
      document.location.href = "index.html";
    } else {
      // Message d'erreur si l'appel retourne un autre status
      throw new Error("mauvais identifiants");
    }
  } catch (error) {
    window.alert("les identifiants ne sont pas corrects");
  }
}
