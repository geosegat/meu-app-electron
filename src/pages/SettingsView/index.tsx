import React, { useState } from 'react';
import { Settings, Company } from '../../types';
import { AddCompanyModal } from '../../components/AddCompanyModal';
import { ConfirmationModal } from '../../components/ConfirmationModal';

interface SettingsViewProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  companies: Company[];
  setCompanies: (companies: Company[]) => void;
  onTestSound: () => void;
  isPlaying: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  companies,
  setCompanies,
  onTestSound,
  isPlaying,
}) => {
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState('');
  const [companyColor, setCompanyColor] = useState('#059669');

  const toggleAutoLaunch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const enabled = e.target.checked;
    const result = await window.ipcRenderer.invoke('app:toggleAutoLaunch', enabled);
    setSettings({ ...settings, autoLaunch: result });
  };

  const selectAudioFile = async () => {
    const path = await window.ipcRenderer.invoke('dialog:openFile');
    if (path) {
      setSettings({ ...settings, alarmSoundPath: path });
    }
  };

  const handleSubmitCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName) return;

    const company: Company = {
      id: editingCompany ? editingCompany.id : Date.now().toString(),
      name: companyName,
      color: companyColor,
    };

    if (editingCompany) {
      setCompanies(companies.map((c) => (c.id === company.id ? company : c)));
    } else {
      setCompanies([...companies, company]);
    }

    setShowCompanyModal(false);
    setEditingCompany(null);
    setCompanyName('');
    setCompanyColor('#059669');
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setCompanyName(company.name);
    setCompanyColor(company.color);
    setShowCompanyModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      setCompanies(companies.filter((c) => c.id !== companyToDelete));
      setCompanyToDelete(null);
    }
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setCompanyName('');
    setCompanyColor('#059669');
    setShowCompanyModal(true);
  };

  return (
    <div>
      <h2>Configurações</h2>

      <div className="settings-card">
        <div className="settings-item">
          <div>
            <h3>Iniciar com o Windows</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Abrir o app automaticamente ao ligar o PC
            </p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={settings.autoLaunch} onChange={toggleAutoLaunch} />
            <span className="slider"></span>
          </label>
        </div>

        <div
          className="settings-item"
          style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}
        >
          <div>
            <h3>Som do Alarme</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Escolha um arquivo MP3 do seu computador para tocar.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <input
              type="text"
              disabled
              value={settings.alarmSoundPath || 'Som padrão (Beep)'}
              className="form-input"
              style={{ flex: 1, color: 'var(--text-muted)' }}
            />

            <button
              className="nav-btn"
              style={{
                border: '1px solid var(--border-color)',
                width: '40px',
                justifyContent: 'center',
                padding: 0,
              }}
              onClick={onTestSound}
              title={isPlaying ? 'Pausar' : 'Testar Som'}
            >
              <i className={isPlaying ? 'ri-pause-line' : 'ri-play-fill'}></i>
            </button>

            <button
              className="nav-btn"
              style={{ border: '1px solid var(--border-color)' }}
              onClick={selectAudioFile}
            >
              Escolher Arquivo
            </button>
          </div>
        </div>

        <div
          className="settings-item"
          style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            borderBottom: 'none',
            paddingTop: '24px',
          }}
        >
          <h3 style={{ marginBottom: '12px' }}>Gerenciar Empresas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            {companies.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-app)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="color-dot" style={{ backgroundColor: c.color }} />
                  <span style={{ fontSize: '14px' }}>{c.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditCompany(c)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    title="Editar"
                  >
                    <i className="ri-settings-3-line" style={{ fontSize: '16px' }}></i>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(c.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                    title="Remover"
                  >
                    <i
                      className="ri-delete-bin-line"
                      style={{ fontSize: '16px', color: 'var(--danger-color)' }}
                    ></i>
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleAddCompany}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px dashed var(--text-muted)',
                borderRadius: '8px',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
              }}
            >
              + Adicionar Empresa
            </button>
          </div>
        </div>
      </div>

      <AddCompanyModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSubmit={handleSubmitCompany}
        name={companyName}
        onNameChange={setCompanyName}
        color={companyColor}
        onColorChange={setCompanyColor}
        isEditMode={!!editingCompany}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Remover Empresa"
        message="Tem certeza que deseja remover esta empresa? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
