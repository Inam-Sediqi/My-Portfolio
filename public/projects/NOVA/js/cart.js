function subtotal() {
  return cart.reduce((a, x) => {
    let p = products.find((p) => p.id === x.id);
    return a + (p ? p.price * x.quantity : 0);
  }, 0);
}
function cartRender() {
  let box = $("#cart-items"),
    empty = $("#cart-empty"),
    sum = $("#cart-summary");
  if (!box) return;
  if (!cart.length) {
    box.innerHTML = "";
    empty.classList.remove("hidden");
    sum.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");
  sum.classList.remove("hidden");
  box.innerHTML = cart
    .map((x) => {
      let p = products.find((p) => p.id === x.id);
      return `<article class="cart-item"><a class="cart-thumb" href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a><div class="cart-item-copy"><span>${p.category}</span><h3>${p.name}</h3><strong>${money(p.price)}</strong><button class="remove-link" data-remove="${p.id}">Remove</button></div><div class="cart-item-controls"><div class="quantity"><button data-change="${p.id}" data-delta="-1">−</button><span>${x.quantity}</span><button data-change="${p.id}" data-delta="1">+</button></div><strong>${money(p.price * x.quantity)}</strong></div></article>`;
    })
    .join("");
  let sub = subtotal(),
    ship = sub >= 100 ? 0 : 9,
    disc = sub >= 180 ? sub * 0.1 : 0;
  $("#subtotal").textContent = money(sub);
  $("#shipping").textContent = ship ? money(ship) : "Free";
  $("#discount").textContent = disc ? `−${money(disc)}` : "—";
  $("#cart-total").textContent = money(sub + ship - disc);
}
document.addEventListener("click", (e) => {
  let r = e.target.closest("[data-remove]"),
    c = e.target.closest("[data-change]");
  if (r) {
    removeFromCart(r.dataset.remove);
    cartRender();
  }
  if (c) {
    changeQty(c.dataset.change, c.dataset.delta);
    cartRender();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  cartRender();
  $("#clear-cart")?.addEventListener("click", () => {
    if (confirm("Clear all items from your cart?")) {
      cart = [];
      saveCart();
      cartRender();
      toast("Cart cleared", "info");
    }
  });
  $("#checkout-btn")?.addEventListener("click", () =>
    toast("Checkout is frontend-only in this portfolio project", "info"),
  );
});
