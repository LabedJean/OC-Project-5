const APIurl = "http://localhost:3000/api/teddies";
const urlPost = "http://localhost:3000/api/teddies/order"; // URL de l'API pour la requête POST
const container = document.querySelector(".container"); 

// Récupère les produits
const fetchProducts = async () => {
  try {
    const response = await fetch(APIurl);
    return await response.json(); // Renvoie la requête en JSON
  } catch (error) {
    container.innerHTML += `
    <p class="h5 text-center font-weight-bold text-danger margin-top">Erreur serveur, veuillez réessayer ultérieurement.</p>
    <p class="h5 text-center text-danger">Merci de votre compréhension</p>
    `;
    return console.log(error);
  }
};

// Utilise les données de l'array JSON récupéré
fetchProducts().then(data => {
    const formatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }); // Formatte un nombre en devise
    const cartContent = JSON.parse(localStorage.getItem("cartContent")); // Récupère les données du localStorage sous forme d'array
    let priceCount = 0; // Démarre un count
  
    // Crée un template pour chaque élément de l'array si le localStorage n'est pas vide
    if (!localStorage.getItem("cartContent")) {
      container.innerHTML += `<p class="table text-center h4 mt-5 margin-top">Votre panier est vide.</p>`;
    } else {
      const cartItems = cartContent.map(itemId => {
        const cartItem = data.find(item => item._id === itemId); // Renvoie les détails d'un produit si son id correspond à l'id sauvegardé
        priceCount += cartItem.price; // Incrémente le compteur du prix de chaque produit
        return `
          <tr>
          <td><img class="imageInTable" src="${cartItem.imageUrl}" alt=""></td>
            <th scope="row">
              <i ></i>
              <a class="nameInList" href="product.html?_id:${cartItem._id}">${cartItem.name}
            </th>
            <td>${formatter.format(cartItem.price / 100)}</td>
            <td>${cartItem.description}</td>
            <td><button class="deleteButton">Supprimer</button></td>

          </tr>
        `;
      }).join(""); // Assemble les templates
  
      // Crée et ajoute un template qui contient le template crée précédemment
      container.innerHTML += `
      <div class="emptyCartContainer">
        <button class="btn emptyCartButton mt-2 w-10 empty-your-cart">Vider votre panier</button>
      </div>
        <table class="tableCart">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th class="tableHead" scope="col">Nom du produit</th>
              <th class="tableHead" scope="col">Prix</th>
              <th scope="col">Description</th>
              <th class="tableHead" scope="col"></th>
            </tr>
          </thead>
          <tbody class="cart" >${cartItems}</tbody>
        </table>
      `;

    container.innerHTML += `<p class="price"> Total : ${formatter.format(priceCount / 100)} </p>`; // Ajoute le prix total à la balise ciblée
    
    container.innerHTML += `
    <form class="mt-5 validation-form">
      <input type="text" class="form-control mb-2" id="firstName" placeholder="Prénom" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" title="2 à 30 lettres, sans accents ni caractères spéciaux." required>
      <input type="text" class="form-control mb-2" id="lastName" placeholder="Nom de famille" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" title="2 à 30 lettres, sans accents ni caractères spéciaux." required>
      <input type="text" class="form-control mb-2" id="address" placeholder="Adresse" required>
      <input type="text" class="form-control mb-2" id="city" placeholder="Ville" pattern="^[-'a-zA-ZÀ-ÖØ-öø-ÿ ]{2,30}$" required>
      <input type="email" class="form-control mb-4" id="email" placeholder="Adresse électronique" required>
      <button type="submit" class="btn btn-success w-100">Valider le panier</button>
    </form>
  `;
  }

const addToCart = document.querySelector(".empty-your-cart"); // Cible le bouton 
  addToCart.addEventListener("click", () => {
    localStorage.removeItem("cartContent");
    window.location.reload();
  });

   // Supprime un produit du tableau
   const cart = document.querySelector(".cart"); // Cible la balise contenant le tableau
   const array = Array.from(cart.children); // Crée un array contenant les éléments enfants du tableau, c'est-à-dire les différentes lignes

  // Au clic sur l'icône de suppression
  cart.addEventListener("click", event => {
    if (event.target.classList.contains("deleteButton")) {
      console.log('enter')
      const targetTr = event.target.parentElement.parentElement; // Cible la ligne du tableau qui contient l'icône ciblée
      const index = array.indexOf(targetTr); // Renvoie l'indice correspondant à cette ligne du tableau
      // Supprime l'array entier du localStorage si il n'y a qu'une ligne dans le tableau
      if (array.length === 1) {
        localStorage.removeItem("cartContent");
        window.location.reload();
        // Supprime les produits individuellement
      } else {
        cartContent.splice(index, 1); // Supprime l'élément de l'array dont l'indice est celui de la ligne ciblée précédemment
        localStorage.setItem("cartContent", JSON.stringify(cartContent));
        window.location.reload();
      }
    }
  });

   // Envoie le formulaire de contact et la liste des produits
   const form = document.querySelector(".validation-form"); // Cible le formulaire
   const { firstName, lastName, address, city, email } = form; // Déstructure les éléments du formulaire

  form.addEventListener("submit", event => {
    event.preventDefault();
    // Envoie la commande
    const postProducts = async () => {
      try {
        const response = await fetch(urlPost, {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            contact: {
              firstName: firstName.value.trim(),
              lastName: lastName.value.trim(),
              address: address.value.trim(),
              city: city.value.trim(),
              email: email.value.trim(),
            },
            products: cartContent,
          }),
        });
        return await response.json(); // Renvoie la réponse du serveur en JSON
      } catch (error) {
        container.innerHTML += `<p class="h5 text-center font-weight-bold text-danger mt-4">Un problème est survenu lors de la transmission de votre commande.</p>`;
        return console.log(error);
      }
    };

    // Utilise les données renvoyées par le serveur
    postProducts().then((orderData) => {
      localStorage.clear(); // Remet à zéro le localStorage
      localStorage.setItem("orderData", JSON.stringify(orderData)); // Enregistre les informations de la commande dans le localStorage
      localStorage.setItem("orderPrice", formatter.format(priceCount / 100));
      if (localStorage.getItem("orderData") !== "undefined") {
        window.location.href = "confirmation.html"; // Redirige vers la page de confirmation
      }
    });
  });

  
});
