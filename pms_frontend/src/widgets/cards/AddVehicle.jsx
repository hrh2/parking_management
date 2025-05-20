import React, { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import sendData from "@/utils/sendData"; // adjust the path if needed

export function AddVehicleForm() {
    const [formData, setFormData] = useState({
        licensePlate: "",
        model: "",
        color: "",
        sits: "",
        ownerId: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { licensePlate, model, color, sits, ownerId } = formData;

        if (!licensePlate || !model || !color || !sits || !ownerId) {
            console.error("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            const res = await sendData("/vehicles", {
                licensePlate,
                model,
                color,
                sits,
                ownerId
            });
            console.log("Vehicle added successfully:", res);
            // Optionally reset form
            setFormData({
                licensePlate: "",
                model: "",
                color: "",
                sits: "",
                ownerId: ""
            });
        } catch (err) {
            console.error("Error adding vehicle:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto"
        >
            <Typography variant="h5" className="mb-4">
                Add Vehicle
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
                <Input
                    label="Owner ID"
                    name="ownerId"
                    value={formData.ownerId}
                    onChange={handleChange}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Vehicle"}
                </Button>
            </div>
        </form>
    );
}
