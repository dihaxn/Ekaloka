/**
 * Validation utilities for form inputs
 * Provides client-side validation for email, password, and other fields
 * 
 * NOTE: Client-side validation is for UX only. Server-side validation is REQUIRED.
 */

/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength and complexity
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with checks and overall validity
 */
export const validatePassword = (password) => {
    const checks = {
        'At least 8 characters': password.length >= 8,
        'At least one uppercase letter': /[A-Z]/.test(password),
        'At least one lowercase letter': /[a-z]/.test(password),
        'At least one number': /\d/.test(password),
        'At least one symbol': /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const isValid = Object.values(checks).every(Boolean);

    return {
        isValid,
        checks
    };
};

/**
 * Generates human-readable password error message
 * @param {Object} validation - Result from validatePassword
 * @returns {string} - User-friendly error message
 */
export const getPasswordErrorMessage = (validation) => {
    if (validation.isValid) return '';

    const failedChecks = Object.entries(validation.checks)
        .filter(([_, isMet]) => !isMet)
        .map(([requirement, _]) => requirement);

    if (failedChecks.length === 1) {
        return `Password must include: ${failedChecks[0]}`;
    } else if (failedChecks.length === 2) {
        return `Password must include: ${failedChecks[0]} and ${failedChecks[1]}`;
    } else {
        const lastCheck = failedChecks.pop();
        return `Password must include: ${failedChecks.join(', ')}, and ${lastCheck}`;
    }
};

/**
 * Validates if a string is not empty and has minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if validation passes
 */
export const validateRequired = (value, minLength = 1) => {
    return value && value.trim().length >= minLength;
};

/**
 * Validates phone number format (basic check)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone format is valid
 */
export const validatePhoneFormat = (phone) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};
