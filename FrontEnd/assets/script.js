const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

//fonction pour ajouter les projets

//selection de l'element du DOM dans lequel les projets vont etre ajoutés
const gallery = document.querySelector(".gallery");

function genererProjets(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];
    console.log(projet.imageUrl);

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

// premier filtre "reset"
const filtreReset = document.createElement("button");
filtreReset.innerText = "Tous";
filtreReset.classList.add("filtre");

conteneurFiltres.appendChild(filtreReset);

//fonction pour récuperer la liste des filtres
function genererFiltres(filtres) {
  for (let i = 0; i < filtres.length; i++) {
    const filtre = filtres[i];
    const bouttonFiltre = document.createElement("button");
    bouttonFiltre.innerText = filtre.name;
    bouttonFiltre.classList.add("filtre");
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
    if (boutonFiltre.innerText === "Tous") {
      return projets;
    } else {
      return projet.category.name === boutonFiltre.innerText;
    }
  });
  gallery.innerHTML = "";
  genererProjets(projetFiltres);
}

// Fonction qui va retirer ou ajouter la classe filtre_selected
function addClassSelected(boutonFiltre) {
  for (let i = 0; i < boutonFiltres.length; i++) {
    if (boutonFiltres[i].classList.contains("filtre_selected")) {
      boutonFiltres[i].classList.remove("filtre_selected");
    }
  }
  boutonFiltre.classList.add("filtre_selected");
}
