const BUSINESS_WHATSAPP_NUMBER = "212766551470";

const paymentMethods = [
  {
    id: "cash",
    title: "Paiement a la livraison",
    description: "Le client paie en especes quand la commande arrive.",
    help: "Aucun paiement en ligne n'est demande. Nous confirmons la livraison par WhatsApp.",
  },
  {
    id: "transfer",
    title: "Virement bancaire",
    description: "La commande est confirmee sur WhatsApp, puis vous envoyez le RIB au client.",
    help: "Ajoutez votre RIB bancaire dans le message WhatsApp apres reception de la commande.",
  },
  {
    id: "whatsapp",
    title: "Commande WhatsApp",
    description: "Le client envoie directement sa commande sur WhatsApp.",
    help: "WhatsApp s'ouvre avec tous les details de la commande deja remplis.",
  },
];

let selectedOrder = null;

async function postJson(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

function getPriceFromText(text) {
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getPaymentHelp(paymentId) {
  return paymentMethods.find((method) => method.id === paymentId)?.help || "";
}

function createCheckoutModal() {
  const modal = document.createElement("section");
  modal.className = "checkout-modal";
  modal.id = "checkout-modal";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div class="checkout-backdrop" data-close-checkout></div>

    <div class="checkout-panel" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <button class="checkout-close" type="button" aria-label="Fermer" data-close-checkout>
        &times;
      </button>

      <div class="checkout-header">
        <span class="checkout-eyebrow">Commande securisee</span>
        <h2 id="checkout-title">Choisissez le paiement</h2>
      </div>

      <div class="order-summary">
        <p>Produit selectionne</p>
        <strong id="checkout-product-name">-</strong>
        <span id="checkout-product-price">0 DH</span>
      </div>

      <form class="checkout-form" id="checkout-form">
        <div class="form-grid">
          <label>
            Nom complet
            <input type="text" name="name" placeholder="Votre nom" required>
          </label>

          <label>
            Telephone
            <input type="tel" name="phone" placeholder="+212 6 00 00 00 00" required>
          </label>

          <label class="full-field">
            Adresse de livraison
            <textarea name="address" rows="3" placeholder="Ville, quartier, adresse..." required></textarea>
          </label>
        </div>

        <fieldset class="payment-fieldset">
          <legend>Mode de paiement</legend>
          <div class="payment-options">
            ${paymentMethods.map((method, index) => `
              <label class="payment-option">
                <input type="radio" name="payment" value="${method.id}" ${index === 0 ? "checked" : ""}>
                <span>
                  <strong>${method.title}</strong>
                  <small>${method.description}</small>
                </span>
              </label>
            `).join("")}
          </div>
          <p class="payment-help" id="payment-help">${paymentMethods[0].help}</p>
        </fieldset>

        <button class="confirm-order" type="submit">
          Confirmer sur WhatsApp
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);
}

function createWhatsAppButton() {
  const link = document.createElement("a");
  link.className = "whatsapp-float";
  link.href = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour, je veux des informations sur vos produits.")}`;
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", "Contacter La Rose Eternelle sur WhatsApp");
  link.textContent = "WhatsApp";

  document.body.appendChild(link);
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "added-notification";
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2500);
}

function openCheckout(product) {
  selectedOrder = product;

  document.getElementById("checkout-product-name").textContent = product.name;
  document.getElementById("checkout-product-price").textContent = `${product.price} DH`;

  const modal = document.getElementById("checkout-modal");
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("checkout-open");
}

function closeCheckout() {
  const modal = document.getElementById("checkout-modal");
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("checkout-open");
}

function getVaseProduct(button) {
  const card = button.closest(".vase-box");
  const name = card.querySelector("h3").textContent.trim();
  const priceText = card.querySelector(".vase-price").textContent;

  return {
    name,
    price: getPriceFromText(priceText),
  };
}

function getPackProduct(button) {
  const card = button.closest(".pack-container");
  const name = card.querySelector(".pack-title").textContent.trim();
  const priceText = card.querySelector(".total-price").textContent;

  return {
    name,
    price: getPriceFromText(priceText),
  };
}

function enableVaseTilt() {
  document.querySelectorAll(".vase-box").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 16;
      const rotateX = (0.5 - y / rect.height) * 14;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-18px) scale(1.035)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });

    card.addEventListener("blur", () => {
      card.style.transform = "";
    });
  });
}

function buildWhatsAppMessage(order) {
  return [
    "Bonjour La Rose Eternelle,",
    "",
    `Je veux confirmer la commande ${order.id}.`,
    `Produit: ${order.product.name}`,
    `Prix: ${order.product.price} DH`,
    `Paiement: ${order.payment.title}`,
    "",
    "Informations client:",
    `Nom: ${order.customer.name}`,
    `Telephone: ${order.customer.phone}`,
    `Adresse: ${order.customer.address}`,
    "",
    "Merci de confirmer la disponibilite et la livraison.",
  ].join("\n");
}

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

async function submitOrder(form) {
  const formData = new FormData(form);
  const paymentMethod = paymentMethods.find((method) => method.id === formData.get("payment"));

  const order = {
    id: `LR-${Date.now().toString().slice(-8)}`,
    product: selectedOrder,
    payment: paymentMethod,
    customer: {
      name: formData.get("name").trim(),
      phone: formData.get("phone").trim(),
      address: formData.get("address").trim(),
    },
    createdAt: new Date().toISOString(),
  };

  saveOrder(order);

  try {
    await postJson("api/orders.php", order);
  } catch (error) {
    console.warn("Order saved locally, but not in database:", error);
  }

  const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
  window.open(whatsappUrl, "_blank", "noopener");

  form.reset();
  document.getElementById("payment-help").textContent = getPaymentHelp("cash");
  closeCheckout();
  showNotification("Commande preparee. WhatsApp va s'ouvrir.");
}

function setupContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const contactMessage = {
      name: formData.get("name").trim(),
      phone: formData.get("phone").trim(),
      subject: formData.get("subject"),
      message: formData.get("message").trim(),
    };

    const message = [
      "Bonjour La Rose Eternelle,",
      "",
      `Sujet: ${contactMessage.subject}`,
      `Nom: ${contactMessage.name}`,
      `Telephone: ${contactMessage.phone}`,
      "",
      "Message:",
      contactMessage.message,
    ].join("\n");

    try {
      await postJson("api/contact.php", contactMessage);
    } catch (error) {
      console.warn("Contact message was not saved in database:", error);
    }

    window.open(
      `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener",
    );

    contactForm.reset();
    showNotification("Message prepare. WhatsApp va s'ouvrir.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createCheckoutModal();
  createWhatsAppButton();
  enableVaseTilt();
  setupContactForm();

  document.addEventListener("click", (event) => {
    const buyVaseButton = event.target.closest(".btn-acheter");
    const buyPackButton = event.target.closest(".btn-acheter-pack");

    if (buyVaseButton) {
      openCheckout(getVaseProduct(buyVaseButton));
    }

    if (buyPackButton) {
      openCheckout(getPackProduct(buyPackButton));
    }

    if (event.target.closest("[data-close-checkout]")) {
      closeCheckout();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target.name === "payment") {
      document.getElementById("payment-help").textContent = getPaymentHelp(event.target.value);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCheckout();
    }
  });

  document.getElementById("checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    submitOrder(event.currentTarget);
  });
});
