import React from 'react';
import { Task, Meeting, Company } from '../../types';
import { ItemCard } from '../../components/ItemCard';

interface DashboardProps {
  tasks: Task[];
  meetings: Meeting[];
  companies: Company[];
  onToggleTask: (id: string) => void;
  onToggleMeeting: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteMeeting: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  meetings,
  companies,
  onToggleTask,
  onToggleMeeting,
  onDeleteTask,
  onDeleteMeeting,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const pendingMeetings = meetings.filter((m) => !m.completed);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2>
          <i className="ri-calendar-line text-blue-500"></i>
          Próximas Reuniões
        </h2>
        {pendingMeetings.length === 0 ? (
          <div className="empty-state">
            <i className="ri-briefcase-line" style={{ fontSize: '48px', opacity: 0.5 }}></i>
            <p>Nenhuma reunião pendente.</p>
          </div>
        ) : (
          <div className="card-grid">
            {pendingMeetings.map((meeting) => (
              <ItemCard
                key={meeting.id}
                item={meeting}
                type="meeting"
                companies={companies}
                onDelete={onDeleteMeeting}
                onToggle={onToggleMeeting}
              />
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
        <h2>
          <i className="ri-checkbox-circle-line text-emerald-500"></i>
          Lista de Tarefas
        </h2>
        {pendingTasks.length === 0 ? (
          <div className="empty-state">
            <i className="ri-check-double-line" style={{ fontSize: '48px', opacity: 0.5 }}></i>
            <p>Tudo feito por hoje!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingTasks.map((task) => (
              <ItemCard
                key={task.id}
                item={task}
                type="task"
                companies={companies}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                isListMode
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
