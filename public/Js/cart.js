const APIurl = "http://localhost:3000/api/teddies";
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
  
    // Crée un template pour chaque élément de l'array si le contenu du panier n'est pas vide
    if (!localStorage.getItem("cartContent")) {
      container.innerHTML += `<p class="table text-center h4 mt-5 margin-top">Votre panier est vide.</p>`;
    } else {
      const cartItems = cartContent.map(itemId => {
        const cartItem = data.find(item => item._id === itemId); // Renvoie les détails d'un produit si son id correspond à l'id sauvegardé
        priceCount += cartItem.price; // Incrémente le compteur du prix de chaque produit
        return `
          <tr>
            <th scope="row">
              <i ></i>
              <a href="product.html?_id:${cartItem._id}">${cartItem.name}
            </th>
            <td>${formatter.format(cartItem.price / 100)}</td>
          </tr>
        `;
      }).join(""); // Assemble les templates
  
      // Crée et ajoute un template qui contient le template crée précédemment
      container.innerHTML += `
        <table >
          <thead>
            <tr>
              <th scope="col">Nom du produit</th>
              <th scope="col" class="text-right">Prix</th>
            </tr>
          </thead>
          <tbody >${cartItems}</tbody>
        </table>
      `;

    container.innerHTML += `<p class="text-right font-weight-bold total-price">Total : ${formatter.format(priceCount / 100)} </p>`; // Ajoute le prix total à la balise ciblée

  }
});