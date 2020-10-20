const container = document.querySelector(".container"); // Cible la balise dans laquelle ajouter le message

// Vérifie que l'on a bien les informations de la commande
if (localStorage.getItem("orderData") && localStorage.getItem("orderPrice")) {
  const orderData = JSON.parse(localStorage.orderData);
  const firstName = Object.values(orderData.contact.firstName).join("");
  const orderId = Object.values(orderData.orderId).join("");
  const price = localStorage.getItem("orderPrice");

  // Crée et ajoute un template
  container.innerHTML += `
    <div class="text-center h5">
      <p class="mb-3">Voici votre identifiant de commande:</p>
      <p class="mb-5"><mark>${orderId}</mark></p>
      <p class="text-warning mb-5">Merci de garder cet identifiant jusqu'a reception de votre commande.</p>
      <p class="mb-5">La somme de <mark>${price}</mark> sera prochainement débitée sur votre compte.</p>
      <p><em>Merci de nous avoir fait confiance pour cette commande ${firstName} !</em></p>
    </div>
  `;
} else {
  container.innerHTML += `
    <p class="text-center h4 mt-5 margin-top">Aucune commande passée.</p>
  `;
}


