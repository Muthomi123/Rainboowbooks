// main.js - shared across pages
const PRODUCTS = [
  { id: 'b1', title: 'The Last Rainbow', author: 'V. Watson', price: 24.99, category: 'Fiction', img: 'https://via.placeholder.com/200x280?text=Book+1', featured: true },
  { id: 'b2', title: 'Data for Storytellers', author: 'A. Singh', price: 29.90, category: 'Non-Fiction', img: 'https://via.placeholder.com/200x280?text=Book+2', featured: true },
  { id: 'b3', title: 'Little Rainbows', author: 'J. Croft', price: 12.50, category: 'Children', img: 'https://via.placeholder.com/200x280?text=Book+3', featured: false },
  { id: 'b4', title: 'City Nights', author: 'L. Hart', price: 18.00, category: 'Fiction', img: 'https://via.placeholder.com/200x280?text=Book+4', featured: false },
  { id: 'b5', title: 'Young Voices', author: 'S. Young', price: 16.99, category: 'Young Adult', img: 'https://via.placeholder.com/200x280?text=Book+5', featured: false },
  { id: 'b6', title: 'Publishing 101', author: 'D. Harrison', price: 34.00, category: 'Non-Fiction', img: 'https://via.placeholder.com/200x280?text=Book+6', featured: false }
];

const EVENTS = [
  { id: 'e1', title: 'Author Talk: Veronica Watson', date: '2025-11-05', location: 'Collins St', desc: 'An evening with Veronica Watson about her latest novel.' },
  { id: 'e2', title: 'Children Reading Hour', date: '2025-11-12', location: 'Eastpoint', desc: 'Bring the kids for a fun reading and craft hour.' },
  { id: 'e3', title: 'Self-Publishing Workshop', date: '2025-12-01', location: 'Online', desc: 'A practical guide to self-publishing for new authors.' }
];

// ---------- CART UTILITIES ----------
function getCart(){
  try{
    return JSON.parse(localStorage.getItem('rb_cart')) || {};
  }catch(e){
    return {};
  }
}
function saveCart(cart){
  localStorage.setItem('rb_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId, qty = 1){
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  showToast('Added to cart');
}
function removeFromCart(productId){
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}
function updateCartCount(){
  const cart = getCart();
  const count = Object.values(cart).reduce((s,n) => s + Number(n), 0);
  const els = document.querySelectorAll('[id^=cart-count]');
  els.forEach(el => el.textContent = count);
}
function cartItemsDetailed(){
  const cart = getCart();
  const items = [];
  for(const id in cart){
    const product = PRODUCTS.find(p=>p.id===id);
    if(product) items.push({...product, qty: cart[id], line: product.price * cart[id]});
  }
  return items;
}
function cartTotal(){
  return cartItemsDetailed().reduce((s,i)=> s + i.line, 0);
}
function showToast(msg){
  // basic prototype toast
  const t = document.createElement('div');
  t.className = 'toast align-items-center text-bg-primary border-0 position-fixed top-0 end-0 m-3';
  t.role = 'alert'; t.ariaLive = 'assertive'; t.ariaAtomic = 'true';
  t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button type="button" class="btn-close btn-close-white m-2" data-bs-dismiss="toast"></button></div>`;
  document.body.appendChild(t);
  const bs = new bootstrap.Toast(t);
  bs.show();
  t.addEventListener('hidden.bs.toast', ()=> t.remove());
}

// ---------- HOME PAGE ----------
function initHomepage(){
  updateCartCount();
  const out = document.getElementById('featuredRow');
  if(!out) return;
  const featured = PRODUCTS.filter(p=>p.featured);
  out.innerHTML = featured.map(p => `
    <div class="col-md-4">
      <div class="card product-card p-3 h-100">
        <img src="${p.img}" class="img-fluid mb-3" alt="${p.title}">
        <h6 class="mb-1">${p.title}</h6>
        <small class="text-muted">${p.author}</small>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="price">$${p.price.toFixed(2)}</div>
          <div>
            <button class="btn btn-sm btn-outline-primary" onclick="location.href='bookstore.html'">View</button>
            <button class="btn btn-sm btn-primary" onclick="addToCart('${p.id}')">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- BOOKSTORE PAGE ----------
function initBookstore(){
  updateCartCount();
  renderProducts(PRODUCTS);
}
function renderProducts(list){
  const grid = document.getElementById('productGrid');
  const results = document.getElementById('resultsCount');
  if(!grid) return;
  grid.innerHTML = list.map(p => `
    <div class="col-md-4">
      <div class="card product-card p-3 h-100">
        <img src="${p.img}" class="img-fluid mb-3" alt="${p.title}">
        <h6 class="mb-1">${p.title}</h6>
        <small class="text-muted">${p.author}</small>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <div class="price">$${p.price.toFixed(2)}</div>
          <div>
            <button class="btn btn-sm btn-outline-secondary" onclick="showProduct('${p.id}')">Details</button>
            <button class="btn btn-sm btn-primary" onclick="addToCart('${p.id}')">Add</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  if(results) results.textContent = `${list.length} result${list.length !== 1 ? 's' : ''}`;
}
function applyFilters(){
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const cat = document.getElementById('categoryFilter').value;
  const filtered = PRODUCTS.filter(p => {
    const matchesQ = q ? (p.title + ' ' + p.author).toLowerCase().includes(q) : true;
    const matchesCat = cat ? p.category === cat : true;
    return matchesQ && matchesCat;
  });
  renderProducts(filtered);
}
function showProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const html = `
    <div class="modal fade" id="prodModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-5"><img src="${p.img}" class="img-fluid rounded"></div>
              <div class="col-md-7">
                <h5>${p.title}</h5>
                <small class="text-muted">${p.author}</small>
                <p class="mt-3 mb-1">Category: ${p.category}</p>
                <div class="price h5 mb-3">$${p.price.toFixed(2)}</div>
                <div>
                  <button class="btn btn-primary me-2" onclick="addToCart('${p.id}'); bootstrap.Modal.getInstance(document.getElementById('prodModal')).hide();">Add to cart</button>
                  <button class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  const m = new bootstrap.Modal(document.getElementById('prodModal'));
  m.show();
  document.getElementById('prodModal').addEventListener('hidden.bs.modal', function(){ this.remove(); });
}

// ---------- EVENTS PAGE ----------
function initEvents(){
  updateCartCount();
  const out = document.getElementById('eventsList');
  if(!out) return;
  out.innerHTML = EVENTS.map(e => `
    <div class="col-md-4">
      <div class="card p-3">
        <h6 class="mb-1">${e.title}</h6>
        <small class="text-muted">${e.date} • ${e.location}</small>
        <p class="small mt-2">${e.desc}</p>
        <div class="text-end">
          <button class="btn btn-sm btn-primary" onclick="openEventModal('${e.id}')">Register</button>
        </div>
      </div>
    </div>
  `).join('');
}
function openEventModal(id){
  const ev = EVENTS.find(e => e.id === id);
  if(!ev) return;
  document.getElementById('eventModalTitle').textContent = `${ev.title} — ${ev.date}`;
  document.getElementById('eventModalDesc').textContent = ev.desc + ' Location: ' + ev.location;
  const evModal = new bootstrap.Modal(document.getElementById('eventModal'));
  evModal.show();
}
function registerForEvent(){
  // simple simulation — just alert and close modal
  alert('Thanks — registration recorded (prototype).');
  const mEl = document.getElementById('eventModal');
  bootstrap.Modal.getInstance(mEl).hide();
}

// ---------- CHECKOUT & CART PAGE ----------
function initCheckout(){
  updateCartDisplay();
  updateCartCount();
}
function updateCartDisplay(){
  const container = document.getElementById('cartSummary');
  if(!container) return;
  const items = cartItemsDetailed();
  if(items.length === 0){
    container.innerHTML = '<p class="small mb-0">Your cart is empty.</p>';
    return;
  }
  container.innerHTML = items.map(it => `
    <div class="d-flex align-items-center mb-2">
      <img src="${it.img}" style="width:48px;height:72px;object-fit:cover;border-radius:6px" class="me-3">
      <div class="flex-grow-1">
        <div class="small">${it.title} <small class="text-muted">x${it.qty}</small></div>
        <div class="text-muted small">${it.author}</div>
      </div>
      <div class="text-end ms-3">
        <div class="small">$${it.line.toFixed(2)}</div>
        <button class="btn btn-link btn-sm text-danger" onclick="removeFromCartAndRefresh('${it.id}')">Remove</button>
      </div>
    </div>
  `).join('') + `<hr><div class="d-flex justify-content-between"><strong>Total</strong><strong>$${cartTotal().toFixed(2)}</strong></div>`;
}
function removeFromCartAndRefresh(id){
  removeFromCart(id);
  updateCartDisplay();
  showToast('Removed from cart');
}
function placeOrder(){
  // simulated order placement: clear cart and show success
  localStorage.removeItem('rb_cart');
  updateCartCount();
  updateCartDisplay();
  alert('Order placed (prototype). No payment was processed.');
  // optionally redirect to homepage
  window.location.href = 'index.html';
}

// ---------- INIT ON LOAD ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
