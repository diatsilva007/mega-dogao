const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const observationsInput = document.getElementById("observations");

const WHATSAPP_PHONE_NUMBER = "+5535997714779"; // Atualize com seu número se necessário

let cart = [];
let lastFocusedElement;

function closeCartModal() {
  cartModal.style.display = "none";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

cartBtn.addEventListener("click", function () {
  lastFocusedElement = document.activeElement;
  updatecartModal();
  cartModal.style.display = "flex";
  if (closeModalBtn) closeModalBtn.focus();
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

closeModalBtn.addEventListener("click", function () {
  closeCartModal();
});

window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && cartModal.style.display === "flex") {
    closeCartModal();
  }
});

document.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
      Toastify({
        text: "Ops, o restaurante está fechado no momento! Não é possível adicionar itens.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#ef4444",
        },
      }).showToast();
      return;
    }

    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);

    Toastify({
      text: `"${name}" adicionado ao carrinho!`,
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
    }).showToast();
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    existingItem.price = price; // Garante que o preço seja atualizado se houver promoções dinâmicas
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }
  updatecartModal();
}

function updatecartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "items-start", // Alterado para items-start para melhor alinhamento se o nome for longo
      "border-b",
      "pb-3"
    );

    cartItemElement.innerHTML = `
        <div class="flex-1">
                <p class="font-medium">${item.name}</p>
                <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
                <div class="flex items-center gap-3 my-2">
                    <button class="cart-item-action-btn text-red-500 hover:text-red-700 px-2 py-1 rounded" data-name="${
                      item.name
                    }" data-action="decrease" aria-label="Diminuir quantidade de ${
      item.name
    }">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="font-medium w-5 text-center" aria-live="polite">${
                      // aria-live para leitores de tela
                      item.quantity
                    }</span>
                    <button class="cart-item-action-btn text-green-500 hover:text-green-700 px-2 py-1 rounded" data-name="${
                      item.name
                    }" data-action="increase" aria-label="Aumentar quantidade de ${
      item.name
    }">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
        </div>
        <div>
            <button class="cart-item-action-btn text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded" data-name="${
              item.name
            }" data-action="remove_all" aria-label="Remover ${
      item.name
    } do carrinho">
                <i class="fas fa-trash-alt mr-1"></i>Remover
            </button>
        </div>
    `; // Adicionado aria-label para botões
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

cartItemsContainer.addEventListener("click", function (event) {
  const button = event.target.closest(".cart-item-action-btn");
  if (button) {
    const name = button.getAttribute("data-name");
    const action = button.getAttribute("data-action");

    if (action === "decrease") {
      removeItemCart(name);
    } else if (action === "increase") {
      increaseItemQuantity(name);
    } else if (action === "remove_all") {
      removeAllUnitsOfItem(name);
    }
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updatecartModal();
  }
}

function increaseItemQuantity(name) {
  const item = cart.find((i) => i.name === name);
  if (item) {
    item.quantity += 1;
    updatecartModal();
  }
}

function removeAllUnitsOfItem(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    cart.splice(index, 1);
    updatecartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;
  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) {
    Toastify({
      text: "Seu carrinho está vazio!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    addressInput.focus(); // Foca no campo de endereço
    Toastify({
      text: "Por favor, informe seu endereço.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  const cartItemsText = cart
    .map((item) => {
      return `\n- ${item.name} (Qtd: ${
        item.quantity
      }) - Preço: R$${item.price.toFixed(2)}`;
    })
    .join("");

  const totalPedido = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const clientObservations = observationsInput.value;

  const message = encodeURIComponent(
    `Olá, gostaria de fazer o seguinte pedido:\n${cartItemsText}\n\nTotal: R$${totalPedido.toFixed(
      2
    )}\n\nEndereço de entrega: ${addressInput.value}${
      clientObservations ? `\n\nObservações: ${clientObservations}` : ""
    }`
  );

  window.open(
    `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${message}`,
    "_blank",
    "noopener noreferrer"
  );

  cart = [];
  addressInput.value = "";
  observationsInput.value = "";
  updatecartModal();
});

function checkRestaurantOpen() {
  const agora = new Date();
  const horaAtual = agora.getHours();
  // Horário de funcionamento: 18:00 (18) até 01:00 da manhã (1)
  const horaAbertura = 18;
  const horaFechamento = 1; // 1 da manhã

  // Se a hora atual for maior ou igual à hora de abertura (ex: 18, 19, ..., 23)
  // OU se a hora atual for menor que a hora de fechamento (ex: 00 - meia-noite)
  // Isso cobre o período que atravessa a meia-noite.
  return horaAtual >= horaAbertura || horaAtual < horaFechamento;
}

function atualizarStatusFuncionamentoHeader() {
  const dateSpanElement = document.getElementById("date-span");
  if (!dateSpanElement) {
    return;
  }
  const spanTextElement = dateSpanElement.querySelector("span");
  if (!spanTextElement) return;

  const isOpen = checkRestaurantOpen();
  const horarioTextoBase = "Seg á Dom - 18:00 às 01:00";

  if (isOpen) {
    dateSpanElement.classList.remove("bg-red-500");
    dateSpanElement.classList.add("bg-green-600");
    spanTextElement.textContent = `${horarioTextoBase} (Aberto)`;
  } else {
    dateSpanElement.classList.remove("bg-green-600");
    dateSpanElement.classList.add("bg-red-500");
    spanTextElement.textContent = `${horarioTextoBase} (Fechado)`;
  }
}

const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", function () {
  // Adiciona a classe 'loaded' ao body para ativar o efeito de fade-in da página
  document.body.classList.add("loaded");

  atualizarStatusFuncionamentoHeader(); // Chama uma vez na carga
  setInterval(atualizarStatusFuncionamentoHeader, 60000); // Atualiza a cada minuto

  // Lógica para o Botão "Voltar ao Topo"
  const backToTopButton = document.getElementById("back-to-top-btn");
  if (backToTopButton) {
    const scrollThreshold = 300; // Mostrar o botão após rolar 300px

    window.addEventListener("scroll", () => {
      if (window.scrollY > scrollThreshold) {
        backToTopButton.classList.remove("opacity-0", "pointer-events-none");
        backToTopButton.classList.add("opacity-100", "pointer-events-auto");
      } else {
        backToTopButton.classList.remove("opacity-100", "pointer-events-auto");
        backToTopButton.classList.add("opacity-0", "pointer-events-none");
      }
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Função genérica para observar elementos e aplicar animação
  function observeAndAnimateElements(
    selector,
    initialClassesToRemove,
    threshold = 0.1
  ) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: threshold,
      };

      const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Elemento entrou na viewport: remover classes para animar
            initialClassesToRemove.forEach((cls) =>
              entry.target.classList.remove(cls)
            );
            // Não vamos mais fazer unobserve para que a animação possa repetir
          } else {
            // Elemento saiu da viewport: adicionar classes de volta para resetar o estado
            initialClassesToRemove.forEach((cls) =>
              entry.target.classList.add(cls)
            );
          }
        });
      };

      const elementObserver = new IntersectionObserver(
        observerCallback,
        observerOptions
      );
      elements.forEach((element) => {
        elementObserver.observe(element);
      });
    }
  }

  // Animação de entrada para colunas do rodapé
  observeAndAnimateElements(
    ".footer-animate-column",
    ["opacity-0", "translate-y-5"],
    0.1
  );

  // Animação de entrada para elementos de seção variados
  observeAndAnimateElements(
    ".animate-section-element",
    ["opacity-0", "translate-y-3"],
    0.1
  );
});
