import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  children,
  icon,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'danger':
        return 'btn-primary';
      case 'ghost':
        return 'nav-btn';
      default:
        return 'nav-btn';
    }
  };

  const getDangerStyle = () => {
    if (variant === 'danger') {
      return { backgroundColor: 'var(--danger-color)', marginTop: 0 };
    }
    return {};
  };

  return (
    <button className={`${getVariantClass()} ${className}`} style={getDangerStyle()} {...props}>
      {icon && <i className={icon}></i>}
      {children}
    </button>
  );
};
