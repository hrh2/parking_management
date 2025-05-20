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
