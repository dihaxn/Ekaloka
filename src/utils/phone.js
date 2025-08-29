/**
 * Phone number utilities for formatting and validation
 * Handles Sri Lankan phone numbers and international formats
 */

/**
 * Formats a phone number for display
 * @param {string} value - Raw phone number input
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Handle Sri Lankan numbers (07XXXXXXXX format)
    if (digits.startsWith('7') && digits.length <= 9) {
        const remainingDigits = digits.slice(1);
        if (remainingDigits.length <= 8) {
            return `07${remainingDigits}`;
        }
    }
    
    // Handle international format (+94XXXXXXXXX)
    if (digits.startsWith('94') && digits.length <= 11) {
        const remainingDigits = digits.slice(2);
        if (remainingDigits.length <= 9) {
            return `+94${remainingDigits}`;
        }
    }
    
    // Handle numbers starting with 0
    if (digits.startsWith('0') && digits.length <= 10) {
        return digits;
    }
    
    // Return as-is if no pattern matches
    return digits;
};

/**
 * Validates if a phone number is a valid Sri Lankan format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid Sri Lankan format
 */
export const validateSriLankanPhone = (phone) => {
    if (!phone) return false;
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Check if it's a valid Sri Lankan mobile number
    // Format: 07XXXXXXXX (9 digits starting with 7)
    if (digits.startsWith('7') && digits.length === 9) {
        return true;
    }
    
    // Check if it's a valid Sri Lankan mobile number with country code
    // Format: +947XXXXXXXX (12 digits starting with 947)
    if (digits.startsWith('947') && digits.length === 12) {
        return true;
    }
    
    // Check if it's a valid Sri Lankan mobile number with leading 0
    // Format: 07XXXXXXXX (10 digits starting with 07)
    if (digits.startsWith('07') && digits.length === 10) {
        return true;
    }
    
    return false;
};

/**
 * Normalizes phone number to +94XXXXXXXXX format for backend
 * @param {string} phone - Phone number to normalize
 * @returns {string} - Normalized phone number in +94XXXXXXXXX format
 */
export const normalizePhoneForBackend = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // If it starts with 7 and is 9 digits, add +94 prefix
    if (digits.startsWith('7') && digits.length === 9) {
        return `+94${digits}`;
    }
    
    // If it starts with 07 and is 10 digits, remove 0 and add +94 prefix
    if (digits.startsWith('07') && digits.length === 10) {
        return `+94${digits.slice(1)}`;
    }
    
    // If it already starts with 947 and is 12 digits, add + prefix
    if (digits.startsWith('947') && digits.length === 12) {
        return `+${digits}`;
    }
    
    // If it already starts with +94, return as-is
    if (phone.startsWith('+94')) {
        return phone;
    }
    
    // Default: assume it's a 9-digit number starting with 7
    if (digits.length === 9 && digits.startsWith('7')) {
        return `+94${digits}`;
    }
    
    // Return original if no pattern matches
    return phone;
};

/**
 * Extracts country code from phone number
 * @param {string} phone - Phone number
 * @returns {string} - Country code (e.g., '+94')
 */
export const extractCountryCode = (phone) => {
    if (phone.startsWith('+')) {
        const match = phone.match(/^\+(\d+)/);
        return match ? `+${match[1]}` : '';
    }
    return '';
};

/**
 * Extracts local number without country code
 * @param {string} phone - Phone number
 * @returns {string} - Local number without country code
 */
export const extractLocalNumber = (phone) => {
    if (phone.startsWith('+94')) {
        return phone.slice(3);
    }
    if (phone.startsWith('0')) {
        return phone.slice(1);
    }
    return phone;
};
