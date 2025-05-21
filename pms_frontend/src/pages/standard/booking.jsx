import React, {useEffect, useState} from 'react';
import {usePopup} from "@/context/PopupContext.jsx";
import {fetchData, patchData, returnToken} from "@/utils/helpers.js";
import {servers} from "@/configs/server_api.js";
import {Button} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {Spinner} from "@material-tailwind/react";

export function Booking() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showPopup } = usePopup();
    // Fetch all pending requests
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const result = await fetchData(`${servers.default}/bookings/my`, returnToken());
            if (result.error) {
                showPopup(result.error);
            } else {
                setRequests(result.data); // Assuming `result.data` contains the array of courses
            }
        } catch (error) {
            showPopup("Failed to fetch courses.");
        }finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const completeRequest = async (id) => {
        setLoading(true);
        try {
            const result = await patchData(`${servers.default}/bookings/complete/${id}`,"", returnToken());
            if (result.error) {
                showPopup(result.error);
            } else {
                fetchRequests();
            }
        } catch (error) {
            showPopup("Failed to fetch practices.");
        }finally {
            setLoading(false)
        }
    };

    // Columns for the DataGrid
    const columns = [
        { field: "id", headerName: "Request ID", width: 50 },
        { field: "vehicle", headerName: "Vehicle", width: 100 },
        { field: "model", headerName: "Vehicle Model", width: 200 },
        { field: "startTime", headerName: "Start Time", width: 100 },
        { field: "slot", headerName: "Parking SPOT", width: 350 },
        { field: "status", headerName: "Status", width: 150 },
        // {
        //     field: "action",
        //     headerName: "Action",
        //     width:300,
        //     renderCell: (params) => (
        //         <div className={`flex gap-4 justify-between`}>
        //             <Button
        //                 variant="contained"
        //                 color="success"
        //                 onClick={() => completeRequest(params.row.id)}
        //                 disabled={params.row.status !== "APPROVED"}
        //             >
        //                 Exiting Car
        //             </Button>
        //         </div>
        //     ),
        // },
    ];

    // Map request data to rows
    const rows = requests.map((request) => ({
        id: request._id,
        vehicle: request.vehicle?.licensePlate ,
        model: request.vehicle?.model,
        startTime: request.startTime,
        status: request.status,
        slot: request.slot?.slotNumber,
    }));

    return (
        <div style={{ height: 600, width: '100%' }}>
            <h2 className="text-xl font-bold mb-2">Your Booking History</h2>
            {rows.length === 0 && !loading && (
                <p className="text-gray-500 text-center mt-4">No History available.</p>
            )}
            {!loading?
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    loading={loading}
                    showToolbar
                    disableSelectionOnClick
                />:
                <Spinner/>
            }
        </div>
    );
};

export default Booking;