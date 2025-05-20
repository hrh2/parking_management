import React, { useEffect, useState } from "react";
import {
    Typography,
    Card,
    CardBody,
    IconButton,
    Spinner,
    Tooltip
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { servers } from "@/configs/server_api.js";
import { deleteData, fetchData, returnToken } from "@/utils/helpers.js";
import {ErrorNotification, SuccessNotification} from "@/widgets/cards/Notifications.jsx";

export function ClientVehiclesList({title}) {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const triggerSuccess = (msg) => {
        setSuccessMsg(msg);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const triggerError = (msg) => {
        setErrorMsg(msg);
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
    };

    const fetchVehicles = async () => {
        if (!returnToken("pms_auth_token")) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetchData(`${servers.default}/vehicles`, returnToken("pms_auth_token"));
            if (res?.error) {
                triggerError(res.error);
            } else {
                setVehicles(res.data);
            }
        } catch (err) {
            triggerError("Failed to fetch vehicles.");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id) => {
        if (!returnToken("pms_auth_token")) return;
        if (!confirm("Are you sure you want to delete this vehicle?")) return;
        try {
            const res = await deleteData(`${servers.default}/vehicles/${id}`, returnToken("pms_auth_token"));
            if (res?.error) {
                triggerError(res.error);
            } else {
                triggerSuccess(res.message || "Vehicle deleted.");
                fetchVehicles(); // Refresh list
            }
        } catch (err) {
            triggerError("Error deleting vehicle.");
        }
    };

    const handleEdit = (vehicle) => {
        alert(`Edit vehicle: ${vehicle.licensePlate}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Spinner color="blue" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl min-h-[80vh] mx-auto mt-6 p-4">
            {/* Notifications */}
            <SuccessNotification open={showSuccess} setOpen={setShowSuccess} message={successMsg} />
            <ErrorNotification open={showError} setOpen={setShowError} message={errorMsg} />

            <Typography variant="h4" className="mb-4 text-center">
                {title?title:"Your Registered Vehicles"}
            </Typography>

            {vehicles.length < 1  ? (
                <Typography color="gray" className="text-center">
                    No vehicles found.
                </Typography>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle._id} className="shadow-md">
                            <CardBody className="relative">
                                <Typography variant="h6" className="mb-2">
                                    {vehicle.licensePlate}
                                </Typography>
                                <Typography>Model: {vehicle.model}</Typography>
                                <Typography>Color: {vehicle.color}</Typography>
                                <Typography>Sits: {vehicle.sits}</Typography>

                                <div className="absolute top-2 right-2 flex gap-2">
                                    {/*<Tooltip content="Edit">*/}
                                    {/*    <IconButton*/}
                                    {/*        size="sm"*/}
                                    {/*        color="blue"*/}
                                    {/*        onClick={() => handleEdit(vehicle)}*/}
                                    {/*    >*/}
                                    {/*        <PencilIcon className="h-4 w-4" />*/}
                                    {/*    </IconButton>*/}
                                    {/*</Tooltip>*/}
                                    <Tooltip content="Delete">
                                        <IconButton
                                            size="sm"
                                            color="red"
                                            onClick={() => handleDelete(vehicle._id)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
