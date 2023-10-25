// selection des élements de la modale (fond + contenu modale)
const modalBackground = document.querySelector(".modal-bgd");
const modalDialog = document.querySelector("#modal");
const modalContentContainer = document.querySelector(".modal-content");
const modalTitle = document.querySelector(".modal-title");
const modalWorkContainer = document.querySelector(".modal-work-container");
const modalAddButton = document.querySelector(".modal-button");

//ajout de la flèche de retour
const modalReturnArrow = document.createElement("i");
modalReturnArrow.classList.add("return-arrow", "fa-solid", "fa-arrow-left");
modalContentContainer.appendChild(modalReturnArrow);

// fonction qui ouvre la modale au clic sur le lien
const openModal = function (e) {
  modalDialog.show();
  createModalOne();
  modalBackground.classList.add("modal-bgd_active");
};

// fonction qui ferme la modale
const closeModal = function (e) {
  modalDialog.close();
  modalBackground.classList.remove("modal-bgd_active");
};

document.querySelector(".js-modal").addEventListener("click", openModal);

// fermeture de la modale au clic
const modalTriggers = document.querySelectorAll(".js-close-modal");
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", closeModal)
);

// ajout de la fermeture de la modale lorsqu'on appuie sur ECHAP
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// fonction de création du contenu de la 1ere modale
function modalContentReset() {
  if (modalReturnArrow.classList.contains("return-arrow_active")) {
    modalReturnArrow.classList.remove("return-arrow_active");
  }
  modalWorkContainer.innerHTML = "";
  modalAddButton.setAttribute("class", "modal-button");
  modalAddButton.setAttribute("form", "");
  modalAddButton.setAttribute("type", "");
}

function createModalOne() {
  modalContentReset();
  modalTitle.innerText = "Galerie photo";
  genererProjets(projets);
  modalAddButton.innerText = "Ajouter une photo";
  modalAddButton.classList.add("js-add-button");
}

// Récupération des projets
const reponse = await fetch("http://localhost:5678/api/works");
const projets = await reponse.json();

// fonction pour générer les projets
async function genererProjets(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];

    //creation du conteneur de chaque projet
    const modalImgContainer = document.createElement("div");
    modalImgContainer.classList.add("modal-img-container");

    //creation de l'icone "remove"
    const removeIconContainer = document.createElement("div");
    const removeIcon = document.createElement("i");
    removeIconContainer.classList.add("remove-icon");
    removeIcon.classList.add("fa-solid", "fa-trash-can");
    removeIconContainer.appendChild(removeIcon);

    //creation des images pour chaque projet
    const imageProjet = document.createElement("img");
    imageProjet.classList.add("modal-work-img");
    imageProjet.src = projet.imageUrl;
    imageProjet.alt = projet.title;

    //ajout des éléments générés à la page
    modalWorkContainer.appendChild(modalImgContainer);
    modalImgContainer.appendChild(removeIconContainer);
    modalImgContainer.appendChild(imageProjet);
  }
}

// fonction de création du contenu de la 2nde modale
function createModalTwo() {
  modalTitle.innerText = "Ajout photo";
  modalWorkContainer.innerHTML = `<form class="add-work-form">
    <div class="add-picture-container">
    <i class="add-work-icon fa-regular fa-image"></i>
    <img class="add-work-uploadpic" src=""/>
    <div class="modal-button choose-file-btn">
      <label for="add-work-picture">+ Ajouter photo</label>
      <input type="file" name="add-work-picture" id="add-work-picture" value="+ Ajouter photo" accept="image/png, image/jpeg" hidden required/>
    </div>
    <p class="add-work-text">jpg, png : 4mo max</p>
    </div>
    <label for="add-work-title">Titre</label>
    <input type="text" id="add-work-title" name="add-work-title" required />
    <label for="add-work-category">Catégorie</label>
    <select id="add-work-category"></select>
    </form>`;
  modalAddButton.innerText = "Valider";
  modalAddButton.classList.add("js-modal-submit");
  modalAddButton.setAttribute("form", "add-work-form");
  modalAddButton.type = "submit";
  modalReturnArrow.classList.add("return-arrow_active")
}

//fonction permettant de changer l'affichage de la modale au clic sur le bouton
const modalChangeContent = function (e) {
  e.preventDefault();
  if (modalAddButton.classList.contains("js-add-button")) {
    modalContentReset();
    createModalTwo();
  } else {
    modalContentReset();
    createModalOne();
  }
};

// ajout de l'event listener sur le bouton et sur la fleche de retour
modalAddButton.addEventListener("click", modalChangeContent);
modalReturnArrow.addEventListener("click", modalChangeContent);
