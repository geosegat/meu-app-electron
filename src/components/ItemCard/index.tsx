import React from 'react';
import type { Task, Meeting, Company } from '../../types';

interface ItemCardProps {
  item: Task | Meeting;
  type: 'task' | 'meeting';
  companies: Company[];
  onToggle?: (id: string) => void;
  onDelete: (id: string) => void;
  isListMode?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  companies,
  onToggle,
  onDelete,
  isListMode,
}) => {
  const isDone = 'completed' in item ? item.completed : false;

  const itemTime =
    'time' in item
      ? item.time
      : new Date((item as Task).createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
  const itemDate = 'date' in item ? item.date : undefined;

  const alert = 'notified' in item ? !(item as Meeting).notified : false;

  const company = companies.find((c) => c.id === item.category) || {
    id: 'unknown',
    name: 'Desconhecido',
    color: '#475569',
  };

  const isToday = itemDate === new Date().toISOString().split('T')[0];
  const dateDisplay =
    itemDate && !isToday ? itemDate.split('-').reverse().slice(0, 2).join('/') : null;

  return (
    <div className={`item-card ${isDone ? 'done' : ''} ${isListMode ? 'list-mode' : ''}`}>
      <div className="card-stripe" style={{ backgroundColor: company.color }} />

      <button
        className={`check-btn ${isDone ? 'checked' : ''}`}
        onClick={() => onToggle && onToggle(item.id)}
      >
        <i className="ri-check-line"></i>
      </button>

      <div className="card-content">
        <div className="card-header">
          <span
            className="company-badge"
            style={{
              borderColor: company.color,
              color: company.color,
              backgroundColor: `${company.color}20`,
            }}
          >
            {company.name}
          </span>
          {alert && (
            <i className="ri-notification-3-fill text-yellow-500" style={{ fontSize: '12px' }}></i>
          )}
        </div>
        <div className="card-title">{item.title}</div>
        <div className="card-time">
          <i className="ri-time-line"></i>
          <span>
            {dateDisplay && (
              <span style={{ marginRight: '6px', fontWeight: 500 }}>{dateDisplay}</span>
            )}
            {itemTime}
          </span>
        </div>
      </div>

      <button className="delete-btn" onClick={() => onDelete(item.id)}>
        <i className="ri-delete-bin-line" style={{ fontSize: '18px' }}></i>
      </button>
    </div>
  );
};
