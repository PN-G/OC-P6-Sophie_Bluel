const reponse = await fetch("http://localhost:5678/api/works")
const projets = await reponse.json()

//fonction pour ajouter les projets

//selection de l'element du DOM dans lequel les projets vont etre ajoutés
const gallery = document.querySelector(".gallery")

function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i]
        console.log(projet.imageUrl)

        //creation du conteneur de chaque projet
        const figureProjet = document.createElement("figure")

        //creation des elements pour chaque projet
        const imageProjet = document.createElement("img")
        imageProjet.src = projet.imageUrl
        imageProjet.alt = projet.title
        const titreProjet = document.createElement("figcaption")
        titreProjet.innerText = projet.title

        //ajout des éléments générés à la page
        gallery.appendChild(figureProjet)
        figureProjet.appendChild(imageProjet)
        figureProjet.appendChild(titreProjet)
    }
}

// ajout des filtres
const categories = await fetch("http://localhost:5678/api/categories")
const filtres = await categories.json()

const conteneurFiltres = document.querySelector(".filtres")

// premier filtre "reset"
const filtreReset = document.createElement("button")
filtreReset.innerText = "Tous"
filtreReset.classList.add("filtre")

conteneurFiltres.appendChild(filtreReset)

//fonction pour récuperer la liste des filtres

function genererFiltres(filtres) {
    for (let i = 0; i < filtres.length; i++) {
        const filtre = filtres[i]
        const bouttonFiltre = document.createElement("button")
        bouttonFiltre.innerText = filtre.name
        bouttonFiltre.classList.add("filtre")
        conteneurFiltres.appendChild(bouttonFiltre)
    }
}

//appel des fonctions
genererProjets(projets)
genererFiltres(filtres)