# Parking Management System Backend Architecture

## System Overview
The Parking Management System (PMS) backend is a Node.js application built with Express.js that provides APIs for managing parking stations, slots, bookings, vehicles, and tickets. It follows the MVC (Model-View-Controller) architecture pattern and uses MongoDB as its database.

## Entity Relationship Diagram

```pgsql
+-----------------+      1:N       +----------------+
|     User        |<---------------|    Vehicle     |
+-----------------+                +----------------+
| _id (PK)        |                | _id (PK)       |
| firstName       |                | licensePlate   |
| lastName        |                | model          |
| email           |                | color          |
| phone           |                | sits           |
| password        |                | ownerId (FK)   |
| role            |                +----------------+
| isVerified      |
+-----------------+
|1
|
|1
v
+-----------------+     1:N      +----------------+
|    Booking      |<-------------|   ParkingSlot  |
+-----------------+              +----------------+
| _id (PK)        |              | _id (PK)       |
| user (FK)       |              | slotNumber     |
| slot (FK)       |              | isAvailable    |
| vehicle (FK)    |              | station (FK)   |
| startTime       |              +----------------+
| endTime         |
| status          |
+-----------------+
       ^
       |1
       |
+-----------------+      1:N     +----------------+
|    Ticket       |<-------------|    Booking     |
+-----------------+              +----------------+
| _id (PK)        |              | _id (PK)       |
| user (FK)       |              |                |
| vehicle (FK)    |              +----------------+
| slot (FK)       |
| startTime       |
| endTime         |
| durationMinutes |
| amount          |
| isPaid          |
+-----------------+

+-----------------+      1:N      +-----------------+
| ParkingStation  |<--------------|   ParkingSlot   |
+-----------------+               +-----------------+
| _id (PK)        |               | _id (PK)        |
| name            |               | slotNumber      |
| location        |               | isAvailable     |
| ratePerMinute   |               | station (FK)    |
+-----------------+               +-----------------+

+-----------------+
| OneTimeCode     |
+-----------------+
| _id (PK)        |
| email           |
| code            |
| expiresAt       |
| isUsed          |
+-----------------+
```
## Data Flow Diagram (DFD)
```
                +----------------------+
                |     Client App       |
                +----------------------+
                          |
                          v
                +----------------------+
                |   Express Server     |
                | (Routes + Middleware)|
                +----------------------+
                          |
                          v
        +-----------------------------------------+
        |                Controllers              |
        |    - AuthController                     |
        |    - BookingController                  |
        |    - TicketController                   |
        |    - VehicleController                  |
        +-----------------------------------------+
                          |
                          v
        +-----------------------------------------+
        |                Models                   |
        | - User, Vehicle, Booking, Ticket        |
        | - ParkingSlot, ParkingStation           |
        | - OneTimeCode                           |
        +-----------------------------------------+
                          |
                          v
                   +------------+
                   |  MongoDB   |
                   +------------+


```
## Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Applications                            │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                               Express.js                                 │
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │    Middleware   │    │     Routes      │    │  Swagger API Docs   │  │
│  │                 │    │                 │    │                     │  │
│  │  - CORS         │    │  - Auth         │    │  - API Documentation│  │
│  │  - JSON Parser  │    │  - Parking      │    │    and Testing      │  │
│  │  - URL Encoder  │    │    Stations     │    │                     │  │
│  │  - Token        │    │  - Parking      │    │                     │  │
│  │    Verification │    │    Slots        │    │                     │  │
│  │                 │    │  - Bookings     │    │                     │  │
│  │                 │    │  - Vehicles     │    │                     │  │
│  │                 │    │  - Tickets      │    │                     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘  │
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │   Controllers   │    │    Validators   │    │        Utils        │  │
│  │                 │    │                 │    │                     │  │
│  │  - Auth         │    │  - Input        │    │  - Helper           │  │
│  │  - Parking      │    │    Validation   │    │    Functions        │  │
│  │    Stations     │    │                 │    │                     │  │
│  │  - Parking      │    │                 │    │                     │  │
│  │    Slots        │    │                 │    │                     │  │
│  │  - Bookings     │    │                 │    │                     │  │
│  │  - Vehicles     │    │                 │    │                     │  │
│  │  - Tickets      │    │                 │    │                     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘  │
│                                                                         │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              Mongoose ODM                               │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                MongoDB                                  │
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐  │
│  │      Models     │    │  Relationships  │    │                     │  │
│  │                 │    │                 │    │                     │  │
│  │  - User         │◄───┼─┐ 1:N           │    │                     │  │
│  │  - Vehicle      │◄─┐ │ └─► Booking     │    │                     │  │
│  │  - Parking      │  │ │    Vehicle      │    │                     │  │
│  │    Station      │  │ │    Ticket       │    │                     │  │
│  │  - Parking      │◄─┼─┘                 │    │                     │  │
│  │    Slot         │  │                   │    │                     │  │
│  │  - Booking      │◄─┘                   │    │                     │  │
│  │  - Ticket       │                      │    │                     │  │
│  │  - OneTimeCode  │                      │    │                     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Components Description

### 1. Express.js Application
- **Entry Point**: `index.js` - Initializes the Express application, sets up middleware, and defines routes
- **Port**: Configurable via environment variables (default: 5000)
- **API Version**: v1

### 2. Middleware
- **CORS**: Enables cross-origin resource sharing
- **JSON Parser**: Parses JSON request bodies
- **URL Encoder**: Parses URL-encoded request bodies
- **Token Verification**: Authenticates and authorizes API requests

### 3. Routes
- **Auth**: User registration, login, and verification
- **Parking Stations**: Management of parking facilities
- **Parking Slots**: Management of individual parking spaces
- **Bookings**: Reservation of parking slots
- **Vehicles**: User vehicle management
- **Tickets**: Parking ticket management

### 4. Controllers
Business logic for handling API requests and responses

### 5. Models (MongoDB)
- **User**: User account information and relationships to vehicles, tickets, and bookings
- **Vehicle**: Vehicle information linked to users
- **ParkingStation**: Parking facility information
- **ParkingSlot**: Individual parking space information
- **Booking**: Parking reservation details
- **Ticket**: Parking ticket information
- **OneTimeCode**: Verification codes for authentication

### 6. Database
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js

### 7. Additional Components
- **Validators**: Input validation logic
- **Utils**: Utility functions
- **Swagger Documentation**: API documentation and testing interface
- **Cron Jobs**: Scheduled tasks for monitoring bookings

## Data Flow
1. Client sends HTTP request to Express server
2. Request passes through middleware (CORS, parsing, authentication)
3. Router directs request to appropriate controller
4. Controller processes request, interacts with models
5. Models interact with MongoDB database through Mongoose
6. Controller sends response back to client

## Authentication Flow
1. User registers with email, password, and personal information
2. Verification code is sent to user's email
3. User verifies account with code
4. User logs in and receives JWT token
5. Token is used for subsequent authenticated requests

## Booking Flow
1. User selects parking station
2. User views available parking slots
3. User books a slot for a specific time period
4. System generates booking confirmation
5. User receives ticket for the booking