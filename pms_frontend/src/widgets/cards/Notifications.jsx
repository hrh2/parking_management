import React from "react";
import { Alert } from "@material-tailwind/react";
import {
    InformationCircleIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";

export function SuccessNotification({ open, setOpen, message }) {
    return (
        <Alert
            open={open}
            color="green"
            icon={<CheckCircleIcon className="h-6 w-6" />}
            onClose={() => setOpen(false)}
            className="max-w-xl mx-auto mb-4"
        >
            {message}
        </Alert>
    );
}

export function ErrorNotification({ open, setOpen, message }) {
    return (
        <Alert
            open={open}
            color="red"
            icon={<XCircleIcon className="h-6 w-6" />}
            onClose={() => setOpen(false)}
            className="max-w-xl mx-auto mb-4"
        >
            {message}
        </Alert>
    );
}

export function InfoNotification({ open, setOpen, message }) {
    return (
        <Alert
            open={open}
            color="blue"
            icon={<InformationCircleIcon className="h-6 w-6" />}
            onClose={() => setOpen(false)}
            className="max-w-xl mx-auto mb-4"
        >
            {message}
        </Alert>
    );
}

export function WarningNotification({ open, setOpen, message }) {
    return (
        <Alert
            open={open}
            color="amber"
            icon={<ExclamationTriangleIcon className="h-6 w-6" />}
            onClose={() => setOpen(false)}
            className="max-w-xl mx-auto mb-4"
        >
            {message}
        </Alert>
    );
}
