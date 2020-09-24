const APIurl = "http://localhost:3000/api/teddies/";
const id = document.location.search.substring(5); // Récupère l'id du produit 
const urlId = APIurl + id; // URL du produit + API

const container = document.querySelector(".container");

// Récupère 1 produit
const fetchProduct = async () => {
  try {
    const response = await fetch(urlId);
    return await response.json(); // Renvoie la requête
  } catch (error) {
    container.innerHTML += `
      <p class="h5 text-center font-weight-bold text-danger margin-top">Erreur serveur, veuillez réessayer ultérieurement.</p>
      <p class="h5 text-center text-danger">Merci de votre compréhension</p>
    `;
    return console.log(error);
  }
};

fetchProduct().then(teddie => {
  // Crée et ajoute un template
  container.innerHTML += `

    <div class="card">
        <h5 class="card-header">${teddie.name}</h5>
        <div class="card-body cardContainer">

            <img class="col col-md-7 card-img-top teddieImage px-0" src="${teddie.imageUrl}" alt="Ours en peluche ${teddie.name}">
            <div class="leftContainer">
                <p class="card-text cardDescription">${teddie.description}</p>
                <div class="form-group colorGroup m-0">
                <p class="chooseColor">Choose your color : </p>
                    <select class="form-control selectColor">${teddie.colors.map((color) => `<option>${color}</option>`)}</select>
                </div>
                <a class="priceButtonContainer">
                    <button class="btn priceButton mt-2 w-10">Ajouter au panier</button>
                </a>
            </div>
            
        </div>
    </div>

  `;
});