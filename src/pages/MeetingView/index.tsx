import React from 'react';
import { Meeting, Company } from '../../types';
import { ItemCard } from '../../components/ItemCard';

interface MeetingViewProps {
  meetings: Meeting[];
  onDeleteMeeting: (id: string) => void;
  onToggleMeeting: (id: string) => void;
  companies: Company[];
}

export const MeetingView: React.FC<MeetingViewProps> = ({
  meetings,
  onDeleteMeeting,
  onToggleMeeting,
  companies,
}) => {
  return (
    <div>
      <h2>Minhas Reuniões</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {meetings.length === 0 ? (
          <div className="empty-state">
            <p>Lista vazia.</p>
          </div>
        ) : (
          meetings.map((meeting) => (
            <ItemCard
              key={meeting.id}
              item={meeting}
              type="meeting"
              companies={companies}
              onDelete={onDeleteMeeting}
              onToggle={onToggleMeeting}
              isListMode
            />
          ))
        )}
      </div>
    </div>
  );
};
