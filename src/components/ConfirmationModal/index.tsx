import React from 'react';
import { Modal } from '../Modal';
import { Button } from '../Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="400px">
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{message}</p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="ghost"
          style={{ border: '1px solid var(--border-color)', flex: 1, justifyContent: 'center' }}
        >
          Cancelar
        </Button>
        <Button onClick={handleConfirm} variant="danger" style={{ flex: 1 }}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};
