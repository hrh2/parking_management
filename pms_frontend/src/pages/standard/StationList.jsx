import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {fetchData, returnToken} from "@/utils/helpers.js";
import {servers} from "@/configs/server_api.js";
import {usePopup} from "@/context/PopupContext.jsx";

const StationsTable = () => {
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showPopup } = usePopup();

    useEffect(() => {
        fetchRequests()

    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const result = await fetchData(`${servers.default}/station`, returnToken());
            if (result.error) {
                showPopup(result.error);
            } else {
                setStations(result.data); // Assuming `result.data` contains the array of courses
            }
        } catch (error) {
            showPopup("Failed to fetch courses.");
        }finally {
            setLoading(false);
        }
    };

    // Flattened rows for each slot with station info
    const rows = stations.flatMap((station, stationIndex) =>
        station.slots.map((slot, slotIndex) => ({
            id: `${stationIndex}-${slotIndex}`,
            stationName: station.name,
            location: station.location,
            rate: station.ratePerMinute,
            slotNumber: slot.slotNumber,
            isAvailable: slot.isAvailable ? 'Yes' : 'No'
        }))
    );

    const columns = [
        { field: 'stationName', headerName: 'Station Name', width: 200 },
        { field: 'location', headerName: 'Location', width: 150 },
        { field: 'rate', headerName: 'Rate / Min', width: 120, type: 'number' },
        { field: 'slotNumber', headerName: 'Slot Number', width: 130 },
        { field: 'isAvailable', headerName: 'Available', width: 110 },
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <h2 className="text-xl font-bold mb-2">Parking Stations & Slots</h2>
            {rows.length === 0 && !loading && (
                <p className="text-gray-500 text-center mt-4">No station slots available.</p>
            )}
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                loading={loading}
            />
        </div>
    );
};

export default StationsTable;
