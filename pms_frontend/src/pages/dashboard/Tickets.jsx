import React, {useEffect, useState} from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {usePopup} from "@/context/PopupContext.jsx";
import {fetchData, returnToken} from "@/utils/helpers.js";
import {servers} from "@/configs/server_api.js";

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showPopup } = usePopup();

    useEffect(() => {
        fetchRequests()

    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const result = await fetchData(`${servers.default}/tickets/my`, returnToken());
            if (result.error) {
                showPopup(result.error);
            } else {
                setTickets(result.data); // Assuming `result.data` contains the array of courses
            }
        } catch (error) {
            showPopup("Failed to fetch courses.");
        }finally {
            setLoading(false);
        }
    };

    // Flattened rows for each slot with station info
    const rows = tickets.map((request) => ({
        id: request._id,
        slot: request.slot?.slotNumber,
        vehicle: request.vehicle?.licensePlate ,
        user: request.user?.email ,
        model: request.vehicle?.model,
        startTime: request.startTime,
        endTime: request.startTime,
        duration: request.durationMinutes,
        status: request.isPaid?"Paid":"Not Paid",
        amount: request.amount,
    }));

    const columns = [
        { field: 'slot', headerName: 'Slot Number', width: 60 },
        { field: 'vehicle', headerName: 'Vehicle', width: 150 },
        { field: 'model', headerName: 'Model', width: 120},
        { field: 'startTime', headerName: 'Entry Time', width: 130 },
        { field: 'endTime', headerName: 'Exit Time', width: 130 },
        { field: 'duration', headerName: 'Duration', width: 130 },
        { field: 'amount', headerName: 'Amount(FRW)', width: 130 },
        { field: 'status', headerName: 'Payment Status', width: 110 },
        { field: 'user', headerName: 'User Email', width: 160 },
    ];
    return (
        <div style={{ height: 600, width: '100%' }}>
            <h2 className="text-xl font-bold mb-2">Tickets History</h2>
            {rows.length === 0 && !loading && (
                <p className="text-gray-500 text-center mt-4">No Tickets history.</p>
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
}

export default Tickets;