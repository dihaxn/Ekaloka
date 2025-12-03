'use client';
import { validatePassword } from '@/utils/validators';

/**
 * Password strength indicator component
 * @param {Object} props
 * @param {string} props.password - Password to analyze
 */
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const validation = validatePassword(password);
  const strength = Object.values(validation.errors).filter(Boolean).length;

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className='mt-2'>
      <div className='flex items-center gap-2 mb-1'>
        <div className='flex-1 h-2 bg-gray-600 rounded-full overflow-hidden'>
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className='text-xs text-gray-400'>{getStrengthText()}</span>
      </div>
      <div className='grid grid-cols-2 gap-1 text-xs text-gray-500'>
        <div
          className={`flex items-center gap-1 ${validation.errors.minLength ? 'text-green-400' : ''}`}
        >
          <span>{validation.errors.minLength ? '✓' : '○'}</span>
          Min 8 characters
        </div>
        <div
          className={`flex items-center gap-1 ${validation.errors.hasUpperCase ? 'text-green-400' : ''}`}
        >
          <span>{validation.errors.hasUpperCase ? '✓' : '○'}</span>
          Uppercase letter
        </div>
        <div
          className={`flex items-center gap-1 ${validation.errors.hasLowerCase ? 'text-green-400' : ''}`}
        >
          <span>{validation.errors.hasLowerCase ? '✓' : '○'}</span>
          Lowercase letter
        </div>
        <div
          className={`flex items-center gap-1 ${validation.errors.hasNumber ? 'text-green-400' : ''}`}
        >
          <span>{validation.errors.hasNumber ? '✓' : '○'}</span>
          Number
        </div>
        <div
          className={`flex items-center gap-1 ${validation.errors.hasSymbol ? 'text-green-400' : ''}`}
        >
          <span>{validation.errors.hasSymbol ? '✓' : '○'}</span>
          Symbol
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
