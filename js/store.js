// ================= BASE DE DATOS DE PRODUCTOS =================
const products = [
    { id: 1, name: "MacBook Pro", price: 3500000, category: "Computadores Corporativos", image: "assets/Laptop.png", reviews: 147 },
    { id: 2, name: "Rack 80 PT", price: 2000000, category: "Racks", image: "assets/rack.png", reviews: 88 },
    { id: 3, name: "Servidor XL 400TB", price: 12450000, category: "Servidores", image: "assets/Servidor.png", reviews: 56 },
    { id: 4, name: "iPad 17 Pro", price: 4505000, category: "Tablets", image: "assets/Tablet.png", reviews: 203 }
];

let cart = JSON.parse(localStorage.getItem('tedrix_cart')) || [];
let currentFilters = { category: 'all', search: '', maxPrice: 70000000 };

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    initFilters();
    
    const cartBtnHeader = document.querySelector('.cart-icon');
    if(cartBtnHeader) cartBtnHeader.onclick = () => toggleCartModal();
});

// ================= 1. RENDERIZAR PRODUCTOS =================
function renderProducts() {
    const grid = document.getElementById('hardware-grid');
    if (!grid) return; 

    const filteredProducts = products.filter(p => {
        const matchesCategory = currentFilters.category === 'all' || p.category === currentFilters.category;
        const searchVal = currentFilters.search.toLowerCase().trim();
        const matchesSearch = searchVal === '' || p.name.toLowerCase().includes(searchVal);
        const matchesPrice = Number(p.price) <= Number(currentFilters.maxPrice);
        
        return matchesCategory && matchesSearch && matchesPrice;
    });

    grid.innerHTML = '';
    
    const isTienda = document.querySelector('.store-page') !== null || window.location.pathname.includes('tienda.html');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p class="no-results" style="grid-column: 1/-1; text-align: center; color: #666; padding: 50px 0;">No se encontraron equipos con estos filtros.</p>';
        return;
    }

    let displayProducts = isTienda ? filteredProducts : filteredProducts.slice(0, 4);

    displayProducts.forEach(product => {
        const card = document.createElement('div');
        // Quitamos la clase 'fade-in' y forzamos la visibilidad al 100%
        card.classList.add('product-card', 'magnetic-card');
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.transform = 'translateY(0)';
        card.style.animation = 'none';

        const priceFormatted = product.price.toLocaleString('es-CO');

        card.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <span class="p-cat">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">$${priceFormatted}</span>
                
                ${!isTienda ? `
                <div class="product-rating">
                    <div class="stars">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="reviews">(${product.reviews})</span>
                </div>` : ''}
                
                <button class="btn btn-muted w-100" style="margin-top:15px; justify-content:center;" onclick="addToCart(${product.id}, this)">
                    Agregar al carrito <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    if(typeof window.initGlowingEffects === 'function') window.initGlowingEffects();
}

// ================= 2. ACTIVAR FILTROS =================
function initFilters() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value;
            renderProducts();
        });
    }

    const filterItems = document.querySelectorAll('.filter-item');
    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            filterItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            currentFilters.category = this.getAttribute('data-category');
            renderProducts();
        });
    });

    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-label');
    if (priceRange && priceLabel) {
        priceRange.addEventListener('input', function() {
            currentFilters.maxPrice = this.value;
            priceLabel.textContent = `Hasta: $${Number(this.value).toLocaleString('es-CO')}`;
            renderProducts();
        });
    }
}

// ================= 3. LÓGICA DEL CARRITO (INTACTA) =================
window.showToast = function(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-teal);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

window.addToCart = function(productId, btnElement = null) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('tedrix_cart', JSON.stringify(cart));
    updateCartUI(); 
    
    if (btnElement) {
        showToast(`<strong>${product.name}</strong> agregado.`);
        const originalText = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fa-solid fa-check"></i>';
        btnElement.style.color = '#10b981'; 
        btnElement.style.borderColor = '#10b981';
        setTimeout(() => {
            btnElement.innerHTML = originalText;
            btnElement.style.color = '';
            btnElement.style.borderColor = '';
        }, 1500);
    }
}

window.removeFromCart = function(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem('tedrix_cart', JSON.stringify(cart));
        updateCartUI();
    }
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    if (count) count.textContent = cart.length;
    if (!container) return;

    container.innerHTML = '';
    
    const groupedCart = cart.reduce((acc, item) => {
        if (!acc[item.id]) acc[item.id] = { ...item, quantity: 0 };
        acc[item.id].quantity += 1;
        return acc;
    }, {});

    let total = 0;

    Object.values(groupedCart).forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const div = document.createElement('div');
        div.className = 'cart-modal-item';
        div.innerHTML = `
            <div style="position: relative;">
                <img src="${item.image}" width="60" height="60" style="border-radius:8px; object-fit: cover; border: 1px solid var(--border);">
                <span style="position: absolute; top: -8px; right: -8px; background: var(--primary-teal); color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 10px; border: 2px solid var(--bg-card);">
                    ${item.quantity}
                </span>
            </div>
            <div class="item-details" style="flex: 1; margin-left: 15px;">
                <h4 style="margin:0; font-size: 0.95rem;">${item.name}</h4>
                <p style="margin:0; color:var(--primary-teal); font-weight: 600;">$${subtotal.toLocaleString('es-CO')}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button onclick="addToCart(${item.id})" style="color: var(--primary-teal); background:none; border:none; cursor:pointer; font-size: 1.1rem;">
                    <i class="fa-solid fa-circle-plus"></i>
                </button>
                <button onclick="removeFromCart(${item.id})" style="color: #ff5f56; background:none; border:none; cursor:pointer; font-size: 1.1rem;">
                    <i class="fa-solid fa-circle-minus"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });

    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-CO')}`;
    actualizarBotonWhatsApp(groupedCart);
}

// ================= 4. WHATSAPP PRO =================
function actualizarBotonWhatsApp(groupedCart) {
    const btnWhatsapp = document.getElementById('btn-whatsapp-cotizar');
    if (!btnWhatsapp) return;

    if (cart.length === 0) {
        btnWhatsapp.onclick = () => alert("Agrega productos para cotizar.");
        return;
    }

    const phone = "573229015000"; 
    let message = "━━━━━━━━━━━━━━\n📦 *NUEVA COTIZACIÓN - TEDRIX*\n━━━━━━━━━━━━━━\n\nHola, me interesa adquirir:\n\n";
    let totalGral = 0;

    Object.values(groupedCart).forEach(item => {
        const subtotal = item.price * item.quantity;
        totalGral += subtotal;
        message += `🔹 *${item.name}*\n    Cant: ${item.quantity}  |  Sub: $${subtotal.toLocaleString('es-CO')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━\n💰 *TOTAL: $${totalGral.toLocaleString('es-CO')}*\n━━━━━━━━━━━━━━\n\n👉 _Quedo atento a la disponibilidad._`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    btnWhatsapp.onclick = () => window.open(url, '_blank');
}

// ================= 5. MODAL =================
window.toggleCartModal = function() {
    const modal = document.getElementById('cart-modal');
    const overlay = document.getElementById('cart-overlay');
    if (modal && overlay) {
        const isActive = modal.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
}