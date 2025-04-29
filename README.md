# Dinner Sharing App

A professional and modern web application for restaurant table reservations and food ordering, built with HTML, CSS, and JavaScript. The application features a responsive design, intuitive user interface, and seamless ordering experience.

## Project Overview

The Dinner Sharing App allows users to reserve tables, browse through an interactive menu, and place orders in a streamlined process. Built with modern web technologies and following best practices in UI/UX design.

## Core Features

- Table reservation system
- Interactive menu browsing
- Real-time order management
- Responsive design for all devices
- Modern and intuitive user interface

## User Stories

### Must-Have Features

#### 1. Table Reservation
**Title:** Reserve a Dinner Table

**User Story:**  
As a customer,  
I want to reserve a table by providing my details,  
So that I can secure a spot for my dining experience.

**Acceptance Criteria:**
- Form should include fields for name, email, and number of people
- All fields are required
- Form validation for email format
- Successful submission shows the menu
- Error message displays if form is incomplete

**Tasks:**
1. Create reservation form component
2. Implement form validation
3. Add error handling
4. Create success transition to menu view

#### 2. Menu Browsing
**Title:** Browse Available Menu Items

**User Story:**  
As a customer,  
I want to view all available menu items with details and prices,  
So that I can make informed dining choices.

**Acceptance Criteria:**
- Display menu items in a grid layout
- Show item image, name, description, and price
- Show rating for each item
- Responsive design for all screen sizes
- Loading state while fetching menu data

**Tasks:**
1. Create menu item component
2. Implement grid layout
3. Add loading states
4. Add image optimization
5. Implement responsive design

#### 3. Order Management
**Title:** Manage Food Order

**User Story:**  
As a customer,  
I want to add and remove items from my order,  
So that I can customize my meal selection.

**Acceptance Criteria:**
- Add items to order from menu
- Remove items from order
- View running total
- See order summary
- Clear order functionality

**Tasks:**
1. Create order management system
2. Implement add/remove functionality
3. Create order summary component
4. Add total calculation
5. Implement order persistence

### Should-Have Features

#### 4. Menu Filtering
**Title:** Filter Menu Items

**User Story:**  
As a customer,  
I want to filter menu items by category,  
So that I can quickly find specific types of food.

**Acceptance Criteria:**
- Filter by category (lunch, drink, etc.)
- Clear filter option
- Visual indication of active filter
- Smooth transition between filtered views

**Tasks:**
1. Create filter component
2. Implement filtering logic
3. Add category navigation
4. Add transition animations

#### 5. Menu Search
**Title:** Search Menu Items

**User Story:**  
As a customer,  
I want to search for specific menu items,  
So that I can quickly find my preferred dishes.

**Acceptance Criteria:**
- Search by item name
- Search by description
- Real-time search results
- Clear search option
- No results state

**Tasks:**
1. Create search component
2. Implement search logic
3. Add real-time search functionality
4. Create no results state

### Could-Have Features

#### 6. Dark Mode
**Title:** Toggle Dark Mode

**User Story:**  
As a customer,  
I want to switch between light and dark mode,  
So that I can comfortably view the app in different lighting conditions.

**Acceptance Criteria:**
- Toggle between light and dark themes
- Persist theme preference
- Smooth transition between themes
- System preference detection

**Tasks:**
1. Implement theme switching
2. Add theme persistence
3. Create dark mode styles
4. Add system preference detection

#### 7. Order History
**Title:** View Order History

**User Story:**  
As a customer,  
I want to view my previous orders,  
So that I can track my dining history.

**Acceptance Criteria:**
- View list of past orders
- See order details
- Filter orders by date
- Export order history

**Tasks:**
1. Create order history storage
2. Implement history view
3. Add filtering functionality
4. Create export feature

#### 8. Item Recommendations
**Title:** Receive Menu Recommendations

**User Story:**  
As a customer,  
I want to receive personalized menu recommendations,  
So that I can discover new dishes I might enjoy.

**Acceptance Criteria:**
- Show recommended items based on order history
- Display popular items
- Show similar items
- Refresh recommendations

**Tasks:**
1. Create recommendation algorithm
2. Implement recommendation component
3. Add popularity tracking
4. Create refresh mechanism

## Technical Stack

- HTML5
- CSS3 (with Tailwind CSS)
- JavaScript (Vanilla)
- Local Storage for data persistence

## Getting Started

1. Clone the repository
2. Open index.html in a modern web browser
3. No additional setup required

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
