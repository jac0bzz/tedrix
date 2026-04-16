let currentFilters = { category: 'all', search: '', maxPrice: 30000000 };

document.addEventListener('DOMContentLoaded', () => {
    renderShop();
    initShopLogic();
});

function renderShop() {
    const grid = document.getElementById('hardware-grid');
    if (!grid) return;

    const filtered = products.filter(p => {
        const matchesCat = currentFilters.category === 'all' || p.category === currentFilters.category;
        const matchesSearch = p.name.toLowerCase().includes(currentFilters.search) || p.description.toLowerCase().includes(currentFilters.search);
        const matchesPrice = p.price <= currentFilters.maxPrice;
        return matchesCat && matchesSearch && matchesPrice;
    });

    grid.innerHTML = filtered.length ? '' : '<p class="no-results">No se encontraron productos.</p>';

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card magnetic-card fade-in';
        card.innerHTML = `
            <div class="product-img-container"><img src="${p.image}"></div>
            <div class="product-info">
                <span class="p-cat">${p.category}</span>
                <h3 class="product-title">${p.name}</h3>
                <p class="product-desc-short">${p.description}</p>
                <div class="product-specs">
                    ${p.specs.map(s => `<span><i class="fa-solid fa-check"></i> ${s}</span>`).join('')}
                </div>
                <div class="product-footer">
                    <span class="product-price">$${p.price.toLocaleString('es-CO')}</span>
                    <button class="btn-add" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i></button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function initShopLogic() {
    // Buscador
    document.getElementById('product-search')?.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase();
        renderShop();
    });

    // Filtro Precio
    const priceRange = document.getElementById('price-range');
    const priceLabel = document.getElementById('price-label');
    priceRange?.addEventListener('input', (e) => {
        currentFilters.maxPrice = parseInt(e.target.value);
        if(priceLabel) priceLabel.textContent = `Hasta: $${currentFilters.maxPrice.toLocaleString('es-CO')}`;
        renderShop();
    });

    // Categorías
    document.querySelectorAll('.filter-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentFilters.category = item.dataset.category;
            renderShop();
        });
    });
}