import { useEffect } from 'react';
import { Alert as MTAlert } from "@material-tailwind/react";

export default function Alert({ message, type = "success", onClose, duration = 3000, inline = false }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, onClose, duration]);

    if (!message) return null;

    const alertContent = (
        <MTAlert 
            color={type === "success" ? "green" : type === "error" ? "red" : "blue"}
            className="shadow-lg"
            onClose={onClose}
        >
            {message}
        </MTAlert>
    );

    if (inline) {
        return alertContent;
    }

    return (
        <div className="fixed top-4 right-4 transition-all duration-300 z-50">
            {alertContent}
        </div>
    );
}
