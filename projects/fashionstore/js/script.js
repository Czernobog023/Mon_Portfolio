// ===== Fashion Store - E-commerce JavaScript =====

// Global Variables
let cart = [];
let wishlist = [];
let currentProduct = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeStore();
    setupEventListeners();
    updateCartUI();
    updateWishlistUI();
    startCountdown();
});

// Initialize Store
function initializeStore() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fashionstore_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('fashionstore_wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');
    
    hamburger?.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
    
    // Search
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    
    searchBtn?.addEventListener('click', () => {
        searchBar.classList.toggle('active');
    });
    
    // Cart Sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    
    cartBtn?.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });
    
    closeCart?.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });
    
    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('.quick-view');
    const modal = document.getElementById('quickViewModal');
    const closeModal = document.getElementById('closeModal');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            openQuickView(productId);
        });
    });
    
    closeModal?.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Add to Cart
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            addToCart(productId);
        });
    });
    
    // Add to Wishlist
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            toggleWishlist(productId);
        });
    });
    
    // Quantity Controls in Modal
    const qtyMinus = document.querySelector('.qty-btn.minus');
    const qtyPlus = document.querySelector('.qty-btn.plus');
    const qtyInput = document.getElementById('modalQuantity');
    
    qtyMinus?.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
    
    qtyPlus?.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value);
        qtyInput.value = currentValue + 1;
    });
    
    // Size Selection
    const sizeBtns = document.querySelectorAll('.size-btn');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        subscribeNewsletter(email);
    });
    
    // Back to Top
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Product Data (Mock Data)
const products = {
    1: {
        id: 1,
        name: 'T-shirt Premium Coton Bio',
        price: 29.99,
        image: 'tshirt.jpg',
        description: 'T-shirt de haute qualité en coton biologique, confortable et durable.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Noir', 'Blanc', 'Rouge']
    },
    2: {
        id: 2,
        name: 'Robe Élégante Soirée',
        price: 69.99,
        oldPrice: 99.99,
        image: 'dress.jpg',
        description: 'Robe élégante parfaite pour les soirées et événements spéciaux.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Bleu Marine', 'Violet']
    },
    3: {
        id: 3,
        name: 'Baskets Sport Confort',
        price: 89.99,
        image: 'sneakers.jpg',
        description: 'Baskets confortables pour le sport et les activités quotidiennes.',
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        colors: ['Blanc', 'Bleu', 'Noir']
    },
    4: {
        id: 4,
        name: 'Sac à Main Cuir Véritable',
        price: 149.99,
        image: 'bag.jpg',
        description: 'Sac à main en cuir véritable, élégant et pratique.',
        sizes: ['Unique'],
        colors: ['Marron', 'Noir', 'Doré']
    },
    5: {
        id: 5,
        name: 'Chemise Élégante Business',
        price: 39.99,
        oldPrice: 49.99,
        image: 'shirt.jpg',
        description: 'Chemise parfaite pour le bureau et les occasions formelles.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blanc', 'Bleu Clair', 'Gris']
    },
    6: {
        id: 6,
        name: 'Jeans Slim Stretch',
        price: 59.99,
        image: 'jeans.jpg',
        description: 'Jeans slim avec tissu stretch pour un confort optimal.',
        sizes: ['28', '30', '32', '34', '36'],
        colors: ['Bleu Foncé', 'Noir', 'Gris']
    },
    7: {
        id: 7,
        name: 'Montre Classique Élégante',
        price: 199.99,
        image: 'watch.jpg',
        description: 'Montre classique avec bracelet en cuir et mécanisme de précision.',
        sizes: ['Unique'],
        colors: ['Or', 'Argent', 'Bronze']
    },
    8: {
        id: 8,
        name: 'Pull Cachemire Luxe',
        price: 84.99,
        oldPrice: 99.99,
        image: 'sweater.jpg',
        description: 'Pull en cachemire de haute qualité, doux et chaud.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Camel', 'Gris Foncé', 'Beige']
    }
};

// Open Quick View Modal
function openQuickView(productId) {
    const product = products[productId];
    if (!product) return;
    
    currentProduct = product;
    
    // Update modal content
    document.getElementById('modalProductTitle').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `${product.price.toFixed(2)}€`;
    
    // Show modal
    document.getElementById('quickViewModal').classList.add('active');
}

// Add to Cart
function addToCart(productId, quantity = 1, size = 'M') {
    const product = products[productId];
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.image
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification('Produit ajouté au panier!');
    
    // Open cart sidebar
    document.getElementById('cartSidebar').classList.add('active');
}

// Toggle Wishlist
function toggleWishlist(productId) {
    const index = wishlist.findIndex(item => item === productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Retiré des favoris');
    } else {
        wishlist.push(productId);
        showNotification('Ajouté aux favoris!');
    }
    
    saveWishlist();
    updateWishlistUI();
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count badges
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (cartItemCount) cartItemCount.textContent = totalItems;
    
    // Update cart items display
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="item-image">
                        <div class="placeholder-cart-item">
                            <i class="fas fa-tshirt"></i>
                        </div>
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Taille: ${item.size} | Qté: ${item.quantity}</p>
                        <p class="item-price">${item.price.toFixed(2)}€</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) cartTotal.textContent = `${total.toFixed(2)}€`;
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Produit retiré du panier');
}

// Update Wishlist UI
function updateWishlistUI() {
    const wishlistCount = document.getElementById('wishlistCount');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
    
    // Update wishlist button states
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        const productId = parseInt(btn.dataset.productId);
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.style.color = 'var(--accent-color)';
        } else {
            btn.classList.remove('active');
            btn.style.color = '';
        }
    });
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('fashionstore_cart', JSON.stringify(cart));
}

// Save Wishlist to LocalStorage
function saveWishlist() {
    localStorage.setItem('fashionstore_wishlist', JSON.stringify(wishlist));
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 30px;
        border-radius: 30px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Newsletter Subscription
function subscribeNewsletter(email) {
    // In a real application, this would send to a server
    console.log('Newsletter subscription:', email);
    showNotification('Inscription réussie! Merci de votre intérêt.');
    document.getElementById('newsletterForm').reset();
}

// Countdown Timer
function startCountdown() {
    // Set end date (example: 7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// CSS Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .cart-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid var(--border-color);
        position: relative;
    }
    
    .item-image {
        width: 60px;
        height: 60px;
    }
    
    .placeholder-cart-item {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border-radius: 5px;
    }
    
    .item-details {
        flex: 1;
    }
    
    .item-details h4 {
        font-size: 14px;
        margin-bottom: 5px;
    }
    
    .item-details p {
        font-size: 12px;
        color: var(--text-light);
    }
    
    .item-price {
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .remove-item {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: var(--text-light);
        cursor: pointer;
    }
    
    .remove-item:hover {
        color: var(--accent-color);
    }
`;
document.head.appendChild(style);

// Initialize on load
console.log('Fashion Store initialized successfully!');