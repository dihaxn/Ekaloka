/**
 * Formats a phone number input to Sri Lankan format (+94XXXXXXXXX)
 * @param {string} value - Raw phone input value
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    // If user starts with 0, convert to +94
    if (digits.startsWith('0')) {
        const remainingDigits = digits.slice(1);
        if (remainingDigits.length === 0) return '+94';
        if (remainingDigits.length <= 2) return `+94${remainingDigits}`;
        if (remainingDigits.length <= 5) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2)}`;
        if (remainingDigits.length <= 9) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5)}`;
        return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5, 9)}`;
    }
    
    // If user starts with +94, format normally
    if (digits.startsWith('94')) {
        const remainingDigits = digits.slice(2);
        if (remainingDigits.length === 0) return '+94';
        if (remainingDigits.length <= 2) return `+94${remainingDigits}`;
        if (remainingDigits.length <= 5) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2)}`;
        if (remainingDigits.length <= 9) return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5)}`;
        return `+94${remainingDigits.slice(0, 2)} ${remainingDigits.slice(2, 5)} ${remainingDigits.slice(5, 9)}`;
    }
    
    // If user starts with 7, assume they want +94
    if (digits.startsWith('7')) {
        if (digits.length <= 2) return `+94${digits}`;
        if (digits.length <= 5) return `+94${digits.slice(0, 2)} ${digits.slice(2)}`;
        if (digits.length <= 9) return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }
    
    // Default formatting
    if (digits.length <= 2) return `+94${digits}`;
    if (digits.length <= 5) return `+94${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 9) return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    return `+94${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
};

/**
 * Validates if a phone number is a valid Sri Lankan mobile number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Sri Lankan mobile number
 */
export const validateSriLankanPhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // Accept both +947XXXXXXXX and 07XXXXXXXX formats
    const sriLankanPhoneRegex = /^(\+94\d{9}|0\d{9})$/;
    return sriLankanPhoneRegex.test(cleanPhone);
};

/**
 * Normalizes phone number to +94XXXXXXXXX format for backend
 * @param {string} phone - Phone number to normalize
 * @returns {string} Normalized phone number
 */
export const normalizePhoneForBackend = (phone) => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.startsWith('0')) {
        return '+94' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('+94')) {
        return '+94' + cleanPhone;
    }
    return cleanPhone;
};
