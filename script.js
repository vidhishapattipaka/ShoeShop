function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

window.addToCart = function (name, price) {
  const cart = getCart();
  cart.push({ name, price });
  saveCart(cart);
  alert(`${name} added to cart ✅`);
};

function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cartTotal");
  if (!cartItemsDiv) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "Cart is empty";
    if (cartTotalEl) cartTotalEl.innerText = "₹0";
    return;
  }

  let total = 0;

  cartItemsDiv.innerHTML = cart
    .map((item, index) => {
      total += Number(item.price) || 0;
      return `
        <div class="cart-row">
          <span>${item.name}</span>
          <span>₹${item.price}</span>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      `;
    })
    .join("");

  if (cartTotalEl) cartTotalEl.innerText = `₹${total}`;
}

window.removeFromCart = function (index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
};

function setupPaymentSwitch() {
  const radios = document.querySelectorAll('input[name="pay"]');
  if (!radios.length) return;

  const upiBox = document.getElementById("upiBox");
  const cardBox = document.getElementById("cardBox");
  const codBox = document.getElementById("codBox");

  function show(method) {
    upiBox?.classList.toggle("hidden", method !== "upi");
    cardBox?.classList.toggle("hidden", method !== "card");
    codBox?.classList.toggle("hidden", method !== "cod");
  }

  radios.forEach(r => {
    r.addEventListener("change", () => show(r.value));
  });

  const checked = document.querySelector('input[name="pay"]:checked');
  show(checked ? checked.value : "upi");
}

window.placeOrder = function () {
  const cart = getCart();
  const msg = document.getElementById("orderMsg");

  if (cart.length === 0) {
    if (msg) msg.innerText = "Your cart is empty ❌";
    return;
  }

  const method = document.querySelector('input[name="pay"]:checked')?.value;

  if (method === "upi") {
    const upi = document.getElementById("upiId")?.value.trim();
    if (!upi || !upi.includes("@")) {
      if (msg) msg.innerText = "Please enter a valid UPI ID (example@upi) ❌";
      return;
    }
  }

  if (method === "card") {
    const cardNo = document.getElementById("cardNo")?.value.replace(/\s/g, "");
    const exp = document.getElementById("exp")?.value.trim();
    const cvv = document.getElementById("cvv")?.value.trim();

    if (!cardNo || cardNo.length < 12) {
      if (msg) msg.innerText = "Please enter a valid card number ❌";
      return;
    }
    if (!exp || exp.length < 4) {
      if (msg) msg.innerText = "Please enter expiry (MM/YY) ❌";
      return;
    }
    if (!cvv || cvv.length < 3) {
      if (msg) msg.innerText = "Please enter CVV ❌";
      return;
    }
  }

  saveCart([]); 
  renderCart();

  if (msg) {
    msg.innerText =
      method === "cod"
        ? "Order placed successfully ✅ (Cash on Delivery)"
        : "Order placed successfully ✅";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  setupPaymentSwitch();
});

window.searchProducts = function () {
  const inputEl = document.getElementById("searchInput");
  if (!inputEl) return;

  const input = inputEl.value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    const name = product.querySelector("h3")?.innerText.toLowerCase() || "";
    product.style.display = name.includes(input) ? "block" : "none";
  });
};