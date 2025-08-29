'use client'
import { CheckCircle, XCircle, Info } from 'lucide-react';

/**
 * MessageAlert Component
 * Displays success, error, or info messages with appropriate styling and icons
 * 
 * @param {Object} message - Message object with type and text
 * @param {string} message.type - Type of message: 'success', 'error', or 'info'
 * @param {string} message.text - Message text to display
 * @returns {JSX.Element|null} - Rendered message or null if no message
 */
const MessageAlert = ({ message }) => {
    // Return null if no message or no text
    if (!message?.text) {
        return null;
    }

    const getIcon = () => {
        switch (message.type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return null;
        }
    };

    const getAlertClasses = () => {
        const baseClasses = "flex items-start gap-3 p-4 rounded-md border";
        
        switch (message.type) {
            case 'success':
                return `${baseClasses} bg-green-900/50 border-green-600 text-green-200`;
            case 'error':
                return `${baseClasses} bg-red-900/50 border-red-600 text-red-200`;
            case 'info':
                return `${baseClasses} bg-blue-900/50 border-blue-600 text-blue-200`;
            default:
                return `${baseClasses} bg-gray-800/50 border-gray-600 text-gray-200`;
        }
    };

    return (
        <div
            className={getAlertClasses()}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
        >
            {getIcon()}
            <div className="flex-1">
                <p className="text-sm font-medium">{message.text}</p>
            </div>
        </div>
    );
};

export default MessageAlert;
