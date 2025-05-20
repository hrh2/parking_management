const express = require('express');
const cors = require('cors');
const  {database_connection} = require('./config/database')
const swaggerUI=require('swagger-ui-express')
const {annotations}=require('./docs/swagger')
require('dotenv').config()

// Database connection
database_connection()
require('./config/sync_database')
// require('./cron/bookingWatcher'); // or wherever you put the file



// Routers
const loginRouter = require('./Controllers/Routes/auth/login');
const registerRouter = require('./Controllers/Routes/auth/register');
const verificationRouter = require('./Controllers/Routes/auth/verification');
const parkingStationRouter = require('./Controllers/Routes/parkingStations/Stations');
const parkingSlotRouter = require('./Controllers/Routes/parkingSlots/Slots');
const bookingRouter = require('./Controllers/Routes/booking/Bookings');
const vehicleRouter = require('./Controllers/Routes/vehicles/Vehicles');
const ticketsRouter = require('./Controllers/Routes/tickets/Tickets');
const adminReportsRouter = require('./Controllers/Routes/admin/Reports');


// Initialize express app
const app = express();


// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you want to allow cookies
};

app.use(cors(corsOptions));

// Routes
app.use('/v1/api/auth/login',loginRouter);
app.use('/v1/api/auth/register',registerRouter);
app.use('/v1/api/auth',verificationRouter);
app.use('/v1/api/station',parkingStationRouter);
app.use('/v1/api/slots',parkingSlotRouter);
app.use('/v1/api/bookings',bookingRouter);
app.use('/v1/api/vehicles',vehicleRouter);
app.use('/v1/api/tickets',ticketsRouter);
app.use('/v1/api/admin/reports',adminReportsRouter);
app.use('/v1/api-docs',swaggerUI.serve,swaggerUI.setup(annotations))

// Root Endpoint


app.get('/', async (req, res) => {
    try {
        return res.status(200).send("<h1>...LIVE...</h1>");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
