'use client';

import React, { useEffect, useState } from 'react';

import { ValidationError } from '../types/errors';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: ValidationError | null;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error = null,
  options = [],
  rows = 3,
  min,
  max,
  step,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
}: FormFieldProps) {
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const showError = error && (isTouched || error.field === name);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  const handleBlur = () => {
    setIsTouched(true);
    setIsFocused(false);
    onBlur?.();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const getInputClasses = () => {
    const baseClasses =
      'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200';

    if (showError) {
      return `${baseClasses} border-red-300 focus:ring-red-500 focus:border-red-500 ${inputClassName}`;
    }

    if (isFocused) {
      return `${baseClasses} border-blue-300 focus:ring-blue-500 focus:border-blue-500 ${inputClassName}`;
    }

    return `${baseClasses} border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 ${inputClassName}`;
  };

  const getLabelClasses = () => {
    const baseClasses = 'block text-sm font-medium text-gray-700 mb-1';
    return `${baseClasses} ${labelClassName}`;
  };

  const getErrorClasses = () => {
    const baseClasses = 'mt-1 text-sm text-red-600';
    return `${baseClasses} ${errorClassName}`;
  };

  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      disabled,
      className: getInputClasses(),
      placeholder,
      required,
    };

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />;

      case 'select':
        return (
          <select {...commonProps}>
            <option value=''>Select {label.toLowerCase()}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            {...commonProps}
            type='number'
            min={min}
            max={max}
            step={step}
          />
        );

      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className={`${className}`}>
      <label htmlFor={name} className={getLabelClasses()}>
        {label}
        {required && <span className='text-red-500 ml-1'>*</span>}
      </label>

      {renderInput()}

      {showError && <p className={getErrorClasses()}>{error.message}</p>}

      {type === 'password' && (
        <p className='mt-1 text-xs text-gray-500'>
          Password must be at least 8 characters long
        </p>
      )}
    </div>
  );
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationSchema: Record<
    keyof T,
    Array<(value: T[keyof T], fieldName: string) => ValidationError | null>
  >
) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<keyof T, ValidationError | null>>(
    {} as any
  );
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as any);

  const validateField = (
    field: keyof T,
    value: T[keyof T]
  ): ValidationError | null => {
    const validators = validationSchema[field];
    if (!validators) return null;

    for (const validator of validators) {
      const error = validator(value, field as string);
      if (error) return error;
    }
    return null;
  };

  const validateAll = (): boolean => {
    const newErrors: Record<keyof T, ValidationError | null> = {} as any;
    let isValid = true;

    for (const field of Object.keys(validationSchema) as Array<keyof T>) {
      const error = validateField(field, data[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const setFieldValue = (field: keyof T, value: T[keyof T]) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof T): ValidationError | null => {
    return touched[field] ? errors[field] : null;
  };

  const reset = () => {
    setData(initialData);
    setErrors({} as any);
    setTouched({} as any);
  };

  return {
    data,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    validateField,
    validateAll,
    reset,
    isValid:
      Object.keys(errors).length === 0 ||
      Object.values(errors).every(error => !error),
  };
}
