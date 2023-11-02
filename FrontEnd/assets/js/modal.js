// recuperation du token et du userId suite à l'identification
const token = window.sessionStorage.getItem("token")
const userId = window.sessionStorage.getItem("userId")

// selection des élements de la modale (fond + contenu modale)
const modalBackground = document.querySelector(".modal-bgd");
const modalDialog = document.querySelector("#modal");
const modalContentContainer = document.querySelector(".modal-content");
const modalTitle = document.querySelector(".modal-title");
const modalWorkContainer = document.querySelector(".modal-work-container");
const modalAddButton = document.querySelector(".js-add-button");
const modalSubmitButton = document.querySelector(".js-modal-submit")

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
  modalAddButton.classList.remove("modal-button_active")
  modalWorkContainer.innerHTML = "";
}

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
    removeIcon.setAttribute("id", `${projet.id}`)
    removeIcon.addEventListener("click", deleteWork)
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
    <label for="submit-button" class="modal-button modal-button-two modal-button_active js-modal-submit">Valider</label>
    <input type="submit" id="submit-button" hidden>
    </form>`;
  modalAddButton.classList.remove("modal-button_active");
  modalReturnArrow.classList.add("return-arrow_active")
  const modalAddWorkPicture = document.getElementById("add-work-picture")
  modalAddWorkPicture.addEventListener("change", picturePreview)
  loadCategories()
  formSend()
}

// fonction qui charge la liste de catégories et l'ajoute aux options de la balise "select"
async function loadCategories() {
  const categoriesList = await fetch("http://localhost:5678/api/categories");
  const categories = await categoriesList.json();
  createCategories(categories)
}


//fonction pour récuperer la liste des filtres
async function createCategories(categories) {
  const selectContainer = document.getElementById("add-work-category");
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const optionCategory = document.createElement("option");
    optionCategory.innerText = category.name;
    optionCategory.value = i+1;
    selectContainer.appendChild(optionCategory);
  }
}

//fonction permettant de changer l'affichage de la modale au clic sur le bouton
const modalChangeContent = function (e) {
  e.preventDefault();
  if (modalAddButton.classList.contains("modal-button_active")) {
    modalContentReset();
    createModalTwo();
    formListener()
  } else {
    modalContentReset();
    createModalOne();
  }
};

// ajout de l'event listener sur le bouton et sur la fleche de retour
modalAddButton.addEventListener("click", modalChangeContent);
modalReturnArrow.addEventListener("click", modalChangeContent);


/* ===> La suite concerne les différentes requetes API 
pour l'ajout et la suppression de travaux */

// fonction qui ajoute un aperçu de l'image sélectionnée
function picturePreview(e) {
  const picturePreviewContainer = document.querySelector(".add-work-uploadpic")
  picturePreviewContainer.classList.add("add-work-uploadpic_active")
  const file = e.target.files[0]
  picturePreviewCleaner(file)
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    picturePreviewContainer.src = e.target.result;
  };
}

// fonction qui cache les éléments de sélection de l'image
function picturePreviewCleaner(file) {
  if (file !== undefined) {
    document.querySelector(".add-work-icon").classList.add("preview-hidden")
    document.querySelector(".choose-file-btn").classList.add("preview-hidden")
    document.querySelector(".choose-file-btn label").classList.add("preview-hidden")
    document.querySelector(".add-work-text").classList.add("preview-hidden")
  } 
}

// ajout de nouveau projet

// Fonction qui récupère les infos du formulaire lors de l'evenement "submit" 
function formSend() {
  const formSubmit = document.getElementById("add-work-form")
  formSubmit.addEventListener("submit", (event) => {
    event.preventDefault()
    // Construction de la charge utile pour la requete
    const newProject = new FormData()
    newProject.append("image", document.getElementById("add-work-picture").files[0])
    newProject.append("title", document.querySelector("[name=add-work-title]").value)
    newProject.append("category", parseInt(document.getElementById("add-work-category").value))

    // utilisation de la charge utile dans l'envoi de la requete
    sendNewProject(newProject)
  })
}

// Fonction qui appelle l'API

async function sendNewProject(newProject) {
  try {
    const sendWorkToApi = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization : "Bearer "+ token,
        Accept: "application/json",     
      },
      body: newProject
    })

    // recuperation de la réponse
    const reponseApi = await sendWorkToApi.json();
    if (reponseApi.status === 201) {
      window.alert("Projet ajouté avec succès")
    }
  } catch(err) {
      console.log(err);
  }
}

// fonction qui valide le formulaire et change la couleur du bouton Valider
function formListener() {
  const modalSubmitButton = document.querySelector(".js-modal-submit")
  const formInput = document.querySelectorAll(".form-input")
  formInput.forEach((input) => {
    input.addEventListener("change", () => {
      let validFields = 0
      for (let i = 0 ; i < formInput.length; i++) {
        if (formInput[i].value !== "") {
          validFields++
        }
      }
      if (validFields >= formInput.length) {
        modalSubmitButton.classList.add("modal-button_form-ok")  
      } else {
        if (modalSubmitButton.classList.contains("modal-button_form-ok")) {
          modalSubmitButton.classList.remove("modal-button_form-ok") 
        }
        return
      }
    })
  })
}
  
// fonction qui supprime les projets en au click sur l'icone poubelle

const deleteWork = async function deleteWork(event) {
  event.preventDefault()
  const removeWorkId = this.id
  console.log(`j'ai cliqué sur l'icone ${removeWorkId}`)
  try {
    const DeleteWorkApi = await fetch(`http://localhost:5678/api/works/${removeWorkId}`,{
      method: "DELETE",
      headers: {Authorization : "Bearer "+ token},
    })
    if(DeleteWorkApi.ok){
      alert("Projet supprimé avec succès")
    } else {
        throw new Error("Requête échouée");
    }  
  } catch (error) {
    window.alert("La requête a échoué");
}

}
  
