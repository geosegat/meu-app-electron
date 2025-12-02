import React from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { ColorPicker } from '../ColorPicker';
import { Button } from '../Button';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  onNameChange: (value: string) => void;
  color: string;
  onColorChange: (value: string) => void;
  isEditMode?: boolean;
}

export const AddCompanyModal: React.FC<AddCompanyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  onNameChange,
  color,
  onColorChange,
  isEditMode = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Editar Empresa' : 'Nova Empresa'}>
      <form onSubmit={onSubmit}>
        <Input
          autoFocus
          type="text"
          label="Nome da Empresa"
          placeholder="Ex: Minha Startup"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />

        <ColorPicker value={color} onChange={onColorChange} />

        <Button type="submit" variant="primary">
          Salvar Empresa
        </Button>
      </form>
    </Modal>
  );
};
