'use client'
import { CheckCircle, AlertCircle, Info } from "lucide-react";

/**
 * Accessible message alert component
 * @param {Object} props
 * @param {Object} props.message - Message object with type and text
 * @param {string} props.message.type - Type of message: 'success', 'error', 'info'
 * @param {string} props.message.text - Message text to display
 */
const MessageAlert = ({ message }) => {
    if (!message?.text) return null;

    const getIcon = () => {
        switch (message.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const getAlertClasses = () => {
        switch (message.type) {
            case 'success':
                return 'bg-green-900/20 border-green-500/50 text-green-300';
            case 'error':
                return 'bg-red-900/20 border-red-500/50 text-red-300';
            default:
                return 'bg-blue-900/20 border-blue-500/50 text-blue-300';
        }
    };

    return (
        <div 
            className={`mb-6 p-4 rounded-lg border ${getAlertClasses()}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="flex items-center gap-2">
                {getIcon()}
                <span>{message.text}</span>
            </div>
        </div>
    );
};

export default MessageAlert;
