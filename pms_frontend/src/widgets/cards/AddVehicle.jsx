import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import {servers} from "@/configs/server_api.js";
import {sendData} from "@/utils/helpers.js"; // adjust if needed

export function AddVehicleForm() {
    const [formData, setFormData] = useState({
        licensePlate: "",
        model: "",
        color: "",
        sits: ""
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

        const { licensePlate, model, color, sits } = formData;

        if (!licensePlate || !model || !color || !sits) {
            setMessage("All fields are required.");
            return;
        }

        const token = localStorage.getItem("pms_auth_token"); // or sessionStorage if you use that

        if (!token) {
            setMessage("Authentication token not found.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await sendData(`${servers.default}/vehicles`, {
                licensePlate,
                model,
                color,
                sits: parseInt(sits)
            }, token);

            if (res?.error) {
                setMessage(res.error);
            } else {
                setMessage(res.message || "Vehicle added successfully.");
                console.log("New Vehicle:", res.data.vehicle);

                // Reset form
                setFormData({
                    licensePlate: "",
                    model: "",
                    color: "",
                    sits: ""
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
                Add Your Vehicle
            </Typography>

            <div className="grid gap-4">
                <Input
                    label="License Plate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                />
                <Input
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                />
                <Input
                    label="Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                />
                <Input
                    label="Number of Sits"
                    name="sits"
                    type="number"
                    value={formData.sits}
                    onChange={handleChange}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Vehicle"}
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
