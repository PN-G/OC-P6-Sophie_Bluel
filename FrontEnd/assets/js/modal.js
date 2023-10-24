// selection des élements de la modale (fond + modale)
const modalBackground = document.querySelector(".modal-bgd")
const modalDialog = document.querySelector("#modal")
const modalContentContainer = document.querySelector(".modal-content")


// fonction qui ouvre la modale au clic sur le lien
const openModal = function (e) {
    modalDialog.show();
    modalBackground.classList.add("modal-bgd_active")
}

// fonction qui ferme la modale
const closeModal = function (e) {
    modalDialog.close()
    modalBackground.classList.remove("modal-bgd_active")
}

// on ecoute le clic sur le lien
document.querySelector(".js-modal").addEventListener("click", openModal)

// fermeture de la modale au clic sur la croix
const modalTriggers = document.querySelectorAll(".js-close-modal")
modalTriggers.forEach(trigger => trigger.addEventListener("click", closeModal))

// ajout de la fermeture de la modale lorsqu'on appuie sur ECHAP
window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})

// Création du contenu de la Modale
// Récupération des projets
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

// ajout des éléments au DOM
// ajout du titre de la modale
const modalTitle = document.createElement("h3")
modalTitle.innerText = "Galerie photo"

modalContentContainer.appendChild(modalTitle)

// ajout des projets
const modalWorkContainer = document.createElement("div")
modalWorkContainer.classList.add("modal-work-container")

modalContentContainer.appendChild(modalWorkContainer)

// fonction pour générer les projets
async function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {
      const projet = projets[i];
  
      //creation du conteneur de chaque projet
      const modalImgContainer = document.createElement("div")
      modalImgContainer.classList.add("modal-img-container")

      //creation de l'icone "remove"
      const removeIconContainer = document.createElement("div")
      const removeIcon = document.createElement("i")
      removeIconContainer.classList.add("remove-icon")
      removeIcon.classList.add("fa-solid","fa-trash-can")
      removeIconContainer.appendChild(removeIcon)

  
      //creation des images pour chaque projet
      const imageProjet = document.createElement("img");
      imageProjet.classList.add("modal-work-img")
      imageProjet.src = projet.imageUrl;
      imageProjet.alt = projet.title;
  
      //ajout des éléments générés à la page
      modalWorkContainer.appendChild(modalImgContainer);
      modalImgContainer.appendChild(removeIconContainer);
      modalImgContainer.appendChild(imageProjet)
    }
  }
genererProjets(projets)

      // création du bouton "Ajouter une photo"
      const modalAddButton = document.createElement("button")
      modalAddButton.classList.add("modal-button" , "js-add-button")
      modalAddButton.innerText = "Ajouter une photo"

      modalContentContainer.appendChild(modalAddButton)