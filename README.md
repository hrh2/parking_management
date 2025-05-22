# PARKING MANAGEMENT SYSTEM

## Overview
The Parking Management System is a comprehensive solution for managing parking stations, slots, bookings, vehicles, and tickets. It consists of a Node.js/Express.js backend API and a React frontend application.

## Features
- User authentication and authorization
- Parking station and slot management
- Vehicle registration
- Booking management
- Ticket generation and management
- Admin reporting

## Architecture and Design

For detailed architecture information, see the [Architecture Documentation](docs/pms_architecture_README.md).
    
- [Documentations `/docs`](docs)
- [Design `/designs`](designs)

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Setup Instructions

### 1. Navigate in the project
```bash
cd parking_management
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd pms_backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Edit the `.env` file and add the following:
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/parking_management_system
JWT_SECRET=your_jwt_secret
# Add other required environment variables for email, etc.
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd pms_frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Edit the `.env` file and add the following:
```
VITE_API_URL=http://localhost:3000/v1/api
# Add other required environment variables
```

### 4. Database Setup
The system includes MongoDB database files in the `parking_management_system_db` directory. You can import these into your MongoDB instance if needed:

```bash
# Import the database (optional)
mongorestore -d parking_management_system ./parking_management_system_db
```

## Running the Application

### Start the Backend
```bash
cd pms_backend
node index.js
```

The backend API will be available at http://localhost:3000
API documentation will be available at http://localhost:3000/v1/api-docs

### Start the Frontend
```bash
cd pms_frontend
npm run dev
```

The frontend application will be available at http://localhost:5173

## API Endpoints
- Authentication: `/v1/api/auth/login`, `/v1/api/auth/register`
- Parking Stations: `/v1/api/station`
- Parking Slots: `/v1/api/slots`
- Bookings: `/v1/api/bookings`
- Vehicles: `/v1/api/vehicles`
- Tickets: `/v1/api/tickets`
- Admin Reports: `/v1/api/admin/reports`

## Important Note
Remember to update your credentials in the `.env` files in both `/pms_frontend` and `/pms_backend` directories.
