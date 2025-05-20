import React, { useState, useEffect } from 'react';
import { useApiWithPopup, createPopupMessage, createConfirmationPopup } from '@/utils/apiUtils';
import { usePopup } from '@/context/PopupContext';

/**
 * Example component demonstrating how to use the API integration with popups
 */
function ApiIntegrationExample() {
  const api = useApiWithPopup();
  const { showPopup } = usePopup();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load stations on component mount
  useEffect(() => {
    loadStations();
  }, []);

  /**
   * Load all parking stations
   */
  const loadStations = async () => {
    setLoading(true);
    
    const result = await api.stations.getAll({
      showSuccessPopup: false,
      onSuccess: (data) => {
        console.log('Stations loaded successfully:', data);
      },
      onError: (error) => {
        console.error('Error loading stations:', error);
      }
    });
    
    if (!result.error && result.data) {
      setStations(result.data);
    }
    
    setLoading(false);
  };

  /**
   * Create a new parking station
   */
  const createStation = async () => {
    // Example station data
    const stationData = {
      name: 'New Station',
      location: 'Example Location',
      capacity: 50,
      description: 'This is an example station created from the frontend'
    };
    
    await api.stations.create(stationData, {
      showSuccessPopup: true,
      successMessage: 'Station created successfully!',
      onSuccess: (result) => {
        // Reload stations to show the new one
        loadStations();
      }
    });
  };

  /**
   * Delete a parking station with confirmation
   * @param {string} id - Station ID
   */
  const deleteStation = (id) => {
    // Show confirmation popup before deleting
    showPopup(
      createConfirmationPopup(
        'Are you sure you want to delete this station?',
        async () => {
          // User confirmed, proceed with deletion
          await api.stations.delete(id, {
            showSuccessPopup: true,
            successMessage: 'Station deleted successfully!',
            onSuccess: () => {
              // Reload stations to update the list
              loadStations();
            }
          });
        },
        () => {
          // User canceled, show message
          showPopup(createPopupMessage('Deletion canceled', 'info'));
        }
      )
    );
  };

  /**
   * Show a custom popup message
   * @param {string} type - Message type (success, error, info, warning)
   */
  const showCustomPopup = (type) => {
    showPopup(
      createPopupMessage(
        `This is an example ${type} message that demonstrates the popup functionality.`,
        type
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Integration Example</h1>
      {/* Popup demo buttons */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Popup Examples</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => showCustomPopup('success')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Success Popup         </button>
          <button
            onClick={() => showCustomPopup('error')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Error Popup
          </button>
          <button
            onClick={() => showCustomPopup('info')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Info Popup
          </button>
          <button
            onClick={() => showCustomPopup('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Warning Popup
          </button>
        </div>
      </div>
      
      {/* API integration demo */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Parking Stations</h2>
        
        <button
          onClick={createStation}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        >
          Create New Station
        </button>
        
        {loading ? (
          <p>Loading stations...</p>
        ) : stations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stations.map((station) => (
              <div
                key={station._id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold">{station.name}</h3>
                <p className="text-gray-600">{station.location}</p>
                <p className="mb-2">Capacity: {station.capacity}</p>
                <p className="mb-4">{station.description}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteStation(station._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No stations found. Create one to get started.</p>
        )}
      </div>
    </div>
  );
}

export default ApiIntegrationExample;