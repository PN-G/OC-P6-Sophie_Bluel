const reponse = await fetch("http://localhost:5678/api/works")
const projets = await reponse.json()

//fonction pour ajouter les projets

function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i]
        console.log(projet.imageUrl)

        //selection de l'element du DOM dans lequel les projets vont etre ajoutés
        const gallery = document.querySelector(".gallery")
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

genererProjets(projets)