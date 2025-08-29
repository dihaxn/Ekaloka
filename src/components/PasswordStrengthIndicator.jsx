'use client'
import { validatePassword } from '../utils/validators';

/**
 * PasswordStrengthIndicator Component
 * Shows visual feedback for password strength requirements
 * 
 * @param {string} password - Password to evaluate
 * @returns {JSX.Element} - Rendered password strength indicator
 */
const PasswordStrengthIndicator = ({ password }) => {
    if (!password) return null;

    const validation = validatePassword(password);
    const { isValid, checks } = validation;

    const getStrengthColor = () => {
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        const percentage = (passedChecks / totalChecks) * 100;

        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        if (percentage >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const getStrengthText = () => {
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        const percentage = (passedChecks / totalChecks) * 100;

        if (percentage >= 80) return 'Strong';
        if (percentage >= 60) return 'Good';
        if (percentage >= 40) return 'Fair';
        return 'Weak';
    };

    return (
        <div className="space-y-2">
            {/* Password strength bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{
                        width: `${(Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100}%`
                    }}
                />
            </div>

            {/* Strength text */}
            <p className={`text-sm font-medium ${isValid ? 'text-green-400' : 'text-gray-300'}`}>
                Password strength: {getStrengthText()}
            </p>

            {/* Requirements checklist */}
            <div className="space-y-1">
                <p className="text-xs font-medium text-gray-300 mb-2">Requirements:</p>
                {Object.entries(checks).map(([requirement, isMet]) => (
                    <div key={requirement} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isMet ? 'bg-green-500' : 'bg-gray-600'}`} />
                        <span className={`text-xs ${isMet ? 'text-green-400' : 'text-gray-400'}`}>
                            {requirement}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordStrengthIndicator;
