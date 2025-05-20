import {
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendData } from "@/utils/helpers.js";
import { servers } from "@/configs/server_api.js";
import { usePopup } from "@/context/PopupContext.jsx";

export default function ResetPassword() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        verificationCode: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (step === 1) {
            // Step 1: Send Verification Code
            try {
                const result = await sendData(`${servers.default}/auth/send-verification-code`, {
                    email: form.email,
                }, "");
                if (result.error) {
                    showPopup(result.error);
                } else {
                    showPopup(result.message || "Verification code sent.");
                    setStep(2);
                }
            } catch (err) {
                showPopup("Failed to send code. Try again.");
            } finally {
                setLoading(false);
            }
        } else {
            // Step 2: Submit new password
            const { email, verificationCode, newPassword, confirmPassword } = form;

            if (!email || !verificationCode || !newPassword || !confirmPassword) {
                showPopup("Please fill in all fields.");
                setLoading(false);
                return;
            }

            if (newPassword !== confirmPassword) {
                showPopup("Passwords do not match.");
                setLoading(false);
                return;
            }

            try {
                const result = await sendData(`${servers.default}/auth/password-updated`, {
                    email,
                    verificationCode,
                    newPassword,
                }, "");
                if (result.error) {
                    showPopup(result.error);
                } else {
                    // showPopup(result.message || "Password updated successfully!");
                    // navigate("/auth/sign-in");
                    if (result.data) {
                        localStorage.setItem("pms_auth_token", result.data.token);
                    }
                    // setTimeout(() => {
                        navigate("/");
                    // }, 2000);
                }
            } catch (err) {
                showPopup("Something went wrong. Try again.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section className="m-4 h-[80vh] flex gap-4">
            <div className="w-full lg:w-3/5 mt-24">
                <div className="text-center">
                    <Typography variant="h2" className="font-bold mb-4">
                        {step === 1 ? "Reset Password" : "Set New Password"}
                    </Typography>
                    <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
                        {step === 1
                            ? "Enter your email to receive a verification code."
                            : "Enter the code sent to your email and set a new password."}
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 mx-auto w-80 max-w-screen-lg lg:w-1/2 flex flex-col gap-5">
                    {/* Email (always shown) */}
                    <Input
                        type="email"
                        name="email"
                        label="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="mb-4"
                        required
                        disabled={step === 2} // Lock email after step 1
                    />

                    {step === 2 && (
                        <>
                            <Input
                                type="text"
                                name="verificationCode"
                                label="Verification Code"
                                value={form.verificationCode}
                                onChange={handleChange}
                                className="mb-4"
                                required
                            />
                            <Input
                                type="password"
                                name="newPassword"
                                label="New Password"
                                value={form.newPassword}
                                onChange={handleChange}
                                className="mb-4"
                                required
                            />
                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="mb-4"
                                required
                            />
                        </>
                    )}

                    <Button type="submit" className={`my-5`} fullWidth disabled={loading}>
                        {loading ? "Processing..." : step === 1 ? "Send Code" : "Update Password"}
                    </Button>
                </form>
            </div>

            <div className="w-2/5 hidden lg:block">
                <img
                    src="/img/pattern.png"
                    alt="reset password illustration"
                    className="h-[90vh] w-full object-cover rounded-3xl"
                />
            </div>
        </section>
    );
}
