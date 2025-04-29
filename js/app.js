document.addEventListener('DOMContentLoaded', () => {
    fetchMenuItems();
});

let menuData = [];
let order = [];

function fetchMenuItems() {
    fetch('data/menu.json')
        .then(response => response.json())
        .then(data => {
            menuData = data;
            displayMenuItems(menuData);
        })
        .catch(error => console.error('Error fetching menu data:', error));
}

function displayMenuItems(items) {
    const menuItemsContainer = document.getElementById('menu-items');
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
            'animate-fade-in'
        );
        menuItem.style.animationDelay = `${index * 100}ms`;

        menuItem.innerHTML = `
            <div class="relative group">
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${item.name}</h3>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">${item.description}</p>
                <div class="flex justify-between items-center mb-3">
                    <p class="text-lg font-bold text-green-600">$${item.price.toFixed(2)}</p>
                    <div class="rating flex items-center" data-rating="${item.rating}">
                        <!-- Stars will be generated here -->
                    </div>
                </div>
                <button 
                    class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold
                    hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onclick="openModal(${item.id})">
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
    order.push(item);
    updateOrderSummary();
}

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');
    orderList.innerHTML = '';

    let totalPrice = 0;

    order.forEach((item, index) => {
        totalPrice += item.price;

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
                    <p class="text-green-600 font-medium">$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <button 
                class="text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                onclick="removeFromOrder(${index})">
                Remove
            </button>
        `;

        orderList.appendChild(listItem);
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

function removeFromOrder(index) {
    order.splice(index, 1);
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

    alert('Thank you for your order!');
    order = [];
    updateOrderSummary();
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