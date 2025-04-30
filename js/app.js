document.addEventListener('DOMContentLoaded', () => {
    fetchMenuItems();
    initializeSearch();
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
        order = JSON.parse(savedOrder);
        updateOrderSummary();
    }
});

let menuData = [];
let order = [];
let currentFilter = 'all';
let currentSearchTerm = '';

function showLoadingState() {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center p-12">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>
            <span class="ml-4 text-lg text-gray-600">Loading menu items...</span>
        </div>
    `;
}

function fetchMenuItems() {
    showLoadingState();
    fetch('data/menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            return response.json();
        })
        .then(data => {
            menuData = data;
            initializeCategoryFilters(); // Initialize filters after loading menu data
            displayMenuItems(menuData);
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
            showErrorState();
        });
}

function showErrorState() {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = `
        <div class="col-span-full text-center p-12">
            <div class="text-red-500 text-xl mb-4">
                <i class="fas fa-exclamation-circle text-4xl mb-4"></i>
                <p>Failed to load menu items</p>
            </div>
            <button 
                onclick="fetchMenuItems()"
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Try Again
            </button>
        </div>
    `;
}

function getOptimizedImageUrl(imagePath, size = 'md') {
    const filename = imagePath.split('/').pop().replace('.jpg', '');
    return `/public/images/${filename}-${size}.webp`;
}

function initializeCategoryFilters() {
    const categories = new Set(menuData.map(item => item.category));
    const filterContainer = document.getElementById('category-filters');
    
    // Clear existing filters except "All Items"
    const allItemsButton = filterContainer.firstElementChild;
    filterContainer.innerHTML = '';
    filterContainer.appendChild(allItemsButton);

    // Add category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-filter px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-500 hover:text-white transition-all duration-300';
        button.setAttribute('data-category', category);
        button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterContainer.appendChild(button);
    });

    // Add click handlers
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterMenuItems(category);
            updateActiveFilter(button);
        });
    });
}

function updateActiveFilter(activeButton) {
    document.querySelectorAll('.category-filter').forEach(button => {
        button.classList.remove('active', 'bg-blue-500', 'text-white');
        button.classList.add('bg-gray-100', 'text-gray-600');
    });
    
    activeButton.classList.remove('bg-gray-100', 'text-gray-600');
    activeButton.classList.add('active', 'bg-blue-500', 'text-white');
}

function filterMenuItems(category) {
    currentFilter = category;
    filterAndDisplayItems();
}

function filterAndDisplayItems() {
    const filteredItems = menuData.filter(item => {
        const matchesSearch = !currentSearchTerm || 
            item.name.toLowerCase().includes(currentSearchTerm) ||
            item.description.toLowerCase().includes(currentSearchTerm);
            
        const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
        
        return matchesSearch && matchesCategory;
    });

    // Show no results state if needed
    if (filteredItems.length === 0) {
        const menuItemsContainer = document.getElementById('menu-items');
        menuItemsContainer.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-gray-500 mb-4">
                    <i class="fas fa-search text-4xl mb-4"></i>
                    <p class="text-lg">No items found matching "${currentSearchTerm}"</p>
                </div>
                ${currentFilter !== 'all' ? `
                    <p class="text-sm text-gray-400 mb-4">Try removing the "${currentFilter}" category filter</p>
                ` : ''}
                <button 
                    onclick="clearSearch()"
                    class="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                    Clear Search
                </button>
            </div>
        `;
        return;
    }

    displayMenuItems(filteredItems);
}

function displayMenuItems(items) {
    const menuItemsContainer = document.getElementById('menu-items');
    const itemsCount = document.getElementById('items-count');
    
    // Update items count with category info
    const countText = currentFilter === 'all' 
        ? `${items.length} items` 
        : `${items.length} ${currentFilter} items`;
    itemsCount.textContent = countText;

    menuItemsContainer.innerHTML = '';

    items.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.classList.add(
            'menu-item',
            'bg-white',
            'rounded-xl',
            'shadow-md',
            'overflow-hidden',
            'transform',
            'transition-all',
            'duration-300',
            'hover:shadow-xl',
            'hover:-translate-y-1',
            'animate-fade-in',
            'focus-within:ring-2',
            'focus-within:ring-blue-500'
        );
        menuItem.style.animationDelay = `${index * 100}ms`;

        const imageUrl = item.image;
        const webpSmall = getOptimizedImageUrl(imageUrl, 'sm');
        const webpMedium = getOptimizedImageUrl(imageUrl, 'md');
        const webpLarge = getOptimizedImageUrl(imageUrl, 'lg');
        const jpgFallback = imageUrl.replace('images/', 'public/images/').replace('.jpg', '-md.jpg');

        menuItem.innerHTML = `
            <div class="relative group aspect-w-16 aspect-h-9">
                <picture>
                    <source
                        media="(min-width: 1280px)"
                        srcset="${webpLarge}"
                        type="image/webp"
                    >
                    <source
                        media="(min-width: 768px)"
                        srcset="${webpMedium}"
                        type="image/webp"
                    >
                    <source
                        srcset="${webpSmall}"
                        type="image/webp"
                    >
                    <img 
                        src="${jpgFallback}" 
                        alt="${item.name}" 
                        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    >
                </picture>
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div class="absolute bottom-0 left-0 right-0 p-4">
                        <span class="text-white text-sm">Click to view details</span>
                    </div>
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-semibold text-gray-800 line-clamp-1">${item.name}</h3>
                    <span class="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 text-sm">
                        ${item.category}
                    </span>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2 h-10">${item.description}</p>
                <div class="flex justify-between items-center mb-3">
                    <p class="text-lg font-bold text-green-600">$${item.price.toFixed(2)}</p>
                    <div class="rating flex items-center" data-rating="${item.rating}" role="img" aria-label="${item.rating} out of 5 stars">
                        <!-- Stars will be generated here -->
                    </div>
                </div>
                <button 
                    class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold
                    hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onclick="openModal(${item.id})"
                    aria-label="View details of ${item.name}">
                    View Details
                </button>
            </div>
        `;

        menuItemsContainer.appendChild(menuItem);
        renderStars(menuItem.querySelector('.rating'));
    });
}

function renderStars(ratingElement) {
    const rating = parseFloat(ratingElement.getAttribute('data-rating'));
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const maxStars = 5;

    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star text-yellow-500"></i>';
    }

    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt text-yellow-500"></i>';
    }

    for (let i = fullStars + (halfStar ? 1 : 0); i < maxStars; i++) {
        starsHtml += '<i class="far fa-star text-gray-300"></i>';
    }

    ratingElement.innerHTML = starsHtml;
    ratingElement.setAttribute('aria-label', `Rating: ${rating} out of 5 stars`);
}

function addToOrder(itemId) {
    const item = menuData.find(menuItem => menuItem.id === itemId);
    const existingItem = order.find(orderItem => orderItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        order.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem('currentOrder', JSON.stringify(order));
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');
    orderList.innerHTML = '';

    let totalPrice = 0;

    if (order.length === 0) {
        orderList.innerHTML = `
            <li class="text-gray-500 text-center py-4">
                Your order is empty
            </li>
        `;
    } else {
        order.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const itemTotal = item.price * quantity;
            totalPrice += itemTotal;

            const listItem = document.createElement('li');
            listItem.classList.add(
                'flex',
                'justify-between',
                'items-center',
                'py-3',
                'animate-fade-in'
            );
            listItem.style.animationDelay = `${index * 100}ms`;

            listItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
                    <div>
                        <h4 class="font-semibold text-gray-800">${item.name}</h4>
                        <div class="flex items-center gap-2">
                            <button 
                                class="text-gray-500 hover:text-gray-700 px-2 py-1"
                                onclick="updateQuantity(${item.id}, ${quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="text-gray-600">${quantity}</span>
                            <button 
                                class="text-gray-500 hover:text-gray-700 px-2 py-1"
                                onclick="updateQuantity(${item.id}, ${quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <p class="text-green-600 font-medium">$${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
                <button 
                    class="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                    onclick="removeFromOrder(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            orderList.appendChild(listItem);
        });

        // Add clear order button if there are items
        const clearButton = document.createElement('li');
        clearButton.classList.add('pt-4', 'mt-4', 'border-t', 'border-gray-200');
        clearButton.innerHTML = `
            <button 
                class="w-full text-red-500 hover:text-red-700 font-medium py-2 px-4 rounded-lg border border-red-500 hover:border-red-700 transition-colors duration-200"
                onclick="clearOrder()">
                Clear Order
            </button>
        `;
        orderList.appendChild(clearButton);
    }

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeItemById(itemId);
    } else {
        const item = order.find(orderItem => orderItem.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    localStorage.setItem('currentOrder', JSON.stringify(order));
    updateOrderSummary();
}

function removeItemById(itemId) {
    order = order.filter(item => item.id !== itemId);
    localStorage.setItem('currentOrder', JSON.stringify(order));
    updateOrderSummary();
}

function removeFromOrder(index) {
    order.splice(index, 1);
    localStorage.setItem('currentOrder', JSON.stringify(order));
    updateOrderSummary();
}

function clearOrder() {
    order = [];
    localStorage.removeItem('currentOrder');
    updateOrderSummary();
}

document.getElementById('menu').classList.add('hidden');
document.getElementById('order-summary').classList.add('hidden');

function showError(inputElement, message) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1 animate-fade-in';
    errorDiv.textContent = message;
    
    if (!inputElement.parentElement.querySelector('.error-message')) {
        inputElement.parentElement.appendChild(errorDiv);
    }
    
    inputElement.classList.add('border-red-500');
    inputElement.classList.remove('border-gray-300');
}

function clearError(inputElement) {
    const errorDiv = inputElement.parentElement.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
    inputElement.classList.remove('border-red-500');
    inputElement.classList.add('border-gray-300');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateReservationForm(formData) {
    let isValid = true;
    const errors = {};

    // Validate name
    if (!formData.name) {
        errors.name = 'Name is required';
        isValid = false;
    } else if (formData.name.length < 2) {
        errors.name = 'Name must be at least 2 characters long';
        isValid = false;
    }

    // Validate email
    if (!formData.email) {
        errors.email = 'Email is required';
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }

    // Validate number of people
    if (!formData.people) {
        errors.people = 'Number of people is required';
        isValid = false;
    } else if (formData.people < 1) {
        errors.people = 'Number of people must be at least 1';
        isValid = false;
    } else if (formData.people > 20) {
        errors.people = 'Maximum 20 people allowed per reservation';
        isValid = false;
    }

    return { isValid, errors };
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-up';
    successMessage.textContent = 'Reservation successful! Proceeding to menu...';
    document.body.appendChild(successMessage);

    setTimeout(() => {
        successMessage.classList.add('opacity-0');
        setTimeout(() => successMessage.remove(), 300);
    }, 3000);
}

// Update the existing reservation form event listener
const reservationForm = document.getElementById('reservation-form');

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear any existing errors
    ['name', 'email', 'people'].forEach(field => {
        clearError(reservationForm[field]);
    });

    const formData = {
        name: reservationForm.name.value.trim(),
        email: reservationForm.email.value.trim(),
        people: parseInt(reservationForm.people.value)
    };

    const { isValid, errors } = validateReservationForm(formData);

    if (isValid) {
        // Store reservation details
        localStorage.setItem('currentReservation', JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString()
        }));

        // Show success message
        showSuccessMessage();

        // Smooth transition to menu
        document.getElementById('registration').classList.add('opacity-0');
        setTimeout(() => {
            document.getElementById('registration').classList.add('hidden');
            document.getElementById('menu').classList.remove('hidden');
            document.getElementById('order-summary').classList.remove('hidden');
            
            // Trigger animations
            requestAnimationFrame(() => {
                document.getElementById('menu').classList.add('animate-slide-up');
                document.getElementById('order-summary').classList.add('animate-slide-up');
                document.getElementById('menu').classList.add('opacity-100');
                document.getElementById('order-summary').classList.add('opacity-100');
            });
        }, 300);
    } else {
        // Show errors for each invalid field
        Object.entries(errors).forEach(([field, message]) => {
            showError(reservationForm[field], message);
        });
    }
});

// Add input event listeners for real-time validation
['name', 'email', 'people'].forEach(field => {
    const input = reservationForm[field];
    input.addEventListener('input', () => {
        clearError(input);
        
        const formData = {
            name: reservationForm.name.value.trim(),
            email: reservationForm.email.value.trim(),
            people: parseInt(reservationForm.people.value)
        };

        const { errors } = validateReservationForm({
            ...formData,
            [field]: input.value.trim()
        });

        if (errors[field]) {
            showError(input, errors[field]);
        }
    });
});

const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', () => {
    if (order.length === 0) {
        alert('Your order is empty.');
        return;
    }

    const total = order.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    alert(`Thank you for your order! Total: $${total.toFixed(2)}`);
    clearOrder();
});

function openModal(itemId) {
    const item = menuData.find(menuItem => menuItem.id === itemId);
    const modal = document.getElementById('meal-modal');
    const modalContent = modal.querySelector('.modal-content');

    document.getElementById('modal-meal-name').textContent = item.name;
    document.getElementById('modal-meal-image').src = item.image;
    document.getElementById('modal-meal-image').alt = item.name;
    document.getElementById('modal-meal-description').textContent = item.description;
    document.getElementById('modal-meal-price').textContent = `$${item.price.toFixed(2)}`;

    const modalRatingElement = document.getElementById('modal-meal-rating');
    modalRatingElement.setAttribute('data-rating', item.rating);
    renderStars(modalRatingElement);

    document.getElementById('modal-add-button').onclick = function () {
        addToOrder(item.id);
        closeModal();
    };

    modal.classList.remove('hidden');
    modalContent.classList.add('animate-slide-up');
}

function closeModal() {
    const modal = document.getElementById('meal-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.classList.remove('animate-slide-up');
    modal.classList.add('hidden');
}

function initializeSearch() {
    const searchInput = document.getElementById('menu-search');
    const clearButton = document.getElementById('clear-search');

    // Debounce function to limit how often the search is performed
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearButton.classList.toggle('hidden', !e.target.value);
        
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearchTerm = e.target.value.toLowerCase().trim();
            filterAndDisplayItems();
        }, 300);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchTerm = '';
        clearButton.classList.add('hidden');
        filterAndDisplayItems();
        searchInput.focus();
    });
}

function clearSearch() {
    const searchInput = document.getElementById('menu-search');
    const clearButton = document.getElementById('clear-search');
    
    searchInput.value = '';
    currentSearchTerm = '';
    clearButton.classList.add('hidden');
    filterAndDisplayItems();
}