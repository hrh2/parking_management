require('dotenv').config();

const annotations = {
    openapi: '3.0.0',
    info: {
        title: `Parking Management System`,
        version: '1.0.0',
        description: 'Backend APIs for Parking Management System  in a Given Company',
        contact: {
            name: 'HRH',
            email: 'gakundohope5@gmail.com',
            url: 'https://www.instagram.com/__.hirwa.__2/',
        },
        social: {
            instagram: 'https://www.instagram.com/__.hirwa.__2/',
        },
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT||3000}`,
        },
    ],
    'tags':[
        {name:"Users Auth"},
        {name:'Users'},
        {name:'Parking Station Management'},
        {name:'Vehicles'},
        {name:'Bookings'},
        {name:'Parking Slots'},
        {name:'Tickets'},
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            UserRegister:{
                type:'object',
                properties:{
                    firstName: { type: 'string', required: true, example: 'Hope', description: "The first name of the User" },
                    lastName: { type: 'string', required: true, example: 'Hirwa', description: "The last name of the User" },
                    email: { type: 'string', required: true, example: 'Hopehirwa@gmail.com', description: "The email of the User" },
                    phone: { type: 'number', required: true, example: '764379882', description: "The phone number of the User" },
                    password: { type: 'string', required: true, example: 'HRH12457h.', description: "The Strong Password of the User" },
                    confirmPassword: { type: 'string', required: true, example: 'HRH12457h.', description: "Confirm the password" },
                }
            },
            User:{
                type:'object',
                properties:{
                    firstName: { type: 'string', required: true, example: 'Hope', description: "The first name of the User" },
                    lastName: { type: 'string', required: true, example: 'Hirwa', description: "The last name of the User" },
                    email: { type: 'string', required: true, example: 'Hopehirwa@gmail.com', description: "The email of the User" },
                    phone: { type: 'number', required: true, example: '764379882', description: "The phone number of the User" },
                    password: { type: 'string', required: true, example: 'HRH12457h.', description: "The Strong Password of the User" },
                    confirmPassword: { type: 'string', required: true, example: 'HRH12457h.', description: "Confirm the password" },
                    role: { type: 'string', enum: ['ADMIN', 'STANDARD'], default: 'STANDARD', description: "The role of the User" },
                }
            },
            Vehicle: {
                type: 'object',
                properties: {
                    licensePlate: { type: 'string', required: true, example: 'ABC123', description: "The license plate of the vehicle" },
                    model: { type: 'string', example: 'Toyota Corolla', description: "The model of the vehicle" },
                    color: { type: 'string', example: 'Blue', description: "The color of the vehicle" },
                    sits: { type: 'number', example: 5, description: "The number of seats in the vehicle" },
                    ownerId: { type: 'string', required: true, description: "The ID of the user who owns the vehicle" }
                }
            },
            Ticket: {
                type: 'object',
                properties: {
                    bookingId: { type: 'string', required: true, description: "The ID of the booking" },
                    userId: { type: 'string', required: true, description: "The ID of the user" },
                    stationId: { type: 'string', required: true, description: "The ID of the parking station" },
                    slotId: { type: 'string', required: true, description: "The ID of the parking slot" },
                    startTime: { type: 'string', format: 'date-time', required: true, description: "The start time of the parking" },
                    endTime: { type: 'string', format: 'date-time', required: true, description: "The end time of the parking" },
                    durationMinutes: { type: 'number', required: true, description: "The duration of the parking in minutes" },
                    amount: { type: 'number', required: true, description: "The amount to be paid" },
                    isPaid: { type: 'boolean', default: false, description: "Whether the ticket has been paid" }
                }
            },
            ParkingStation: {
                type: 'object',
                properties: {
                    name: { type: 'string', required: true, example: 'Downtown Parking', description: "The name of the parking station" },
                    location: { type: 'string', required: true, example: 'City Center', description: "The location of the parking station" },
                    ratePerMinute: { type: 'number', required: true, default: 10, description: "The rate per minute for parking" }
                }
            },
            Booking: {
                type: 'object',
                properties: {
                    userId: { type: 'string', required: true, description: "The ID of the user" },
                    slotId: { type: 'string', required: true, description: "The ID of the parking slot" },
                    stationId: { type: 'string', required: true, description: "The ID of the parking station" },
                    vehicleId: { type: 'string', required: true, description: "The ID of the vehicle" },
                    startTime: { type: 'string', format: 'date-time', required: true, description: "The start time of the booking" },
                    endTime: { type: 'string', format: 'date-time', required: true, description: "The end time of the booking" },
                    status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'], default: 'PENDING', description: "The status of the booking" }
                }
            },
            OneTimeCode: {
                type: 'object',
                properties: {
                    email: { type: 'string', required: true, description: "The email to which the code was sent" },
                    code: { type: 'string', required: true, description: "The one-time verification code" },
                    expiresAt: { type: 'string', format: 'date-time', required: true, description: "The expiration time of the code" },
                    isUsed: { type: 'boolean', default: false, description: "Whether the code has been used" }
                }
            },
            ParkingSlot: {
                type: 'object',
                properties: {
                    slotNumber: { type: 'string', required: true, example: 'A1', description: "The number/identifier of the parking slot" },
                    isAvailable: { type: 'boolean', default: true, description: "Whether the slot is available" },
                    stationId: { type: 'string', required: true, description: "The ID of the parking station" }
                }
            }
        },
    },
    paths: {
        '/v1/api/bookings': {
            post: {
                tags: ["Bookings"],
                summary: 'Create a new booking',
                description: 'Endpoint to create a new booking for a parking slot',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    slot: {
                                        type: 'string',
                                        required: true,
                                        description: "The ID of the parking slot to book"
                                    },
                                    vehicle: {
                                        type: 'string',
                                        required: true,
                                        description: "The ID of the vehicle to be parked"
                                    },
                                    startTime: {
                                        type: 'string',
                                        format: 'date-time',
                                        required: true,
                                        description: "The start time of the booking"
                                    }
                                },
                                required: ['slot', 'vehicle', 'startTime']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Booking created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Booking created and pending approval.'
                                        },
                                        booking: {
                                            $ref: '#/components/schemas/Booking'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'Parking slot not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            get: {
                tags: ["Bookings"],
                summary: 'Get all bookings',
                description: 'Endpoint to retrieve all bookings',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of bookings retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Booking'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/bookings/approve/{id}': {
            patch: {
                tags: ["Bookings"],
                summary: 'Approve a booking',
                description: 'Endpoint to approve a booking (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the booking to approve',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Booking approved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Booking approved and slot marked as unavailable'
                                        },
                                        booking: {
                                            $ref: '#/components/schemas/Booking'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can approve bookings'
                    },
                    '404': {
                        description: 'Booking not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/bookings/reject/{id}': {
            patch: {
                tags: ["Bookings"],
                summary: 'Reject a booking',
                description: 'Endpoint to reject a booking (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the booking to reject',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Booking rejected successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Booking rejected'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can reject bookings'
                    },
                    '404': {
                        description: 'Booking not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/bookings/complete/{id}': {
            patch: {
                tags: ["Bookings"],
                summary: 'Complete a booking',
                description: 'Endpoint to complete a booking and generate a ticket (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the booking to complete',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Booking completed successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Booking completed and ticket generated'
                                        },
                                        booking: {
                                            $ref: '#/components/schemas/Booking'
                                        },
                                        ticket: {
                                            $ref: '#/components/schemas/Ticket'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request - Only approved bookings can be completed'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can complete bookings'
                    },
                    '404': {
                        description: 'Booking not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/slots': {
            post: {
                tags: ["Parking Slots"],
                summary: 'Add a new parking slot',
                description: 'Endpoint to add a new parking slot to a station (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    stationId: {
                                        type: 'string',
                                        required: true,
                                        description: "The ID of the parking station"
                                    },
                                    slotNumber: {
                                        type: 'string',
                                        required: true,
                                        description: "The number/identifier of the parking slot"
                                    }
                                },
                                required: ['stationId', 'slotNumber']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Slot created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Slot created successfully.'
                                        },
                                        slot: {
                                            $ref: '#/components/schemas/ParkingSlot'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can create slots'
                    },
                    '404': {
                        description: 'Parking station not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            get: {
                tags: ["Parking Slots"],
                summary: 'Get available parking slots',
                description: 'Endpoint to retrieve available parking slots with optional filtering by station',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'stationId',
                        in: 'query',
                        description: 'ID of the parking station to filter by',
                        required: false,
                        schema: {
                            type: 'string'
                        }
                    },
                    {
                        name: 'page',
                        in: 'query',
                        description: 'Page number for pagination',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 1
                        }
                    },
                    {
                        name: 'limit',
                        in: 'query',
                        description: 'Number of items per page',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 10
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of available slots retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        currentPage: {
                                            type: 'integer',
                                            description: 'Current page number'
                                        },
                                        totalPages: {
                                            type: 'integer',
                                            description: 'Total number of pages'
                                        },
                                        totalSlots: {
                                            type: 'integer',
                                            description: 'Total number of slots matching the filter'
                                        },
                                        slots: {
                                            type: 'array',
                                            items: {
                                                $ref: '#/components/schemas/ParkingSlot'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/slots/{id}': {
            get: {
                tags: ["Parking Slots"],
                summary: 'Get a specific parking slot',
                description: 'Endpoint to retrieve a specific parking slot by its ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking slot to retrieve',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Parking slot retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ParkingSlot'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'Parking slot not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            put: {
                tags: ["Parking Slots"],
                summary: 'Update a parking slot',
                description: 'Endpoint to update a specific parking slot by its ID (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking slot to update',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    slotNumber: {
                                        type: 'string',
                                        description: "The number/identifier of the parking slot"
                                    },
                                    isAvailable: {
                                        type: 'boolean',
                                        description: "Whether the slot is available"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Parking slot updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Slot updated successfully.'
                                        },
                                        slot: {
                                            $ref: '#/components/schemas/ParkingSlot'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can update slots'
                    },
                    '404': {
                        description: 'Parking slot not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            delete: {
                tags: ["Parking Slots"],
                summary: 'Delete a parking slot',
                description: 'Endpoint to delete a specific parking slot by its ID (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking slot to delete',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Parking slot deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Slot deleted successfully.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can delete slots'
                    },
                    '404': {
                        description: 'Parking slot not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/tickets': {
            get: {
                tags: ["Tickets"],
                summary: 'Get all tickets',
                description: 'Endpoint to retrieve all tickets (admin only)',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of tickets retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Ticket'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can view all tickets'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/tickets/my': {
            get: {
                tags: ["Tickets"],
                summary: 'Get user\'s tickets',
                description: 'Endpoint to retrieve tickets for the authenticated user',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of user\'s tickets retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Ticket'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/tickets/my-bookings': {
            get: {
                tags: ["Tickets"],
                summary: 'Get user\'s bookings',
                description: 'Endpoint to retrieve bookings for the authenticated user',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of user\'s bookings retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Booking'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/tickets/pay/{id}': {
            patch: {
                tags: ["Tickets"],
                summary: 'Pay for a ticket',
                description: 'Endpoint to mark a ticket as paid',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the ticket to pay for',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Ticket paid successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: '✅ Ticket paid successfully'
                                        },
                                        ticket: {
                                            $ref: '#/components/schemas/Ticket'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request - Ticket already paid'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - User not authorized to pay for this ticket'
                    },
                    '404': {
                        description: 'Ticket not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/auth/register': {
            post: {
                tags:["Users Auth"],
                summary: 'Create a new user',
                description: 'Endpoint to create a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserRegister',
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User created successfully, verification email sent',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'A message indicating that a validation code has been sent',
                                            example: 'Validation code sent. Check your email.',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid request data',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/api/auth/login': {
            post: {
                tags: ["Users Auth"],
                summary: 'User login',
                description: 'Endpoint for user login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email_phone: {
                                        type: 'string',
                                        description: 'The email address or phone number of the user',
                                        example: 'johndoe@example.com',
                                    },
                                    password: {
                                        type: 'string',
                                        description: 'The password for the user',
                                        example: 'p@ssw0rdHRH1',
                                    },
                                },
                                required: ['email_phone', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Login initiated, verification code sent',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Message indicating verification code was sent',
                                            example: 'Successfully Logged. We sent a verification code to your email.',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid request data',
                    },
                    '401': {
                        description: 'Invalid email or password',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/api/auth/login/otp': {
            post: {
                tags: ["Users Auth"],
                summary: 'Verify OTP for login',
                description: 'Endpoint to verify the one-time password sent to email after login',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'The email address of the user',
                                        example: 'johndoe@example.com',
                                    },
                                    verificationCode: {
                                        type: 'string',
                                        description: 'The verification code sent to the user\'s email',
                                        example: '123456',
                                    },
                                },
                                required: ['email', 'verificationCode'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Successful verification and login',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'success',
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'Access token for the authenticated user',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MzAwMzM1MjV9.TsfxzxLHf9vGS8NMh4oHXht0O-vW9w3U5XvW7_VJ18M',
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid request data or verification code',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/v1/api/auth/email-verification': {
            get: {
                tags: ["Users Auth"],
                summary: 'Verify email address',
                description: 'Endpoint to verify a user\'s email address using a verification code',
                parameters: [
                    {
                        name: 'email',
                        in: 'query',
                        description: 'The email address to verify',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    },
                    {
                        name: 'code',
                        in: 'query',
                        description: 'The verification code sent to the email',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Email verified successfully',
                        content: {
                            'text/html': {
                                schema: {
                                    type: 'string',
                                    description: 'HTML response confirming email verification'
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid verification code'
                    },
                    '404': {
                        description: 'User not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/auth/request-email-update': {
            post: {
                tags: ["Users Auth"],
                summary: 'Request email update',
                description: 'Endpoint to request an email address update',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'The new email address',
                                        example: 'newemail@example.com'
                                    },
                                    password: {
                                        type: 'string',
                                        description: 'The user\'s current password',
                                        example: 'password123'
                                    }
                                },
                                required: ['email', 'password']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Verification code sent successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Check your spam emails and Primary Emails for verification code.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data or email already in use'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'User not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/auth/update-email': {
            post: {
                tags: ["Users Auth"],
                summary: 'Update email address',
                description: 'Endpoint to update a user\'s email address after verification',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'The new email address',
                                        example: 'newemail@example.com'
                                    },
                                    verificationCode: {
                                        type: 'string',
                                        description: 'The verification code sent to the new email',
                                        example: '123456'
                                    }
                                },
                                required: ['email', 'verificationCode']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Email updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'success'
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'New access token with updated email',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data, verification code, or email already in use'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'User not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/auth/send-verification-code': {
            post: {
                tags: ["Users Auth"],
                summary: 'Send password reset verification code',
                description: 'Endpoint to send a verification code for password reset',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'The email address of the user',
                                        example: 'user@example.com'
                                    }
                                },
                                required: ['email']
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Verification code sent successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Verification code sent to your email.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data'
                    },
                    '404': {
                        description: 'No user found with this email'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/auth/password-updated': {
            post: {
                tags: ["Users Auth"],
                summary: 'Update password',
                description: 'Endpoint to update a user\'s password after verification',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {
                                        type: 'string',
                                        description: 'The email address of the user',
                                        example: 'user@example.com'
                                    },
                                    newPassword: {
                                        type: 'string',
                                        description: 'The new password',
                                        example: 'newPassword123'
                                    },
                                    verificationCode: {
                                        type: 'string',
                                        description: 'The verification code sent to the email',
                                        example: '123456'
                                    }
                                },
                                required: ['email', 'newPassword', 'verificationCode']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Password updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Password changed successfully'
                                        },
                                        token: {
                                            type: 'string',
                                            description: 'New access token',
                                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data or verification code'
                    },
                    '404': {
                        description: 'User not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/vehicles': {
            post: {
                tags: ["Vehicles"],
                summary: 'Add a new vehicle',
                description: 'Endpoint to add a new vehicle for the authenticated user',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    licensePlate: {
                                        type: 'string',
                                        required: true,
                                        example: 'ABC123',
                                        description: "The license plate of the vehicle"
                                    },
                                    model: {
                                        type: 'string',
                                        example: 'Toyota Corolla',
                                        description: "The model of the vehicle"
                                    },
                                    color: {
                                        type: 'string',
                                        example: 'Blue',
                                        description: "The color of the vehicle"
                                    },
                                    sits: {
                                        type: 'number',
                                        example: 5,
                                        description: "The number of seats in the vehicle"
                                    }
                                },
                                required: ['licensePlate']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Vehicle added successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Vehicle added successfully.'
                                        },
                                        vehicle: {
                                            $ref: '#/components/schemas/Vehicle'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            get: {
                tags: ["Vehicles"],
                summary: 'Get all vehicles of the authenticated user',
                description: 'Endpoint to retrieve all vehicles belonging to the authenticated user',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of vehicles retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Vehicle'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/vehicles/{id}': {
            get: {
                tags: ["Vehicles"],
                summary: 'Get a single vehicle by ID',
                description: 'Endpoint to retrieve a specific vehicle by its ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the vehicle to retrieve',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Vehicle retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Vehicle'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'Vehicle not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            put: {
                tags: ["Vehicles"],
                summary: 'Update a vehicle',
                description: 'Endpoint to update a specific vehicle by its ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the vehicle to update',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    licensePlate: { 
                                        type: 'string', 
                                        example: 'ABC123', 
                                        description: "The license plate of the vehicle" 
                                    },
                                    model: { 
                                        type: 'string', 
                                        example: 'Toyota Corolla', 
                                        description: "The model of the vehicle" 
                                    },
                                    color: { 
                                        type: 'string', 
                                        example: 'Blue', 
                                        description: "The color of the vehicle" 
                                    },
                                    sits: { 
                                        type: 'number', 
                                        example: 5, 
                                        description: "The number of seats in the vehicle" 
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Vehicle updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Vehicle updated successfully.'
                                        },
                                        vehicle: {
                                            $ref: '#/components/schemas/Vehicle'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - User not authorized to update this vehicle'
                    },
                    '404': {
                        description: 'Vehicle not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            delete: {
                tags: ["Vehicles"],
                summary: 'Delete a vehicle',
                description: 'Endpoint to delete a specific vehicle by its ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the vehicle to delete',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Vehicle deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Vehicle deleted successfully.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - User not authorized to delete this vehicle'
                    },
                    '404': {
                        description: 'Vehicle not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/station': {
            post: {
                tags: ["Parking Station Management"],
                summary: 'Create a new parking station',
                description: 'Endpoint to create a new parking station with auto-generated slots',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        required: true,
                                        example: 'Downtown Parking',
                                        description: "The name of the parking station"
                                    },
                                    location: {
                                        type: 'string',
                                        required: true,
                                        example: 'City Center',
                                        description: "The location of the parking station"
                                    },
                                    ratePerMinute: {
                                        type: 'number',
                                        required: true,
                                        example: 10,
                                        description: "The rate per minute for parking"
                                    },
                                    slotCount: {
                                        type: 'number',
                                        required: true,
                                        example: 20,
                                        description: "The number of parking slots to create"
                                    }
                                },
                                required: ['name', 'location', 'ratePerMinute', 'slotCount']
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Parking station created successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Parking station created with slots.'
                                        },
                                        station: {
                                            $ref: '#/components/schemas/ParkingStation'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': {
                        description: 'Invalid request data'
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can create stations'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            get: {
                tags: ["Parking Station Management"],
                summary: 'Get all parking stations',
                description: 'Endpoint to retrieve all parking stations with their slots',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                responses: {
                    '200': {
                        description: 'List of parking stations retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/ParkingStation'
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        },
        '/v1/api/station/{id}': {
            get: {
                tags: ["Parking Station Management"],
                summary: 'Get a specific parking station',
                description: 'Endpoint to retrieve a specific parking station by its ID with its slots',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking station to retrieve',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Parking station retrieved successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ParkingStation'
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '404': {
                        description: 'Parking station not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            put: {
                tags: ["Parking Station Management"],
                summary: 'Update a parking station',
                description: 'Endpoint to update a specific parking station by its ID',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking station to update',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        example: 'Downtown Parking',
                                        description: "The name of the parking station"
                                    },
                                    location: {
                                        type: 'string',
                                        example: 'City Center',
                                        description: "The location of the parking station"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Parking station updated successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Station updated.'
                                        },
                                        station: {
                                            $ref: '#/components/schemas/ParkingStation'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can update stations'
                    },
                    '404': {
                        description: 'Parking station not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            },
            delete: {
                tags: ["Parking Station Management"],
                summary: 'Delete a parking station',
                description: 'Endpoint to delete a specific parking station by its ID and all associated slots',
                security: [
                    {
                        bearerAuth: []
                    }
                ],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: 'ID of the parking station to delete',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Parking station deleted successfully',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            description: 'Success message',
                                            example: 'Station and related slots deleted successfully.'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '401': {
                        description: 'Unauthorized - User not authenticated'
                    },
                    '403': {
                        description: 'Forbidden - Only admins can delete stations'
                    },
                    '404': {
                        description: 'Parking station not found'
                    },
                    '500': {
                        description: 'Internal Server Error'
                    }
                }
            }
        }
    }
};

module.exports = { annotations };
