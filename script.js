const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const closeModalBtnHeader = document.getElementById("close-modal-btn-header"); // Novo botão de fechar
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const observationsInput = document.getElementById("observations");
const paymentWarn = document.getElementById("payment-warn");
const trocoInput = document.getElementById("troco-input");
const pixInfo = document.getElementById("pix-info");
const pixKeyDisplay = document.getElementById("pix-key-display");

// Número de WhatsApp para onde os PEDIDOS serão enviados.
// Formato internacional: +55 (DDD sem o zero) (Número)
const WHATSAPP_ORDER_PHONE_NUMBER = "+5535999486054";

const PIX_KEY_VALUE = "(24)993133495"; // Chave PIX para pagamento (formato de exibição)

let cart = [];
let lastFocusedElement;

function closeCartModal() {
  cartModal.style.display = "none";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
  // Resetar campos de pagamento ao fechar
  trocoInput.classList.add("hidden");
  pixInfo.classList.add("hidden");
  document
    .querySelectorAll('input[name="payment-method"]')
    .forEach((radio) => (radio.checked = false));
  paymentWarn.classList.add("hidden"); // Esconde aviso de pagamento ao fechar
}

cartBtn.addEventListener("click", function () {
  lastFocusedElement = document.activeElement;
  updatecartModal();
  cartModal.style.display = "flex";
  if (closeModalBtn) closeModalBtn.focus(); // Foca no botão de fechar para acessibilidade
  if (pixKeyDisplay) {
    pixKeyDisplay.textContent = PIX_KEY_VALUE; // Exibe a chave PIX definida
  }
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

closeModalBtn.addEventListener("click", function () {
  closeCartModal();
});

if (closeModalBtnHeader) {
  closeModalBtnHeader.addEventListener("click", function () {
    closeCartModal();
  });
}

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
        text: "Ops, a lanchonete está fechada no momento! Não é possível adicionar itens.",
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

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <p class="text-center text-gray-600">Seu carrinho está vazio.</p>
    `;
  }

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

// Lógica para mostrar/esconder campos de pagamento específicos
document.querySelectorAll('input[name="payment-method"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    paymentWarn.classList.add("hidden"); // Esconde aviso ao selecionar
    if (this.value === "Dinheiro") {
      trocoInput.classList.remove("hidden");
      pixInfo.classList.add("hidden");
      trocoInput.focus();
    } else if (this.value === "PIX") {
      pixInfo.classList.remove("hidden");
      trocoInput.classList.add("hidden");
    } else {
      trocoInput.classList.add("hidden");
      pixInfo.classList.add("hidden");
    }
  });
});

checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, a lanchonete está fechada no momento!",
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
    paymentWarn.classList.add("hidden"); // Garante que o aviso de pagamento não persista
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

  // Validar forma de pagamento
  const selectedPaymentMethod = document.querySelector(
    'input[name="payment-method"]:checked'
  );
  if (!selectedPaymentMethod) {
    paymentWarn.classList.remove("hidden");
    Toastify({
      text: "Por favor, selecione uma forma de pagamento.",
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
  const paymentMethodValue = selectedPaymentMethod.value;

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
  let paymentDetails = `\nForma de Pagamento: ${paymentMethodValue}`; // Inicializa com o método de pagamento

  if (paymentMethodValue === "Dinheiro") {
    if (trocoInput.value) {
      // Remove "R$" e substitui vírgula por ponto para conversão
      const trocoParaValorStr = trocoInput.value
        .replace(/R\$\s*/, "")
        .replace(",", ".");
      const trocoPara = parseFloat(trocoParaValorStr);

      if (isNaN(trocoPara)) {
        paymentWarn.textContent =
          "☝️ Valor para troco inválido. Use apenas números.";
        paymentWarn.classList.remove("hidden");
        trocoInput.focus();
        Toastify({
          text: "Por favor, insira um valor numérico válido para o troco.",
          duration: 3000,
          // ... (estilos do Toastify)
        }).showToast();
        return;
      }

      if (trocoPara < totalPedido) {
        paymentWarn.textContent = `☝️ O valor para troco (R$ ${trocoPara.toFixed(
          2
        )}) é menor que o total do pedido (R$ ${totalPedido.toFixed(2)}).`;
        paymentWarn.classList.remove("hidden");
        trocoInput.focus();
        Toastify({
          text: "O valor do troco deve ser igual ou maior que o total do pedido.",
          duration: 4000,
          // ... (estilos do Toastify)
        }).showToast();
        return;
      }

      const trocoCalculado = trocoPara - totalPedido;
      paymentDetails += ` (Pagar com: R$ ${trocoPara.toFixed(
        2
      )} - Troco: R$ ${trocoCalculado.toFixed(2)})`;
    } else {
      // Se for dinheiro mas não especificou troco, apenas informa "Dinheiro"
      // paymentDetails já está como "\nForma de Pagamento: Dinheiro"
    }
  }

  const message = encodeURIComponent(
    `Olá, gostaria de fazer o seguinte pedido:\n${cartItemsText}\n\nTotal: R$${totalPedido.toFixed(
      2
    )}\n\nEndereço de entrega: ${addressInput.value}${
      clientObservations ? `\n\nObservações: ${clientObservations}` : ""
    }${paymentDetails}`
  );

  // Mostrar confirmação e desabilitar botão antes de abrir WhatsApp
  checkoutBtn.disabled = true;
  checkoutBtn.innerText = "Enviando seu pedido...";

  Toastify({
    text: "Quase lá! Preparando seu pedido para envio via WhatsApp...",
    duration: 3500, // Duração um pouco maior
    close: true,
    gravity: "top",
    position: "center", // Centralizado para mais destaque
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  setTimeout(() => {
    window.open(
      `https://wa.me/${WHATSAPP_ORDER_PHONE_NUMBER}?text=${message}`,
      "_blank",
      "noopener noreferrer"
    );

    // Limpar carrinho e reabilitar botão APÓS o timeout e tentativa de abrir WhatsApp
    // (ou pode ser feito no evento 'focus' da janela para saber se o usuário voltou)
    cart = [];
    addressInput.value = "";
    observationsInput.value = "";
    trocoInput.value = "";
    trocoInput.classList.add("hidden");
    pixInfo.classList.add("hidden");
    paymentWarn.classList.add("hidden");
    document
      .querySelectorAll('input[name="payment-method"]')
      .forEach((radio) => (radio.checked = false));
    updatecartModal();

    checkoutBtn.disabled = false;
    checkoutBtn.innerText = "Finalizar pedido";
  }, 2000); // Pequeno delay para o usuário ver a mensagem/botão desabilitado
});

function checkRestaurantOpen() {
  const agora = new Date();
  const diaDaSemana = agora.getDay(); // 0 (Domingo) a 6 (Sábado)
  const horaAtual = agora.getHours();

  let horaAbertura;
  const horaFechamento = 23; // O restaurante fecha às 23:00, então opera até 22:59.

  // Verifica se é Terça-feira (diaDaSemana === 2)
  if (diaDaSemana === 2) {
    return false; // Fechado na Terça-feira
  }
  // Domingo (diaDaSemana === 0)
  else if (diaDaSemana === 0) {
    horaAbertura = 20; // Domingo abre às 20h
  }
  // Segunda, Quarta, Quinta, Sexta, Sábado
  else {
    horaAbertura = 19; // Outros dias abertos (exceto terça) abrem às 19h
  }

  return horaAtual >= horaAbertura && horaAtual < horaFechamento;
}

function atualizarStatusFuncionamentoHeader() {
  const dateSpanElement = document.getElementById("date-span");
  if (!dateSpanElement) {
    return;
  }
  const spanTextElement = dateSpanElement.querySelector("span");
  if (!spanTextElement) return;

  const isOpen = checkRestaurantOpen();
  const horarioTextoFechado = "Seg, Qua-Sáb: 19h-23h | Dom: 20h-23h (Terça Fechado)"; // Atualizado para o novo formato

  if (isOpen) {
    dateSpanElement.classList.remove("bg-red-500");
    dateSpanElement.classList.add("bg-green-600");
    spanTextElement.textContent = `Aberto Agora`;
  } else {
    dateSpanElement.classList.remove("bg-green-600");
    dateSpanElement.classList.add("bg-red-500");
    spanTextElement.textContent = `Fechado - ${horarioTextoFechado}`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Adiciona a classe 'loaded' ao body para ativar o efeito de fade-in da página
  document.body.classList.add("loaded");

  // Atualiza o ano no rodapé
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
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

  // Funcionalidade para copiar a Chave PIX
  const copyPixKeyButton = document.getElementById("copy-pix-key-btn");
  // pixKeyDisplay e pixInfo já são definidos globalmente no seu script.js

  if (copyPixKeyButton && pixKeyDisplay && pixInfo) {
    copyPixKeyButton.addEventListener("click", () => {
      // Só tenta copiar se a seção PIX estiver visível
      if (!pixInfo.classList.contains("hidden")) {
        const pixKey = pixKeyDisplay.innerText; // Ou .textContent
        navigator.clipboard
          .writeText(pixKey)
          .then(() => {
            Toastify({
              text: "Chave PIX copiada!",
              duration: 3000,
              close: true,
              gravity: "top", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              stopOnFocus: true, // Prevents dismissing of toast on hover
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
              onClick: function () {}, // Callback after click
            }).showToast();
          })
          .catch((err) => {
            console.error("Erro ao copiar a chave PIX: ", err);
            Toastify({
              text: "Erro ao copiar. Tente manualmente.",
              duration: 3000,
              close: true,
              gravity: "top",
              position: "right",
              style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
              },
            }).showToast();
          });
      }
    });
  } else {
    if (!copyPixKeyButton)
      console.warn("Botão 'copy-pix-key-btn' não encontrado.");
    if (!pixKeyDisplay)
      console.warn("Elemento 'pix-key-display' não encontrado.");
    if (!pixInfo) console.warn("Elemento 'pix-info' não encontrado.");
  }
});
