// Base de datos de productos con imágenes de alta calidad (Unsplash placeholders)
const products = [
    { 
        id: 1, 
        name: "MacBook Pro", 
        price: "3.500.000   ", 
        category: "Computadores Corporativos", 
        image: "assets/Laptop.png", 
        reviews: 147 
    },
    { 
        id: 2, 
        name: "Rack 80 PT", 
        price: "2.000.000", 
        category: "Racks", 
        image: "assets/rack.png", 
        reviews: 88 
    },
    { 
        id: 3, 
        name: "Servidor XL 400TB", 
        price: "12,450.000", 
        category: "Servidores", 
        image: "assets/Servidor.png", 
        reviews: 56 
    },
    { 
        id: 4, 
        name: "iPad 17 Pro", 
        price: "4.505.000", 
        category: "Tablets", 
        image: "assets/Tablet.png", 
        reviews: 203 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const hardwareGrid = document.getElementById('hardware-grid');

    // Renderizar Productos
    products.forEach(product => {
        const card = document.createElement('div');
        // Agregamos clases base y la clase 'magnetic-card' para el efecto de brillo
        card.classList.add('product-card', 'magnetic-card', 'fade-in');
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <span class="p-cat">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <span class="product-price">$${product.price}</span>
                <div class="product-rating">
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span class="reviews">(${product.reviews})</span>
                </div>
            </div>
        `;
        hardwareGrid.appendChild(card);
    });
});