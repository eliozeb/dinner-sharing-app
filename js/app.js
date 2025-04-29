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

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item', 'bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'flex', 'flex-col', 'items-center', 'text-center');

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg mb-4">
            <h3 class="text-lg font-semibold mb-2">${item.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${item.description}</p>
            <p class="text-lg font-bold text-green-500 mb-2">$${item.price.toFixed(2)}</p>
            <div class="rating flex justify-center mb-4" data-rating="${item.rating}">
                <!-- Stars will be generated here -->
            </div>
            <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" onclick="openModal(${item.id})">View Details</button>
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
        listItem.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'py-2');
        listItem.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button class="text-red-500 hover:underline" onclick="removeFromOrder(${index})">Remove</button>
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

const reservationForm = document.getElementById('reservation-form');

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = reservationForm.name.value.trim();
    const email = reservationForm.email.value.trim();
    const people = reservationForm.people.value;

    if (name && email && people) {
        document.getElementById('registration').classList.add('hidden');
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('order-summary').classList.remove('hidden');
    } else {
        alert('Please fill in all the required fields.');
    }
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

    document.getElementById('modal-meal-name').textContent = item.name;
    document.getElementById('modal-meal-image').src = item.image;
    document.getElementById('modal-meal-image').alt = item.name;
    document.getElementById('modal-meal-description').textContent = item.description;
    document.getElementById('modal-meal-price').textContent = `Price: $${item.price.toFixed(2)}`;

    const modalRatingElement = document.getElementById('modal-meal-rating');
    modalRatingElement.setAttribute('data-rating', item.rating);
    renderStars(modalRatingElement);

    document.getElementById('modal-add-button').onclick = function () {
        addToOrder(item.id);
        closeModal();
    };

    document.getElementById('meal-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('meal-modal').classList.add('hidden');
}