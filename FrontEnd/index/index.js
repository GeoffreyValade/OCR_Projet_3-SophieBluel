//FETCH GENERIQUE
async function fetchData(url){
    const projets = await fetch(url)
    .then((resp)=>resp.json())
    .catch((err)=>console.error(err))
    return projets
}


//FACTORY BOUTON FILTRE
function factoryButtonFiltre(categoryName, categoryId) {

    //CREATION DES BALISES BUTTON
    button = document.createElement("button");
    button.classList.add("btn-filtrer");
    button.dataset.categoryId = categoryId;
    button.innerText = categoryName;

    return button;
}

function factoryButtonDelete(id, X, Y) {

    //CREATION DES BUTTON
    button = document.createElement("button");
    button.classList.add("btn-delete");

    //ID des boutons
    button.setAttribute("id", id)

    //Icone
    buttonicon = document.createElement("i");
    buttonicon.classList.add(X);
    buttonicon.classList.add(Y);
    button.appendChild(buttonicon);
    
    return button;
}


//CREATION DE LA CLASSE COMMUNE AUX BOUTONS FILTRES (.buttons)
async function giveButtonsClass(){
    
    const sectionPortfolio = document.querySelector('#portfolio')

    const buttonClass = document.createElement("div");
    buttonClass.classList.add("buttons");

    sectionPortfolio.appendChild(buttonClass);
}


//CREATION DE LA CLASSE COMMUNE AUX PROJETS (.gallery)
async function giveProjectsClass(){
    
    const sectionPortfolio = document.querySelector('#portfolio')

    const projectsClass = document.createElement("div");
    projectsClass.classList.add("gallery");

    sectionPortfolio.appendChild(projectsClass);
}




//AFFICHER LES PROJETS
async function afficherProjets(){

    const projets = await fetchData("http://localhost:5678/api/works")

    for (let i = 0; i < projets.length; i++) {
    
        const article = projets[i];
        const sectionGallery = document.querySelector(".gallery");
        
        //CREATION DES BALISES FIGURE
        const figureElement = document.createElement("figure");
        figureElement.classList.add("project");
        figureElement.dataset.categoryId = article.category.id;
        figureElement.setAttribute("id", 'gallery' + article.id)

        //CREATION DES BALISES IMAGE ET NOM
        const imageElement = document.createElement("img");
        imageElement.crossOrigin = "Anonymous";
        imageElement.src = article.imageUrl;

        const nomElement = document.createElement("figcaption");
        nomElement.crossOrigin = "Anonymous";
        nomElement.innerText = article.title;

        //FIGURE EST ENFANT DE GALLERY
        sectionGallery.appendChild(figureElement);

        //IMAGE ET NOMS SONT ENFANTS DE FIGURE
        figureElement.appendChild(imageElement);
        figureElement.appendChild(nomElement);
    }
}





//CREATION DES FILTRES SELON CATEGORIE
async function filtresCategories(){
    
    const categories = await fetchData("http://localhost:5678/api/categories")

    //BOUTONS FILTRANT
    for (const category of categories){

        const sectionPortfolio = document.querySelector(".buttons");
        const buttonElement = factoryButtonFiltre(category.name, category.id);

        //BUTTON EST ENFANT DE LA CLASSE ".BUTTONS"
        sectionPortfolio.appendChild(buttonElement);

        buttonElement.addEventListener("click", function (e) {
            e.preventDefault();

            for (const figure of document.querySelectorAll(".project")) {
                if (figure.dataset.categoryId == category.id) {
                        figure.style.display = "block"
                }
                
                else {
                    figure.style.display = "none"
                }
            }
        })
    }
}


//CREATION DU FILTRE ALL
async function filtreTout(){
    
    const sectionPortfolio = document.querySelector(".buttons");
    const buttonAll = document.createElement("button");
    buttonAll.classList.add("btn-filtrer-tous");
    buttonAll.innerText = "Tous";

    //BUTTON EST ENFANT DE GALLERY
    sectionPortfolio.appendChild(buttonAll);

    buttonAll.addEventListener("click", function (e) {
        e.preventDefault();

        for (const figure of document.querySelectorAll(".project")) {
            figure.style.display = "block"
        }
    })
}




//CREATION DES ELEMENTS ADMIN LORSQUE TOKEN PRESENT

function showAdminLayout(){
    const editButtonGallery = document.querySelector(".js-modal")
    const editButtonIntro = document.querySelector(".edit-intro")
    const editButtonImage = document.querySelector(".edit-image")
    const filterButtons = document.querySelector(".buttons")
    const loginButton = document.getElementById('nav-login')
    const allModal = document.getElementById('modal1')
    const adminLayout = document.querySelector(".admin-header-layout")
    //Condition ok
    if(sessionStorage.getItem("token") == null){
        //1. MONTRER LE BOUTON MODIFIER
        editButtonGallery.remove();
        editButtonIntro.remove();
        editButtonImage.remove();
        allModal.remove()
        adminLayout.remove()
    }
        //2. CACHER LES BOUTONS FILTRES
        //SI JE REMOVE LES BOUTONS, JE NE SAIS PLUS SUPPRIMER UN PROJET DYNAMIQUEMENT
    else{
        filterButtons.style.display="none";
        loginButton.innerText="logout";
    }
}


//MODAL

let modal = null

const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    for (const figure of document.querySelectorAll(".project-modale")) {
        figure.style.display = "block"
    }
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)

    const defaultShow = document.querySelector(".modal-main")
    defaultShow.style.display = "flex"

    const wipe = document.querySelector(".modal-add-project")
    wipe.style.display = "none"
    
    const previousButton = document.getElementById('js-modal-previous')
    previousButton.style.display="none"

    const displayButtons = document.querySelector(".modale-nav-add")
    displayButtons.setAttribute("style", "justify-content:flex-end")
}

const closeModal = function (e) {
    if (modal === null)
    return
    e.preventDefault()
    modal.style.display = "none"
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

//FONCTION POUR NAVIGUER VERS AJOUTER UN PROJET
const nextModal = function () {
    const nextButton = document.querySelector(".go-to-add-modal")
    const previousButton = document.getElementById('js-modal-previous')
    const displayButtons = document.querySelector(".modale-nav-add")

    nextButton.addEventListener('click',  function (e) {
        e.preventDefault();

        const target = document.querySelector(".modal-add-project")
        const hide = document.querySelector(".modal-main")

        target.style.display = "inline-flex"
        hide.style.display = "none"
        previousButton.style.display="block"
        displayButtons.setAttribute("style", "justify-content:space-between")
    })
}

//FONCTION POUR REVENIR VERS LA MODALE MAIN
const previousModalButton = function () {

    const previousButton = document.getElementById('js-modal-previous')
    const displayButtons = document.querySelector(".modale-nav-add")
    
    previousButton.addEventListener('click',  function (e) {
        e.preventDefault();

        const target = document.querySelector(".modal-main")
        const hide = document.querySelector(".modal-add-project")

        target.style.display = "flex"
        hide.style.display = "none"
        previousButton.style.display="none"
        displayButtons.setAttribute("style", "justify-content:flex-end")
    })
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})



async function afficherProjetsModal(){

    const projets = await fetchData("http://localhost:5678/api/works")

    for (let i = 0; i < projets.length; i++) {
        const article = projets[i];
        const sectionModale = document.querySelector(".projetsModale");
        
        //CREATION DES BALISES FIGURE
        const figureElement = document.createElement("figure");
        figureElement.classList.add("project-modale");
        figureElement.dataset.categoryId = article.category.id;
        figureElement.setAttribute("id", 'modale' + article.id)

        //CREATION DES BALISES IMAGE ET ICONE
        const imageElement = document.createElement("img");
        imageElement.crossOrigin = "Anonymous";
        imageElement.src = article.imageUrl;
        
        let deleteButton = factoryButtonDelete(article.id, "fa-solid", "fa-trash-can");
        
        //CREATION DES BALISES DIV CONTAINERS POUR IMAGE + ICONE SUPPR
        const containerImage = document.createElement("div");
        containerImage.classList.add("container");
        
        //FIGURE EST PARENT DE CONTAINER
        figureElement.appendChild(containerImage);

        //CONTAINER EST PARENT DE IMAGE + ICONE SUPPR
        containerImage.appendChild(imageElement);
        containerImage.appendChild(deleteButton);

        //FIGURE EST ENFANT DE MODALE
        sectionModale.appendChild(figureElement);

        //IMAGE ET NOMS SONT ENFANTS DE FIGURE
        const nomElement = document.createElement("figcaption");
        nomElement.crossOrigin = "Anonymous";
        nomElement.innerText = "éditer";
        figureElement.appendChild(nomElement);
    

        //FONCTION SUPPR.
        deleteButton.addEventListener("click", function () {
            fetch ("http://localhost:5678/api/works/" + article.id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.token
                },
            })
            .then(res => {console.log (res.status);
                if(res.status==204){
                    const deleteProjetModale = document.getElementById('modale' + json.id);
                    deleteProjetModale.remove();
                    const deleteProjetGallery = document.getElementById('gallery' + json.id);
                    deleteProjetGallery.remove();
                    alert("Projet supprimé avec succès.");}
          
                else{
                    alert("Erreur : Vous n'êtes pas autorisé à faire cette action.")
                }
                return res})
        })
    }
}


//Catégories dans la modale
async function addCategoryModale(){
    
    const categories = await fetchData("http://localhost:5678/api/categories")

    const selectCategoryModale = document.getElementById("select-category");


    //BOUTONS FILTRANT
    for (const category of categories){

        const addOptions = document.createElement("option");

        addOptions.value = category.id;
        addOptions.text = category.name;

        selectCategoryModale.add(addOptions);
    }
}


//Submit form
async function submitForm(){

    const form = document.querySelector('.form-new-project');

    //cible les check
    const imageCheck = document.getElementById('output');
    const titleCheck = document.getElementById('title-new-project');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //condition des checks image + titre
        if(titleCheck.value==0){
            alert("Erreur : Vous devez donner un titre à votre projet")
        }

        if(imageCheck.src==0){
            alert("Erreur : Vous devez insérer une image")
        }

        const formData = new FormData(form);   

        //N'effectue la requête fetch que si le formulaire est bien rempli (voir checks)
        if(!imageCheck.src==0 && !titleCheck.value==0){
            fetch('http://localhost:5678/api/works', {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.token
                },
            })
            //Affiche un message pour confirmer l'envoi et la réception du projet avec "if ([status de la requête]== [201])= OK"
            .then(res => {console.log (res.status);
                if(res.status==201){
                    form.reset();
                    imageCheck.removeAttribute("src");

                    var span = document.querySelector(".restriction-add-project");
                    var label = document.getElementById("file-label");
                    var icone = document.getElementById("icon-modale");

                    span.style.display = "block";
                    label.style.display = "block";
                    icone.style.display = "block";
                
                    alert("Projet envoyé avec succès.");
                }
                else{
                    alert("Erreur : Erreur interne au serveur. Le projet n'a pas pu être envoyé.")
                }
                return res})

            .then(res => res.json())
            
            //On reprend exactement le même fonctionnement que la fonction qui affiche les projets, mais on ne boucle pas
            .then(json => {
                //Création du projet de façon dynamique sur la page
                //PARTIE GALLERY
                const sectionGallery = document.querySelector(".gallery");

                const figureElement = document.createElement("figure");
                figureElement.classList.add("project");
                figureElement.dataset.categoryId = json.categoryId;
                figureElement.setAttribute("id", 'gallery' + json.id);
        
                const imageElement = document.createElement("img");
                imageElement.crossOrigin = "Anonymous";
                imageElement.src = json.imageUrl;
        
                const nomElement = document.createElement("figcaption");
                nomElement.crossOrigin = "Anonymous";
                nomElement.innerText = json.title;
        
                sectionGallery.appendChild(figureElement);
        
                figureElement.appendChild(imageElement);
                figureElement.appendChild(nomElement);


                //PARTIE MODALE
                const sectionModale = document.querySelector(".projetsModale");

                const figureElementModale = document.createElement("figure");
                figureElementModale.classList.add("project-modale");
                figureElementModale.dataset.categoryId = json.categoryId;
                figureElementModale.setAttribute("id", 'modale' + json.id)
               
                let deleteButton = factoryButtonDelete(json.id, "fa-solid", "fa-trash-can");

                //CREATION DES BALISES IMAGE ET ICONE
                const imageElementModale = document.createElement("img");
                imageElementModale.crossOrigin = "Anonymous";
                imageElementModale.src = json.imageUrl;
        
                //CREATION DES BALISES DIV CONTAINERS POUR IMAGE + ICONE SUPPR
                const containerImage = document.createElement("div");
                containerImage.classList.add("container");

                //FIGURE EST PARENT DE CONTAINER
                figureElementModale.appendChild(containerImage);

                //CONTAINER EST PARENT DE IMAGE + ICONE SUPPR
                containerImage.appendChild(imageElementModale);
                containerImage.appendChild(deleteButton);

                //FIGURE EST ENFANT DE MODALE
                sectionModale.appendChild(figureElementModale);

                //IMAGE ET NOMS SONT ENFANTS DE FIGURE
                const nomElementModale = document.createElement("figcaption");
                nomElementModale.crossOrigin = "Anonymous";
                nomElementModale.innerText = "éditer";
                figureElementModale.appendChild(nomElementModale);

                //PARTIE SUR L'AJOUT DE LA COMMANDE SUPPRIMER
                

                deleteButton.addEventListener("click", function () {
                    fetch ("http://localhost:5678/api/works/" + json.id, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + sessionStorage.token
                        },
                    })
                    .then(res => {console.log (res.status);
                        if(res.status==204){
                            const deleteProjetModale = document.getElementById('modale' + json.id);
                            deleteProjetModale.remove();
                            const deleteProjetGallery = document.getElementById('gallery' + json.id);
                            deleteProjetGallery.remove();
                            alert("Projet supprimé avec succès.");}
                        else{
                            alert("Erreur : Vous n'êtes pas autorisé à faire cette action.")
                        }
                        return res})
                })
            })
        }
    })
} 

//Permet de faire une preview de l'image sur le point d'être envoyée
var loadFile = function(event) {
    var output = document.getElementById('output');
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src)
    }

//Cette partie sert à cacher le bouton, l'icone et le span, pour que l'image s'affiche seule
    var span = document.querySelector(".restriction-add-project");
    var label = document.getElementById("file-label");
    var icone = document.getElementById("icon-modale")
    if (!output.src.length == 0){
        span.style.display = "none"
        label.style.display = "none"
        icone.style.display = "none"
    }
};


//------------MAIN------------

giveButtonsClass()
giveProjectsClass()

afficherProjets()
filtresCategories()
filtreTout()

afficherProjetsModal()

previousModalButton()
nextModal()
addCategoryModale()
submitForm()
showAdminLayout()

