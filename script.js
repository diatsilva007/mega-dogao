const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updatecartModal();
  cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal quando clicar no botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Adicionar item ao carrinho ao clicar no botão
// Alterado para escutar no documento inteiro para cobrir todos os botões .add-to-cart-btn
document.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // Se o item já existe, aumenta apenas a quantidade em +1
    existingItem.quantity += 1;
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
      "flex-col" // Mantido, mas pode não ser necessário se o conteúdo interno já se ajusta bem.
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p> 
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
                
        </div>
    `; // Adicionei text-red-500 ao botão remover para destaque

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
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
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
      return `\n- ${item.name} (Qtd: ${item.quantity}) - Preço: R$${item.price.toFixed(2)}`;
    })
    .join("");
  
  const totalPedido = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const message = encodeURIComponent(
    `Olá, gostaria de fazer o seguinte pedido:\n${cartItemsText}\n\nTotal: R$${totalPedido.toFixed(2)}\n\nEndereço de entrega: ${addressInput.value}`
  );
  const phone = "+5535997714779"; // Substitua pelo seu número de WhatsApp

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );

  cart = [];
  addressInput.value = ""; // Limpar o campo de endereço
  updatecartModal();
});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22; // Aberto das 18:00 às 21:59
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
  spanItem.querySelector("span").textContent = "Seg á Dom - 18:00 as 22:00 (Aberto)";
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
  spanItem.querySelector("span").textContent = "Seg á Dom - 18:00 as 22:00 (Fechado)";
}
