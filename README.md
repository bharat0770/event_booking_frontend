# Architecture Overview

This application follows a **clean client-server architecture** with clear separation between frontend, backend, and database.

---

## Frontend (React + Vite)

* Built with React for UI rendering and state management
* Uses Axios to communicate with backend REST APIs
* Implements JWT-based authentication
* Handles seat selection, reservation, and booking workflows
* Uses Tailwind CSS for styling
* Displays notifications using react-hot-toast
* Uses environment-based configuration for backend URLs

---

## Backend (Node.js + Express)

* Exposes REST APIs for authentication, events, seats, reservations, and bookings
* Uses a modular architecture (routes → controllers → services → models)
* Handles authentication, validation, business logic, and error management
* Integrates MongoDB for data persistence
* Uses MongoDB sessions and transactions for safe concurrent seat booking
* Manages CORS, environment variables, and security concerns

---

## Database

### MongoDB

* Stores users, events, seats, reservations, and bookings
* Flexible schema design suitable for booking workflows
* Supports transactions to prevent double booking and maintain consistency

---

# Authentication

Since this project was developed as a test assignment, authentication was intentionally kept simple while still following secure practices.

### Registration

* User passwords are encrypted using bcrypt before storage
* Plain-text passwords are never stored in the database

### Login

* User credentials are validated against encrypted passwords
* Upon successful login, a JWT token is generated and returned to the frontend

### Token Storage

#### Current Implementation

* JWT token is stored in Local Storage

#### Production Recommendation

* Use HTTP-Only Cookies for improved security
* Use Axios Interceptors for automatic token handling and refresh management

---

# Event Management

Each event is created according to the assignment requirements.

### Event Fields

* Event Name
* Venue
* Date & Time
* Total Seats
* Event Images

Events can be browsed from the event listing page and viewed individually before booking.

---

# Seat Management

### Seat Creation

* Whenever an event is created, all associated seats are automatically generated in the database
* Every seat is initially assigned the status:

```text
Available
```

* This approach was chosen as a simple design assumption for the assignment and can be optimized further for production systems

---

### Seat Reservation Flow

When a user:

1. Selects seats
2. Clicks **Reserve**

The system:

* Creates a reservation record
* Marks selected seats as Reserved
* Starts a 10-minute reservation timer
* Redirects the user to the booking confirmation page

---

### Reservation Expiry

If booking is not completed within 10 minutes:

* Reservation is deleted
* Seats are released automatically
* Seat status changes back to Available

This prevents abandoned reservations from blocking inventory.

---

### Concurrency & Double Booking Protection

To handle multiple users booking simultaneously:

* MongoDB Sessions are used
* MongoDB Transactions are implemented

This ensures:

* Atomic database operations
* Data consistency
* Prevention of double booking
* Safe concurrent seat reservations

---

# Booking Confirmation

After seats are reserved:

1. User is redirected to the Confirm Booking page
2. Reservation timer remains active
3. User enters payment information
4. User confirms the booking before the timer expires

Once successful:

* Reservation is converted into a confirmed booking
* Seat status changes to Booked

---

# Design Assumptions

### UI Design

* Color scheme follows Red and White
* Tailwind CSS is used as the styling framework

### Event Listing

* Events are displayed using a grid layout consisting of rows and columns

### Seat Status Indicators

* 🟢 Green → Available
* 🔵 Blue → Reserved
* 🔴 Red → Booked

### Error Handling

* Backend errors are handled using try/catch blocks
* Frontend feedback is provided using react-hot-toast notifications

---

# Backend Structure

```text
src/
 user/          → User authentication & management
 event/         → Event creation & retrieval
 seat/          → Seat management
 reservation/   → Reservation & booking logic
 middleware/    → Authentication & request validation
 utils/         → Shared helper functions
 app.js         → Application entry point
```

### Design Principles

* Feature-based folder organization
* Related models, controllers, and routes are grouped together
* Easier maintenance as features grow
* Better separation of business domains
* Scales well for medium-sized applications

---

# API Endpoints

## Authentication

```http
POST /user/register
POST /user/login
```

---

## Events

```http
GET  /event/all
GET  /event/:id
POST /event/create
```

---

## Seats

```http
GET /seats/list/all
```

---

## Reservations & Booking

```http
POST /reservation/create
POST /reservation/booking/confirm
```

---

# Design Decisions

### MongoDB

* Flexible schema design
* Easy relationship handling between events and seats
* Transaction support for booking workflows

### JWT Authentication

* Stateless authentication
* Easy frontend integration
* Scalable approach for future growth

### Transaction-Based Booking

* Prevents double booking
* Maintains data consistency
* Handles concurrent booking requests safely

---

# Current Limitations

* JWT token stored in Local Storage
* Reservation cleanup process can be further optimized
* Limited payment validation
* Simplified seat arrangement design
* Responsive design can be improved further

---

# Future Improvements

### Infrastructure

* Implement Redis Cache for faster read performance
* Use Redis Locks for advanced concurrency handling
* Improve overall system scalability

### Reservation Handling

* Implement CRON jobs for automatic reservation cleanup
* Optimize seat release mechanisms

### Payments

* Integrate Stripe or Razorpay
* Add webhook-based payment verification
* Improve payment security and reliability

### User Experience

* Make the application fully responsive
* Create a theatre-style seat layout
* Improve booking flow and visual feedback
* Warn users before leaving the payment page
* Enhance loading states and animations

### Scalability

* Further modularize services
* Add centralized logging and monitoring
* Implement rate limiting and advanced security measures

---

# Test Instructions

### Live Application

```text
https://event-booking-frontend-nine.vercel.app/
```

### Test Credentials

```text
Email: test1@gmail.com
Password: test1
```

### Important Note

* The backend is hosted on Render
* The first request may take a few seconds if the server is waking up from inactivity

---

## Booking Flow

1. Login using the test credentials
2. Use the navbar to navigate to the Events page
3. Select any event
4. Choose available seats
5. Click **Reserve**
6. Observe the reservation timer displayed on the top-right section
7. Click **Confirm Booking**
8. Enter payment details

### Test Card

```text
4242 4242 4242 4242
```

9. Click **Pay**
10. Booking should be completed successfully

---

# Conclusion

The application demonstrates a complete event booking workflow including authentication, event management, seat reservation, booking confirmation, and concurrency handling. MongoDB transactions ensure seat consistency while the modular architecture allows future enhancements such as Redis, payment gateway integration, advanced reservation management, and improved scalability.
