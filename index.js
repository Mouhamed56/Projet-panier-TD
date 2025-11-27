document.addEventListener('DOMContentLoaded', () => {
  // Sélecteurs
  const cartItemsContainer = document; // si items dispersés, on peut écouter tout le document
  const totalPriceEl = document.getElementById('total-price');

  // Helper : formater le prix en "fr-FR" avec symbole €
  function formatPrice(num) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num);
  }

  // Calcule et affiche le total courant
  function updateTotal() {
    const items = document.querySelectorAll('.cart-item');
    let total = 0;
    items.forEach(item => {
      const price = parseFloat(item.dataset.price || '0'); // prix unitaire
      const qtyEl = item.querySelector('.quantity');
      const qty = qtyEl ? parseInt(qtyEl.textContent || '0', 10) : 0;
      total += price * qty;
    });
    totalPriceEl.textContent = formatPrice(total);
  }

  // Crée les handlers pour un item donné (util si tu ajoutes dynamiquement des items)
  function wireItem(item) {
    if (!item) return;

    const plus = item.querySelector('.plus');
    const minus = item.querySelector('.minus');
    const qtyEl = item.querySelector('.quantity');
    const removeBtn = item.querySelector('.remove-btn');
    const likeBtn = item.querySelector('.like-btn');

    // Sécurité : assure une quantité initiale >= 0
    if (qtyEl && (isNaN(parseInt(qtyEl.textContent, 10)) || parseInt(qtyEl.textContent, 10) < 0)) {
      qtyEl.textContent = '0';
    }

    if (plus) {
      plus.addEventListener('click', () => {
        const current = parseInt(qtyEl.textContent, 10) || 0;
        qtyEl.textContent = String(current + 1);
        updateTotal();
      });
    }

    if (minus) {
      minus.addEventListener('click', () => {
        const current = parseInt(qtyEl.textContent, 10) || 0;
        // Option : ne pas aller en dessous de 1. Si tu veux permettre 0, change la condition.
        if (current > 1) {
          qtyEl.textContent = String(current - 1);
          updateTotal();
        } else {
          // Si tu veux que le moins à 0 supprime l'item, utilise removeItem(item) ici.
          // Ex : removeItem(item);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        item.remove();
        updateTotal();
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
        // toggle state
        likeBtn.setAttribute('aria-pressed', String(!pressed));
        // changement visuel (tu peux remplacer par une classe CSS .liked)
        if (!pressed) {
          likeBtn.classList.add('liked'); // styler .liked en CSS pour couleur rouge, etc.
        } else {
          likeBtn.classList.remove('liked');
        }
      });
    }
  }

  // Initial wiring pour les items déjà dans le DOM
  function wireAllItems() {
    const items = document.querySelectorAll('.cart-item');
    items.forEach(wireItem);
  }

  // Si des items sont ajoutés dynamiquement, on peut utiliser MutationObserver
  // pour "wire" automatiquement les nouveaux éléments.
  function observeNewItems() {
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches('.cart-item')) {
            wireItem(node);
            updateTotal();
          } else {
            // enfants potentiels
            const nested = node.querySelector && node.querySelector('.cart-item');
            if (nested) {
              wireItem(nested);
              updateTotal();
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Fonction d'initialisation
  function initCart() {
    wireAllItems();
    observeNewItems();
    updateTotal();
  }

  // Lance l'init
  initCart();
});
