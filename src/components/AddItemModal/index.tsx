import React from 'react';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Select } from '../Select';
import { Button } from '../Button';
import { Company } from '../../types';

interface FormData {
  title: string;
  date: string;
  time: string;
  type: string;
  category: string;
  alert: boolean;
}

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: FormData;
  onFormChange: (field: keyof FormData, value: string | boolean) => void;
  companies: Company[];
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  companies,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Item">
      <form onSubmit={onSubmit}>
        <Input
          autoFocus
          type="text"
          label="O que vamos fazer?"
          placeholder="Ex: Reunião de Alinhamento"
          value={formData.title}
          onChange={(e) => onFormChange('title', e.target.value)}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <Input
            type="date"
            label="Data"
            value={formData.date}
            onChange={(e) => onFormChange('date', e.target.value)}
          />
          <Input
            type="time"
            label="Horário"
            value={formData.time}
            onChange={(e) => onFormChange('time', e.target.value)}
          />
          <Select
            label="Tipo"
            value={formData.type}
            onChange={(e) => onFormChange('type', e.target.value)}
            options={[
              { value: 'task', label: 'Tarefa' },
              { value: 'meeting', label: 'Reunião' },
            ]}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contexto / Empresa</label>
          <div className="radio-group">
            {companies.map((cat) => (
              <div
                key={cat.id}
                className={`radio-option ${formData.category === cat.id ? 'selected' : ''}`}
                onClick={() => onFormChange('category', cat.id)}
              >
                <div className="color-dot" style={{ backgroundColor: cat.color }} />
                <span style={{ fontSize: '14px', flex: 1 }}>{cat.name}</span>
                {formData.category === cat.id && (
                  <i className="ri-checkbox-circle-fill text-blue-500"></i>
                )}
              </div>
            ))}
          </div>
        </div>

        {formData.type === 'meeting' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="alertCheck"
              checked={formData.alert}
              onChange={(e) => onFormChange('alert', e.target.checked)}
              style={{ width: 'auto' }}
            />
            <label
              htmlFor="alertCheck"
              style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Alertar quando chegar a hora?
            </label>
          </div>
        )}

        <Button type="submit" variant="primary">
          Adicionar
        </Button>
      </form>
    </Modal>
  );
};
