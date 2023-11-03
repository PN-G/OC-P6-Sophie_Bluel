// récuperation du token d'identification pour afficher la page admin
const token = window.sessionStorage.getItem("token")
const userId = window.sessionStorage.getItem("userId")

// affichage du panneau administrateur si le token n'est pas vide (si on est identifié)
if (token !== null && userId !== null) {

    // création et ajout de la bannière noire
    const divAdmin = document.createElement("div")
    divAdmin.classList.add("edit-mode_banner")

    const body = document.querySelector("body")
    const header = document.querySelector("header")

    body.insertBefore(divAdmin, header)

    // création du contenu de la bannière administrateur
    const divAdminIcon = document.createElement("i")
    divAdminIcon.classList.add("fa-regular","fa-pen-to-square")
    const divAdminText = document.createElement ("p")
    divAdminText.innerText = "Mode édition"

    divAdmin.appendChild(divAdminIcon)
    divAdmin.appendChild(divAdminText)

    // ajout du bouton modifier
    const adminModalLink = document.createElement("a")
    adminModalLink.href = ("#modal")
    adminModalLink.classList.add("js-modal")
    const adminModalLinkText = document.createElement("p")
    adminModalLinkText.innerText="modifier"
    
    adminModalLink.appendChild(divAdminIcon)
    adminModalLink.appendChild(adminModalLinkText)
    
    const portfolioHeader = document.querySelector(".portfolio-header")

    portfolioHeader.appendChild(adminModalLink)
}

const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

//fonction pour ajouter les projets

//selection de l'element du DOM dans lequel les projets vont etre ajoutés
const gallery = document.querySelector(".gallery");

async function genererProjets(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];

    //creation du conteneur de chaque projet
    const figureProjet = document.createElement("figure");

    //creation des elements pour chaque projet
    const imageProjet = document.createElement("img");
    imageProjet.src = projet.imageUrl;
    imageProjet.alt = projet.title;
    const titreProjet = document.createElement("figcaption");
    titreProjet.innerText = projet.title;

    //ajout des éléments générés à la page
    gallery.appendChild(figureProjet);
    figureProjet.appendChild(imageProjet);
    figureProjet.appendChild(titreProjet);
  }
}

// ajout des filtres
const categories = await fetch("http://localhost:5678/api/categories");
const filtres = await categories.json();

const conteneurFiltres = document.querySelector(".filtres");

//variables pour les classes et le texte des filtres
const filtreResetText = "Tous"
const filtreClass = "filtre"
const filtreSelectedClass = "filtre_selected"

// premier filtre "reset"
const filtreReset = document.createElement("button");
filtreReset.innerText = filtreResetText;
filtreReset.classList.add(filtreClass);

conteneurFiltres.appendChild(filtreReset);

//fonction pour récuperer la liste des filtres
async function genererFiltres(filtres) {
  for (let i = 0; i < filtres.length; i++) {
    const filtre = filtres[i];
    const bouttonFiltre = document.createElement("button");
    bouttonFiltre.innerText = filtre.name;
    bouttonFiltre.classList.add(filtreClass);
    conteneurFiltres.appendChild(bouttonFiltre);
  }
}

//appel des fonctions
genererProjets(projets);
genererFiltres(filtres);

// ajout event listener sur les filtres + appel des fonctions
const boutonFiltres = document.querySelectorAll(".filtre");

boutonFiltres.forEach((boutonFiltre) => {
  boutonFiltre.addEventListener("click", () => {
    addClassSelected(boutonFiltre);
    filtrerProjets(boutonFiltre);
  });
});

// Fonction qui va filtrer les projets en fonction de la catégorie
function filtrerProjets(boutonFiltre) {
  const projetFiltres = projets.filter((projet) => {
    if (boutonFiltre.innerText.toLowerCase() === filtreResetText.toLowerCase()) {
      return projets;
    } else {
      return projet.category.name.toLowerCase() === boutonFiltre.innerText.toLowerCase();
    }
  });
  gallery.innerHTML = "";
  genererProjets(projetFiltres);
}

// Fonction qui va retirer ou ajouter la classe filtre_selected
function addClassSelected(boutonFiltre) {
  for (let i = 0; i < boutonFiltres.length; i++) {
    if (boutonFiltres[i].classList.contains(filtreSelectedClass)) {
      boutonFiltres[i].classList.remove(filtreSelectedClass);
    }
  }
  boutonFiltre.classList.add(filtreSelectedClass);
}
