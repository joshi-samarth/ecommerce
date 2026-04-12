import React from 'react';

const FormInput = ({ label, name, type = 'text', value, onChange, error, placeholder, disabled, required, maxLength }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {name === 'phone' && !error && (
                <p className="text-xs text-gray-500 mt-1">📞 Please enter exactly 10 digits (numbers only)</p>
            )}
        </div>
    );
};

export default FormInput;
