import React from 'react';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen = true,
  onClose,
  title,
  children,
  maxWidth,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={maxWidth ? { maxWidth } : undefined}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">
            <i className="ri-close-line" style={{ fontSize: '20px' }}></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
