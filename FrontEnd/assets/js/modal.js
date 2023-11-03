// recuperation du token et du userId suite à l'identification
const token = window.sessionStorage.getItem("token");
const userId = window.sessionStorage.getItem("userId");

// selection des élements de la modale (fond + contenu modale)
const modalBackground = document.querySelector(".modal-bgd");
const modalDialog = document.querySelector("#modal");
const modalContentContainer = document.querySelector(".modal-content");
const modalTitle = document.querySelector(".modal-title");
const modalWorkContainer = document.querySelector(".modal-work-container");
const modalAddButton = document.querySelector(".js-add-button");
const modalSubmitButton = document.querySelector(".js-modal-submit");

//ajout de la flèche de retour
const modalReturnArrow = document.createElement("i");
modalReturnArrow.classList.add("return-arrow", "fa-solid", "fa-arrow-left");
modalContentContainer.appendChild(modalReturnArrow);

/////////////////////////////////////////////////////////
// GESTION DE L'OUVERTURE ET LA FERMETURE DE LA MODALE //
/////////////////////////////////////////////////////////

// fonction qui ouvre la modale au clic sur le lien
const openModal = function () {
  modalDialog.show();
  createModalOne();
  modalBackground.classList.add("modal-bgd_active");
};

// fonction qui ferme la modale
const closeModal = function () {
  modalDialog.close();
  modalBackground.classList.remove("modal-bgd_active");
};

// ouverture de la modale au clic sur le lien "modifier"
document.querySelector(".js-modal").addEventListener("click", openModal);

// fermeture de la modale au clic
const modalTriggers = document.querySelectorAll(".js-close-modal");
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", closeModal)
);

// ajout de la fermeture de la modale lorsqu'on appuie sur ECHAP
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeModal();
  }
});

//fonction permettant de changer l'affichage de la modale au clic sur le bouton
const modalChangeContent = function (event) {
  event.preventDefault();
  if (modalAddButton.classList.contains("modal-button_active")) {
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

/////////////////////////////////////
// CREATION DU CONTENU DES MODALES //
/////////////////////////////////////

// fonction qui réinitialise le contenu de la modale
function modalContentReset() {
  if (modalReturnArrow.classList.contains("return-arrow_active")) {
    modalReturnArrow.classList.remove("return-arrow_active");
  }
  modalAddButton.classList.remove("modal-button_active");
  modalWorkContainer.innerHTML = "";
}

// fonction de création du contenu de la 1ere modale
function createModalOne() {
  modalContentReset();
  modalTitle.innerText = "Galerie photo";
  genererProjets(projets);
  modalAddButton.classList.add("modal-button_active");
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
    removeIcon.setAttribute("id", `${projet.id}`);
    removeIcon.addEventListener("click", deleteWork);
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
  modalWorkContainer.innerHTML = `<form id="add-work-form" class="add-work-form">
    <div class="add-picture-container">
    <img class="add-work-uploadpic" src=""/>
    <i class="add-work-icon fa-regular fa-image"></i>
    <div class="modal-button choose-file-btn">
      <label for="add-work-picture">+ Ajouter photo</label>
      <input type="file" class="form-input" name="add-work-picture" id="add-work-picture" value="+ Ajouter photo" accept="image/*" hidden required/>
    </div>
    <p class="add-work-text">jpg, png : 4mo max</p>
    </div>
    <label for="add-work-title">Titre</label>
    <input type="text" id="add-work-title" class="form-input" name="add-work-title" required />
    <label for="add-work-category">Catégorie</label>
    <select id="add-work-category" class="form-input">
      <option value="">Selectionnez une catégorie</option>
    </select>
    <input type="button" class="modal-button modal-button-two modal-button_active js-modal-submit" id="submit-button" value="Valider" disabled>
    </form>`;
  modalAddButton.classList.remove("modal-button_active");
  modalReturnArrow.classList.add("return-arrow_active");

  // creation des event listeners
  const modalAddWorkPicture = document.getElementById("add-work-picture");
  modalAddWorkPicture.addEventListener("change", picturePreview);
  modalAddWorkPicture.addEventListener("change", checkFormValues);

  const titleInput = document.getElementById("add-work-title");
  titleInput.addEventListener("input", checkFormValues);

  const categorySelected = document.getElementById("add-work-category");
  categorySelected.addEventListener("change", checkFormValues);

  // appel des fonctions
  loadCategories();
  formSend();
}

// fonction qui charge la liste de catégories et l'ajoute aux options de la balise "select"
async function loadCategories() {
  const categoriesList = await fetch("http://localhost:5678/api/categories");
  const categories = await categoriesList.json();
  createCategories(categories);
}

//fonction pour récuperer la liste des categories
async function createCategories(categories) {
  const selectContainer = document.getElementById("add-work-category");
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const optionCategory = document.createElement("option");
    optionCategory.innerText = category.name;
    optionCategory.value = i + 1;
    selectContainer.appendChild(optionCategory);
  }
}

////////////////////////////////////////////////////////////////////////
// GESTION DES REQUETES API POUR L'AJOUT ET LA SUPPRESSION DE TRAVAUX //
////////////////////////////////////////////////////////////////////////

// MODALE 1 ==> suppression d'un projet au click sur l'icone poubelle
const deleteWork = async function deleteWork(event) {
  event.preventDefault();
  const removeWorkId = this.id;
  if(confirm("souhaitez vous supprimer le projet ?")) {
    try {
      const DeleteWorkApi = await fetch(`http://localhost:5678/api/works/${removeWorkId}`, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
        });
      if (DeleteWorkApi.ok) {
        alert("Projet supprimé avec succès");
      }
    } catch (error) {
      alert("Une erreur est survenue, merci de réessayer ultérieurement");
    }
  }
};

// MODALE 2 ==> Gestion de l'affichage de l'aperçu de l'image selectionnée
// fonction qui ajoute un aperçu de l'image sélectionnée
function picturePreview(event) {
  const picturePreviewContainer = document.querySelector(".add-work-uploadpic");
  picturePreviewContainer.classList.add("add-work-uploadpic_active");
  const file = event.target.files[0];
  picturePreviewCleaner(file);
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    picturePreviewContainer.src = event.target.result;
  };
}

// fonction qui cache les éléments de sélection de l'image
function picturePreviewCleaner(file) {
  if (file !== undefined) {
    document.querySelector(".add-work-icon").classList.add("preview-hidden");
    document.querySelector(".choose-file-btn").classList.add("preview-hidden");
    document
      .querySelector(".choose-file-btn label")
      .classList.add("preview-hidden");
    document.querySelector(".add-work-text").classList.add("preview-hidden");
  }
}

// MODALE 2 ==> Ajout d'un nouveau projet
// Gestion de la validation des champs du formulaire qui va autoriser le clic sur le bouton "valider"
// vérification que l'image est valide
function checkLoadedImage() {
  const modalAddWorkPicture = document.getElementById("add-work-picture");
  if (modalAddWorkPicture.value !== "") {
    return true;
  } else {
    return false;
  }
}

// vérification que le champ texte n'est pas vide
function checkTitle() {
  const titleInput = document.getElementById("add-work-title");
  if (titleInput.value.length >= 1) {
    return true;
  } else {
    return false;
  }
}

// vérification qu'une catégorie a été choisie
function checkCategory() {
  const categorySelected = document.getElementById("add-work-category");
  if (categorySelected.value !== "") {
    return true;
  } else {
    return false;
  }
}

// Validation du formulaire si les champs sont corrects
function checkFormValues() {
  const modalSubmitButton = document.querySelector(".js-modal-submit");
  if (checkLoadedImage() && checkTitle() && checkCategory()) {
    modalSubmitButton.classList.add("modal-button_form-ok");
    modalSubmitButton.disabled = false;
  } else {
    if (modalSubmitButton.classList.contains("modal-button_form-ok")) {
      modalSubmitButton.classList.remove("modal-button_form-ok");
    }
    modalSubmitButton.disabled = true;
  }
}

// Fonction qui génère l'event listener au clic sur le bouton valider et lance la requête
function formSend() {
  const formSubmit = document.getElementById("submit-button");
  formSubmit.addEventListener("click", sendNewProject);
}

// Fonction qui appelle l'API
async function sendNewProject(event) {
  event.preventDefault();
  // Construction de la charge utile pour la requete
  const newProject = new FormData();
  newProject.append("image", document.getElementById("add-work-picture").files[0]);
  newProject.append("title", document.querySelector("[name=add-work-title]").value);
  newProject.append("category", parseInt(document.getElementById("add-work-category").value));
  // Envoi de la requête à l'API
  try {
    const sendWorkToApi = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      body: newProject,
    });
    // recuperation de la réponse
    const reponseApi = await sendWorkToApi.json();
    if (sendWorkToApi.ok) {
      alert("Projet ajouté avec succès");
    }
  } catch (err) {
    alert("Une erreur est survenue, merci de réessayer ultérieurement");
  }
}
