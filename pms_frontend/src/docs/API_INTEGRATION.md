# API Integration Documentation

This document explains how the frontend and backend are integrated in the Parking Management System (PMS).

## Overview

The integration between the frontend and backend is implemented using:

1. **API Endpoints Configuration**: Centralized configuration of all API endpoints
2. **API Service**: A service that handles API calls to the backend
3. **API Utilities**: Utilities that combine API calls with popup feedback
4. **Example Component**: A reference implementation showing how to use the integration

## Files Structure

```
pms_frontend/src/
├── configs/
│   └── server_api.js         # API endpoints configuration
├── services/
│   └── api.js                # API service for making requests to the backend
├── utils/
│   ├── helpers.js            # General helper functions (including API helpers)
│   └── apiUtils.js           # Utilities for API calls with popup feedback
├── context/
│   └── PopupContext.jsx      # Context provider for popup functionality
├── widgets/
│   └── cards/
│       └── PopupView.jsx     # Popup UI component
└── examples/
    └── ApiIntegrationExample.jsx  # Example component demonstrating the integration
```

## How to Use the API Integration

### 1. Basic API Calls

For simple API calls without popup feedback, you can use the `ApiService` directly:

```jsx
import ApiService from '@/services/api';

// Example: Get all parking stations
const fetchStations = async () => {
  const result = await ApiService.stations.getAll();
  if (!result.error) {
    // Handle successful response
    console.log(result.data);
  } else {
    // Handle error
    console.error(result.error);
  }
};
```

### 2. API Calls with Popup Feedback

For API calls with automatic popup feedback, use the `useApiWithPopup` hook:

```jsx
import { useApiWithPopup } from '@/utils/apiUtils';

function MyComponent() {
  const api = useApiWithPopup();
  
  const fetchStations = async () => {
    const result = await api.stations.getAll({
      showSuccessPopup: true,
      successMessage: 'Stations loaded successfully!',
      onSuccess: (data) => {
        // Handle successful response
        console.log(data);
      },
      onError: (error) => {
        // Handle error (popup is shown automatically)
        console.error(error);
      }
    });
    
    if (!result.error) {
      // Additional success handling if needed
    }
  };
  
  // ...
}
```

### 3. Custom Popup Messages

You can create custom popup messages using the provided utilities:

```jsx
import { createPopupMessage, createConfirmationPopup } from '@/utils/apiUtils';
import { usePopup } from '@/context/PopupContext';

function MyComponent() {
  const { showPopup } = usePopup();
  
  // Show a simple message popup
  const showMessage = () => {
    showPopup(createPopupMessage('This is a custom message', 'success'));
  };
  
  // Show a confirmation popup
  const confirmAction = () => {
    showPopup(
      createConfirmationPopup(
        'Are you sure you want to proceed?',
        () => {
          // User confirmed
          console.log('User confirmed');
        },
        () => {
          // User canceled
          console.log('User canceled');
        }
      )
    );
  };
  
  // ...
}
```

## Role-Based Access Control

The application uses role-based access control to restrict access to certain features based on the user's role:

1. The user's role is stored in the JWT token
2. The App.jsx file checks the user's role and renders routes accordingly
3. API calls include the JWT token for authentication and authorization

Example of how routes are rendered based on user role:

```jsx
// In App.jsx
<Route path="/" element={token ? <Dashboard /> : <Navigate to="/auth/sign-in" />} >
  {routes.map(
    ({ layout, pages }) =>
      layout === userRole() &&
      pages.map(({ path, element }) => (
        <Route path={path} element={element} />
      ))
  )}
</Route>
```

## Adding New API Endpoints

To add a new API endpoint:

1. Add the endpoint to `server_api.js`:

```javascript
// In server_api.js
export const API_ENDPOINTS = {
  // ...existing endpoints
  
  // New endpoint
  NEW_FEATURE: {
    BASE: `${default_api}/new-feature`,
    GET_ALL: `${default_api}/new-feature`,
    GET_BY_ID: (id) => `${default_api}/new-feature/${id}`,
    CREATE: `${default_api}/new-feature`,
    UPDATE: (id) => `${default_api}/new-feature/${id}`,
    DELETE: (id) => `${default_api}/new-feature/${id}`,
  },
};
```

2. Add methods to the `ApiService` in `api.js`:

```javascript
// In api.js
static newFeature = {
  getAll: async () => {
    return await fetchData(API_ENDPOINTS.NEW_FEATURE.GET_ALL, ApiService.getToken());
  },
  getById: async (id) => {
    return await fetchData(API_ENDPOINTS.NEW_FEATURE.GET_BY_ID(id), ApiService.getToken());
  },
  create: async (data) => {
    return await sendData(API_ENDPOINTS.NEW_FEATURE.CREATE, data, ApiService.getToken());
  },
  update: async (id, data) => {
    return await updateData(API_ENDPOINTS.NEW_FEATURE.UPDATE(id), data, ApiService.getToken());
  },
  delete: async (id) => {
    return await updateData(API_ENDPOINTS.NEW_FEATURE.DELETE(id), { _method: 'DELETE' }, ApiService.getToken());
  },
};
```

3. Add methods to the `useApiWithPopup` hook in `apiUtils.js`:

```javascript
// In apiUtils.js
newFeature: {
  getAll: async (options = {}) => {
    return handleApiCall(() => ApiService.newFeature.getAll(), options);
  },
  getById: async (id, options = {}) => {
    return handleApiCall(() => ApiService.newFeature.getById(id), options);
  },
  create: async (data, options = {}) => {
    return handleApiCall(() => ApiService.newFeature.create(data), options);
  },
  update: async (id, data, options = {}) => {
    return handleApiCall(() => ApiService.newFeature.update(id, data), options);
  },
  delete: async (id, options = {}) => {
    return handleApiCall(() => ApiService.newFeature.delete(id), options);
  },
},
```

## Troubleshooting

### Common Issues

1. **API calls failing with 401 Unauthorized**:
   - Check if the token is valid and not expired
   - Ensure the token is being sent in the Authorization header

2. **Popups not showing**:
   - Make sure the `PopupProvider` is wrapping your component in the component tree
   - Check if `showPopup` is being called correctly

3. **Role-based routes not working**:
   - Verify that the user's role is correctly decoded from the JWT token
   - Check if the route's layout matches the user's role

### Debugging Tips

1. Use the browser's developer tools to inspect network requests
2. Check the console for error messages
3. Add console.log statements to track the flow of data
4. Verify that the API endpoints in the frontend match those in the backend

## Example Component

An example component demonstrating the API integration is provided in `examples/ApiIntegrationExample.jsx`. This component shows:

1. How to load data from the API
2. How to create new data
3. How to handle confirmation for destructive actions
4. How to display different types of popup messages

You can use this component as a reference when implementing new features.