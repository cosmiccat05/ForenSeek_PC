import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
  required = false,
  disabled = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-left">
            <Icon size={20} />
          </div>
        )}
        
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            input 
            ${Icon ? 'input-has-icon-left' : ''} 
            ${isPasswordType ? 'input-has-icon-right' : ''}
            ${error ? 'input-error' : ''}
          `}
          {...props}
        />
        
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="input-icon-right"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <span className="input-error-message">{error}</span>
      )}
    </div>
  );
};

export default Input;