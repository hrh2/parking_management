import React, {useEffect, useState} from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import {servers} from "@/configs/server_api.js";
import {fetchData, returnToken, sendData} from "@/utils/helpers.js";
import Select from "react-select"; // adjust if needed

export default function RequestSlot({slot,station,slotNumber}) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [vehicles, setVehicles] = useState([]);

    const [formData, setFormData] = useState({
        slot: slot,
        vehicle: "",
        startTime: ""
    });

    const getAvailableVehicles = async () => {
        setLoading(true);
        try {
            const result = await fetchData(`${servers.default}/vehicles`, returnToken());
            if (result.error) {
                setMessage(result.error);
            } else {
                setMessage(result.message);
                setVehicles(
                    result.data.map((vehicle) => ({
                        value: vehicle._id,
                        label: vehicle.licensePlate,
                    }))
                );
            }
        } catch (error) {
            setMessage("Failed to fetch slots.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAvailableVehicles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { slot, vehicle, startTime } = formData;
        if (!slot || !vehicle || !startTime ) {
            setMessage("All fields are required.");
            return;
        }
        if (!returnToken()) {
            setMessage("Authentication token not found.");
            return;
        }
        setLoading(true);
        setMessage("");

        try {
            const res = await sendData(`${servers.default}/bookings`, {
                slot,
                vehicle,
                startTime ,
            }, returnToken());

            if (res?.error) {
                setMessage(res.error);
            } else {
                setMessage(res.message || "Vehicle added successfully.");

                // Reset form
                setFormData({
                    slot: "",
                    vehicle: "",
                    startTime: "",
                });
            }
        } catch (err) {
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChange = (selectedOption) => {
        setFormData({ ...formData, vehicle: selectedOption?.value || "" });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto"
        >
            <Typography variant="h4" className="mb-4 text-center">
                Request Parking Spot
            </Typography>
            <Typography variant="h6" className="mb-4 text-start">
                Parking Station: {station}
            </Typography>
            <Typography variant="h6" className="mb-4 text-start">
                Parking Slot: {slotNumber}
            </Typography>

            <div className="grid gap-4">
                <Select
                    options={vehicles}
                    onChange={handleSelectChange}
                    placeholder="Select Your Car"
                    isClearable
                    name="vehicle"
                    className={`text-gray-950`}
                    isSearchable
                />

                <Input
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleChange}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Request Parking Spot"}
                </Button>

                {message && (
                    <Typography
                        variant="small"
                        color={message.includes("success") ? "green" : "red"}
                    >
                        {message}
                    </Typography>
                )}
            </div>
        </form>
    );
}
