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
        menuItem.classList.add('menu-item');

        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
            <div class="rating" data-rating="${item.rating}">
                <!-- Stars will be generated here -->
            </div>
            <button onclick="openModal(${item.id})">View Details</button>
        `;

        menuItemsContainer.appendChild(menuItem);
        renderStars(menuItem.querySelector('.rating'));
    });
}


//Create a Function to Render Stars

function renderStars(ratingElement) {
    const rating = parseFloat(ratingElement.getAttribute('data-rating'));
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const maxStars = 5;

    let starsHtml = '';

    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = starsHtml.length; i < maxStars * 28; i += 28) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    ratingElement.innerHTML = starsHtml;

    ratingElement.setAttribute('aria-label', `Rating: ${rating} out of 5 stars`);
}



// Add items to Order

function addToOrder(itemId) {
    const item = menuData.find(menuItem => menuItem.id === itemId);
    order.push(item);
    updateOrderSummary();
}

// Update Order Summary

function updateOrderSummary() {
    const orderList = document.getElementById('order-list');
    const totalPriceElement = document.getElementById('total-price');
    orderList.innerHTML = '';

    let totalPrice = 0;

    order.forEach((item, index) => {
        totalPrice += item.price;

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromOrder(${index})">Remove</button>
        `;

        orderList.appendChild(listItem);
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Remove items from the list

function removeFromOrder(index) {
    order.splice(index, 1);
    updateOrderSummary();
}

//Add Event Listener to the Registration Form

// Initially hide the menu and order summary
document.getElementById('menu').style.display = 'none';
document.getElementById('order-summary').style.display = 'none';

// Handle form submission
const reservationForm = document.getElementById('reservation-form');

reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect form data
    const name = reservationForm.name.value.trim();
    const email = reservationForm.email.value.trim();
    const people = reservationForm.people.value;

    if (name && email && people) {
        // Hide the registration form
        document.getElementById('registration').style.display = 'none';

        // Show the menu and order summary
        document.getElementById('menu').style.display = 'block';
        document.getElementById('order-summary').style.display = 'block';
    } else {
        alert('Please fill in all the required fields.');
    }
});



//Handling Checkouts

const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', () => {
    if (order.length === 0) {
        alert('Your order is empty.');
        return;
    }

    // Process the order (e.g., send data to a server)
    alert('Thank you for your order!');
    // Reset the order
    order = [];
    updateOrderSummary();
});


//Modal structure

function openModal(itemId) {
    const item = menuData.find(menuItem => menuItem.id === itemId);

    document.getElementById('modal-meal-name').textContent = item.name;
    document.getElementById('modal-meal-image').src = item.image;
    document.getElementById('modal-meal-image').alt = item.name;
    document.getElementById('modal-meal-description').textContent = item.description;
    document.getElementById('modal-meal-price').textContent = `Price: $${item.price.toFixed(2)}`;
    
    
    // Update the rating display
    const modalRatingElement = document.getElementById('modal-meal-rating');
    modalRatingElement.setAttribute('data-rating', item.rating);
    renderStars(modalRatingElement);

    document.getElementById('modal-add-button').onclick = function () {
        addToOrder(item.id);
        closeModal();
    };

    document.getElementById('meal-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('meal-modal').style.display = 'none';
}




