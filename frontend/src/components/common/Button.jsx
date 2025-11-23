import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  onClick,
  ...props
}) => {
  const buttonClass = `
    btn 
    btn-${variant} 
    btn-${size}
    ${fullWidth ? 'btn-full-width' : ''}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="btn-spinner" size={20} />
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;