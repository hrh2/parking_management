import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { fetchData, returnToken } from "@/utils/helpers.js";
import { servers } from "@/configs/server_api.js";
import { usePopup } from "@/context/PopupContext.jsx";
import { TextField, Button, Box, Typography } from "@mui/material";
import {AddVehicleForm} from "@/widgets/cards/AddVehicle.jsx";
import RequestSlot from "@/widgets/cards/RequestSlot.jsx";

const AvailableSlotsTable = () => {
    const { showPopup } = usePopup();
    const [slots, setSlots] = useState([]);
    const [page, setPage] = useState(0); // zero-based page index for DataGrid
    const [pageSize, setPageSize] = useState(10);
    const [rowCount, setRowCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [stationId, setStationId] = useState("");
    const [filter, setFilter] = useState("");

    const getAvailableSlots = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: (page + 1).toString(),
                limit: pageSize.toString(),
                ...(filter ? { stationId: filter } : {}),
            });

            const url = `${servers.default}/slots?${queryParams.toString()}`;
            const result = await fetchData(url, returnToken());

            if (result.error) {
                showPopup(result.error);
            } else {
                // Assuming result.data.slots contains array
                const slotsData = result.data.slots || result.data;
                setSlots(slotsData);

                // Ensure we have a proper rowCount for pagination

                const total = result.data.total ||
                    result.data.pagination?.totalItems ||
                    (slotsData.length === pageSize ? (page + 1) * pageSize + 1 : (page + 1) * pageSize);

                console.log("Total items:", total, "Current page:", page, "Page size:", pageSize);

                setRowCount(total);
            }
        } catch (error) {
            showPopup("Failed to fetch slots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAvailableSlots();
    }, [page, pageSize, filter]);

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        // Check if there might be more pages
        const totalPages = Math.ceil(rowCount / pageSize);
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handleSearch = () => {
        setFilter(stationId.trim());
        setPage(0); // Reset to first page on new filter
    };

    const handleSlotRequestClick = (id,slot,station) => {
        showPopup(
            <RequestSlot slot={id} slotNumber={slot} station={station}/>
        );
    };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "slotNumber", headerName: "Slot Number", width: 150 },
        { field: "stationName", headerName: "Station", width: 200 },
        {
            field: "isAvailable",
            headerName: "Available",
            width: 120,
            renderCell: (params) => (params.value ? "Yes" : "No"),
        },
        {
            field: "action",
            headerName: "Action",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSlotRequestClick(params.row.id,params.row.slotNumber,params.row.stationName)}
                >
                    Park Here
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8 min-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Available Slots</h2>

            <div className="mb-4 flex gap-2">
                <TextField
                    label="Filter by Station ID"
                    variant="outlined"
                    size="small"
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                </Button>
            </div>

            <div style={{ height: 600, width: "100%" }}>

                <DataGrid
                    rows={slots.map((slot) => ({
                        ...slot,
                        id: slot.id || slot._id,
                        stationName: slot.station?.name || "N/A",
                    }))}
                    showToolbar
                    columns={columns}
                    hideFooterPagination
                    loading={loading}
                />

                <div

                    className={`flex justify-between items-center  bg-white p-8`}
                >
                    <div>
                        <Typography variant="body2">
                            Showing {slots.length} of {rowCount} items - Page {page + 1}
                        </Typography>
                    </div>

                    <div className={`flex gap-3  items-center bg-white`}>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(0); // Reset to first page when changing page size
                            }}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                borderColor: '#ddd'
                            }}
                        >
                            {[5, 10, 20, 50,100,1000].map((size) => (
                                <option key={size} value={size}>
                                    {size} per page
                                </option>
                            ))}
                        </select>

                        <Button
                            variant="outlined"
                            onClick={handlePreviousPage}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleNextPage}
                            disabled={slots.length < pageSize || (page + 1) * pageSize >= rowCount}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailableSlotsTable;