const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const observationsInput = document.getElementById("observations"); // Novo campo

const WHATSAPP_PHONE_NUMBER = "+5535997714779"; // Número de WhatsApp para o pedido

let cart = [];
let lastFocusedElement; // Para restaurar o foco ao fechar o modal

// Função para fechar o modal do carrinho e restaurar o foco
function closeCartModal() {
  cartModal.style.display = "none";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  lastFocusedElement = document.activeElement; // Salva o elemento que tinha foco
  updatecartModal();
  cartModal.style.display = "flex";
  closeModalBtn.focus(); // Move o foco para o botão de fechar dentro do modal
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    closeCartModal();
  }
});

// Fechar o modal quando clicar no botão fechar
closeModalBtn.addEventListener("click", function () {
  closeCartModal();
});

// Fechar o modal com a tecla Escape
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && cartModal.style.display === "flex") {
    closeCartModal();
  }
});

// Adicionar item ao carrinho ao clicar no botão
// Alterado para escutar no documento inteiro para cobrir todos os botões .add-to-cart-btn
document.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    // Verificar se o restaurante está aberto ANTES de adicionar ao carrinho
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
      Toastify({
        text: "Ops, o restaurante está fechado no momento! Não é possível adicionar itens.",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Impede que o brinde seja descartado ao passar o mouse
        style: {
          background: "#ef4444", // Vermelho
        },
      }).showToast();
      return; // Impede a adição ao carrinho
    }

    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);

    Toastify({
      text: `"${name}" adicionado ao carrinho!`,
      duration: 2000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Impede que o brinde seja descartado ao passar o mouse
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)", // Verde
      },
    }).showToast();
  }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // Se o item já existe, aumenta a quantidade e atualiza o preço
    existingItem.quantity += 1;
    existingItem.price = price; // Atualiza o preço para o mais recente
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updatecartModal();
}

// Atualiza carrinho
function updatecartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "items-start", // Alinhamento vertical para melhor visualização com os botões
      "border-b", // Adiciona uma linha separadora sutil
      "pb-3" // Espaçamento abaixo da linha
    );

    cartItemElement.innerHTML = `
        <div class="flex-1">
                <p class="font-medium">${item.name}</p>
                <p class="font-medium mt-1">R$ ${item.price.toFixed(2)}</p>
                <div class="flex items-center gap-3 my-2">
                    <button class="cart-item-action-btn text-red-500 hover:text-red-700 px-2 py-1 rounded" data-name="${
                      item.name
                    }" data-action="decrease">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="font-medium w-5 text-center">${
                      item.quantity
                    }</span>
                    <button class="cart-item-action-btn text-green-500 hover:text-green-700 px-2 py-1 rounded" data-name="${
                      item.name
                    }" data-action="increase">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
        </div>
        <div>
            <button class="cart-item-action-btn text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded" data-name="${
              item.name
            }" data-action="remove_all">
                <i class="fas fa-trash-alt mr-1"></i>Remover
            </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.textContent = cart.reduce((acc, item) => acc + item.quantity, 0); // Mostra a quantidade total de itens
}

// Função para remover o item do carrinho
// Modificada para lidar com diferentes ações nos itens do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  const button = event.target.closest(".cart-item-action-btn");
  if (button) {
    const name = button.getAttribute("data-name");
    const action = button.getAttribute("data-action");

    if (action === "decrease") {
      removeItemCart(name); // Esta função já decrementa ou remove se qtd=1
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
    cart.splice(index, 1); // Remove o item completamente do array
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

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Impede que o brinde seja descartado ao passar o mouse
      style: {
        background: "#ef4444", // Vermelho
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
        background: "#ef4444", // Vermelho
      },
    }).showToast();
    return;
  }

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    Toastify({
      text: "Por favor, informe seu endereço.",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444", // Vermelho
      },
    }).showToast();
    return;
  }

  // Enviar o pedido para api whatsapp
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
    "noopener noreferrer" // Adicionado rel="noopener noreferrer" por segurança
  );

  cart = [];
  addressInput.value = ""; // Limpar o campo de endereço
  observationsInput.value = ""; // Limpar o campo de observações
  updatecartModal();
});

// Função para verificar se o restaurante está aberto (18:00 às 01:00 do dia seguinte)
function checkRestaurantOpen() {
  const agora = new Date();
  const horaAtual = agora.getHours();
  // const diaDaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  // Pode ser usado se houver dias específicos de fechamento

  // Horário de funcionamento: 18:00 (inclusive) até 01:00 (exclusive) do dia seguinte
  const horaAbertura = 18; // 18:00
  const horaFechamento = 1; // 01:00 da manhã (do dia seguinte)

  // Se a hora atual for igual ou maior que a hora de abertura (ex: 18:00, 19:00 ... 23:00)
  // OU se a hora atual for menor que a hora de fechamento (ex: 00:00, 00:30 - referente à janela que começou no dia anterior)
  return horaAtual >= horaAbertura || horaAtual < horaFechamento;
}

// Função para atualizar o status de funcionamento no header
function atualizarStatusFuncionamentoHeader() {
  const dateSpanElement = document.getElementById("date-span");
  if (!dateSpanElement) {
    console.warn("Elemento #date-span não encontrado no header.");
    return;
  }
  const spanTextElement = dateSpanElement.querySelector("span");
  const isOpen = checkRestaurantOpen();

  const horarioTextoBase = "Seg á Dom - 18:00 às 01:00";

  if (isOpen) {
    dateSpanElement.classList.remove("bg-red-500"); // Garante que a cor de fechado seja removida
    dateSpanElement.classList.add("bg-green-600");
    spanTextElement.textContent = `${horarioTextoBase} (Aberto)`;
  } else {
    dateSpanElement.classList.remove("bg-green-600"); // Garante que a cor de aberto seja removida
    dateSpanElement.classList.add("bg-red-500"); // Adiciona classe para fechado (vermelho)
    spanTextElement.textContent = `${horarioTextoBase} (Fechado)`;
  }
}

// Adicionar ano corrente no rodapé
const currentYearSpan = document.getElementById("current-year");
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// Chamar a atualização do status do header quando o DOM estiver carregado
// e configurar para atualizar periodicamente (opcional)
document.addEventListener("DOMContentLoaded", function () {
  atualizarStatusFuncionamentoHeader(); // Chama na carga inicial

  // Opcional: Atualizar o status periodicamente (ex: a cada minuto)
  setInterval(atualizarStatusFuncionamentoHeader, 60000); // 60000 ms = 1 minuto
});
