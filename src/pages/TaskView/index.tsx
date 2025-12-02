import React from 'react';
import { Task, Company } from '../../types';
import { ItemCard } from '../../components/ItemCard';

interface TaskViewProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onDeleteTask: (id: string) => void;
  companies: Company[];
}

export const TaskView: React.FC<TaskViewProps> = ({ tasks, setTasks, onDeleteTask, companies }) => {
  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div>
      <h2>Tarefas do Dia</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>Lista vazia.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <ItemCard
              key={task.id}
              item={task}
              type="task"
              companies={companies}
              onToggle={toggleTask}
              onDelete={onDeleteTask}
              isListMode
            />
          ))
        )}
      </div>
    </div>
  );
};
