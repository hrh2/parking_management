import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import {servers} from "@/configs/server_api.js";
import {returnToken, sendData} from "@/utils/helpers.js"; // adjust if needed

export function AddStationForm() {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        ratePerMinute: 0,
        slotCount: 10,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            name,
            location,
            ratePerMinute,
            slotCount,
        } = formData;

        if (!name || !location || !ratePerMinute || !slotCount) {
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
            const res = await sendData(`${servers.default}/station`, {
                name,
                location,
                ratePerMinute:parseInt(ratePerMinute),
                slotCount: parseInt(slotCount)
            }, returnToken());

            if (res?.error) {
                setMessage(res.error);
            } else {
                setMessage(res.message || "Vehicle added successfully.");
                console.log("New Vehicle:", res.data.vehicle);

                // Reset form
                setFormData({
                    name: "",
                    location: "",
                    ratePerMinute: 0,
                    slotCount: 10,
                });
            }
        } catch (err) {
            setMessage("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto"
        >
            <Typography variant="h5" className="mb-4 text-center">
                Add Station
            </Typography>

            <div className="grid gap-4">
                <Input
                    label="Station Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                <Input
                    label="Rate Per Minute(FRW)"
                    name="ratePerMinute"
                    type="number"
                    value={formData.ratePerMinute}
                    onChange={handleChange}
                />
                <Input
                    label="Number of Slot in the station"
                    name="slotCount"
                    type="number"
                    value={formData.slotCount}
                    onChange={handleChange}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Station"}
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
