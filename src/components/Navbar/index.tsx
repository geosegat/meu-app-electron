import React from 'react';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  currentTime: string;
  onAddClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setView,
  currentTime,
  onAddClick,
}) => {
  return (
    <header className="header">
      <div className="logo-section">
        <img
          src="/unnamed.png"
          alt="Logo"
          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div className="app-title">Meu Gerenciador</div>
      </div>

      <nav className="nav-menu">
        <button
          className={`nav-btn ${currentView === 'overview' ? 'active' : ''}`}
          onClick={() => setView('overview')}
        >
          <i className="ri-dashboard-line"></i>
          Visão Geral
        </button>
        <button
          className={`nav-btn ${currentView === 'meetings' ? 'active' : ''}`}
          onClick={() => setView('meetings')}
        >
          <i className="ri-calendar-line"></i>
          Reuniões
        </button>
        <button
          className={`nav-btn ${currentView === 'tasks' ? 'active' : ''}`}
          onClick={() => setView('tasks')}
        >
          <i className="ri-checkbox-circle-line"></i>
          Tarefas
        </button>
        <button
          className={`nav-btn ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => setView('settings')}
        >
          <i className="ri-settings-4-line"></i>
          Config
        </button>
      </nav>

      <div className="header-actions">
        <div className="clock-display">{currentTime}</div>
        <button className="btn-add" onClick={onAddClick}>
          <i className="ri-add-line" style={{ fontSize: '20px' }}></i>
        </button>
      </div>
    </header>
  );
};
