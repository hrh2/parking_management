const default_api = import.meta.env.VITE_DEFAULT_SERVER_URL || 'http://localhost:5000/v1/api';

// API endpoints
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: `${default_api}/auth/login`,
        REGISTER: `${default_api}/auth/register`,
        VERIFY: `${default_api}/auth/verify`,
        RESET_PASSWORD: `${default_api}/auth/reset-password`,
    },
    // Admin
    ADMIN: {
        REPORTS: `${default_api}/admin/reports`,
    },
    // Parking Stations
    STATIONS: {
        BASE: `${default_api}/station`,
        GET_ALL: `${default_api}/station`,
        GET_BY_ID: (id) => `${default_api}/station/${id}`,
        CREATE: `${default_api}/station`,
        UPDATE: (id) => `${default_api}/station/${id}`,
        DELETE: (id) => `${default_api}/station/${id}`,
    },
    // Parking Slots
    SLOTS: {
        BASE: `${default_api}/slots`,
        GET_ALL: `${default_api}/slots`,
        GET_BY_ID: (id) => `${default_api}/slots/${id}`,
        GET_BY_STATION: (stationId) => `${default_api}/slots/station/${stationId}`,
        CREATE: `${default_api}/slots`,
        UPDATE: (id) => `${default_api}/slots/${id}`,
        DELETE: (id) => `${default_api}/slots/${id}`,
    },
    // Bookings
    BOOKINGS: {
        BASE: `${default_api}/bookings`,
        GET_ALL: `${default_api}/bookings`,
        GET_BY_ID: (id) => `${default_api}/bookings/${id}`,
        GET_USER_BOOKINGS: `${default_api}/bookings/user`,
        CREATE: `${default_api}/bookings`,
        UPDATE: (id) => `${default_api}/bookings/${id}`,
        DELETE: (id) => `${default_api}/bookings/${id}`,
    },
    // Vehicles
    VEHICLES: {
        BASE: `${default_api}/vehicles`,
        GET_ALL: `${default_api}/vehicles`,
        GET_BY_ID: (id) => `${default_api}/vehicles/${id}`,
        GET_USER_VEHICLES: `${default_api}/vehicles/user`,
        CREATE: `${default_api}/vehicles`,
        UPDATE: (id) => `${default_api}/vehicles/${id}`,
        DELETE: (id) => `${default_api}/vehicles/${id}`,
    },
    // Tickets
    TICKETS: {
        BASE: `${default_api}/tickets`,
        GET_ALL: `${default_api}/tickets`,
        GET_BY_ID: (id) => `${default_api}/tickets/${id}`,
        GET_USER_TICKETS: `${default_api}/tickets/user`,
        CREATE: `${default_api}/tickets`,
        UPDATE: (id) => `${default_api}/tickets/${id}`,
        DELETE: (id) => `${default_api}/tickets/${id}`,
    },
};

export const servers = {
    default: default_api,
};
