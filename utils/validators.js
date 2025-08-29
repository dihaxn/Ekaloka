/**
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates password strength requirements
 * @param {string} password - Password to validate
 * @returns {Object} Object with isValid boolean and errors object
 */
export const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return {
        isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol,
        errors: {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSymbol
        }
    };
};

/**
 * Gets human-readable password error message
 * @param {Object} passwordValidation - Result from validatePassword
 * @returns {string} Human-readable error message
 */
export const getPasswordErrorMessage = (passwordValidation) => {
    const failedRules = [];
    
    if (!passwordValidation.errors.minLength) failedRules.push('min 8 characters');
    if (!passwordValidation.errors.hasUpperCase) failedRules.push('uppercase letter');
    if (!passwordValidation.errors.hasLowerCase) failedRules.push('lowercase letter');
    if (!passwordValidation.errors.hasNumber) failedRules.push('number');
    if (!passwordValidation.errors.hasSymbol) failedRules.push('symbol');
    
    if (failedRules.length === 0) return '';
    
    return `Requires: ${failedRules.join(', ')}`;
};
