import { useState, useEffect } from 'react';
import './App.css';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { TaskView } from './pages/TaskView';
import { MeetingView } from './pages/MeetingView';
import { SettingsView } from './pages/SettingsView';
import { AddItemModal } from './components/AddItemModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { Task, Meeting, Settings, Category, Company } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [currentView, setView] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'task' | 'meeting' } | null>(
    null
  );

  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('meetings');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { autoLaunch: false, alarmSoundPath: null };
  });

  const [itemFormData, setItemFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    type: 'task',
    category: companies[0]?.id || ('Personal' as Category),
    alert: true,
  });

  const handleItemFormChange = (field: string, value: string | boolean) => {
    setItemFormData({ ...itemFormData, [field]: value });
  };

  const handleSubmitItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormData.title) return;

    if (itemFormData.type === 'task') {
      const [hours, minutes] = itemFormData.time.split(':').map(Number);
      const dateObj = new Date(itemFormData.date);
      dateObj.setHours(hours, minutes, 0, 0);

      const newTask: Task = {
        id: uuidv4(),
        title: itemFormData.title,
        completed: false,
        category: itemFormData.category as Category,
        date: itemFormData.date,
        time: itemFormData.time,
        createdAt: dateObj.getTime(),
      };
      setTasks([...tasks, newTask]);
    } else {
      const newMeeting: Meeting = {
        id: uuidv4(),
        title: itemFormData.title,
        date: itemFormData.date,
        time: itemFormData.time,
        category: itemFormData.category as Category,
        notified: !itemFormData.alert,
        completed: false,
      };
      setMeetings(
        [...meetings, newMeeting].sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        })
      );
    }
    setShowAddModal(false);
    setItemFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      type: 'task',
      category: companies[0]?.id || ('Personal' as Category),
      alert: true,
    });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const toggleMeeting = (id: string) => {
    setMeetings(meetings.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)));
  };

  const deleteTask = (id: string) => {
    setItemToDelete({ id, type: 'task' });
    setShowConfirmModal(true);
  };

  const deleteMeeting = (id: string) => {
    setItemToDelete({ id, type: 'meeting' });
    setShowConfirmModal(true);
  };

  const toggleTestSound = () => {
    if (isPlayingTest) {
      if (testAudio) {
        testAudio.pause();
        testAudio.currentTime = 0;
        setTestAudio(null);
      }
      setIsPlayingTest(false);
      return;
    }

    if (settings.alarmSoundPath) {
      const normalizedPath = settings.alarmSoundPath.replace(/\\/g, '/');
      const audio = new Audio(`local-media:///${normalizedPath}`);

      audio.onended = () => {
        setIsPlayingTest(false);
        setTestAudio(null);
      };

      audio
        .play()
        .then(() => {
          setTestAudio(audio);
          setIsPlayingTest(true);
        })
        .catch((e) => console.error('Error playing audio', e));
    } else {
      setIsPlayingTest(true);
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      setTimeout(() => {
        setIsPlayingTest(false);
      }, 500);
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'task') {
        setTasks(tasks.filter((t) => t.id !== itemToDelete.id));
      } else {
        setMeetings(meetings.filter((m) => m.id !== itemToDelete.id));
      }
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
  }, [meetings]);
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const checkMeetings = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toISOString().split('T')[0];

      setCurrentTime(timeString);

      const meetingToNotify = meetings.find((m) => {
        const meetingDate = m.date || dateString;
        return meetingDate === dateString && m.time === timeString && !m.notified;
      });

      if (meetingToNotify) {
        if (settings.alarmSoundPath) {
          const normalizedPath = settings.alarmSoundPath.replace(/\\/g, '/');
          const audio = new Audio(`local-media:///${normalizedPath}`);
          audio.play().catch((e) => console.error('Error playing audio', e));
        } else {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);

          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }

        const company = companies.find((c) => c.id === meetingToNotify.category);
        const notification = new Notification('Meu Gerenciador', {
          body: `${meetingToNotify.title} (${company?.name || 'Geral'})`,
          icon: '/unnamed.png',
        });

        notification.onclick = () => {
          if (window.ipcRenderer) {
            window.ipcRenderer.send('app:focus');
          }
          setView('meetings');
        };

        setMeetings((prev) =>
          prev.map((m) => (m.id === meetingToNotify.id ? { ...m, notified: true } : m))
        );
      }
    };

    const interval = setInterval(checkMeetings, 500);
    return () => clearInterval(interval);
  }, [meetings, settings.alarmSoundPath, companies]);

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('app:getAutoLaunchStatus').then((status) => {
        setSettings((prev) => ({ ...prev, autoLaunch: status }));
      });
    }
  }, []);

  return (
    <div className="app-container">
      <Navbar
        currentView={currentView}
        setView={setView}
        currentTime={currentTime}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="main-content">
        <div className="content-wrapper">
          {currentView === 'overview' && (
            <Dashboard
              tasks={tasks}
              meetings={meetings}
              companies={companies}
              onToggleTask={toggleTask}
              onToggleMeeting={toggleMeeting}
              onDeleteTask={deleteTask}
              onDeleteMeeting={deleteMeeting}
            />
          )}
          {currentView === 'tasks' && (
            <TaskView
              tasks={tasks}
              setTasks={setTasks}
              onDeleteTask={deleteTask}
              companies={companies}
            />
          )}
          {currentView === 'meetings' && (
            <MeetingView
              meetings={meetings}
              onDeleteMeeting={deleteMeeting}
              onToggleMeeting={toggleMeeting}
              companies={companies}
            />
          )}
          {currentView === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              companies={companies}
              setCompanies={setCompanies}
              onTestSound={toggleTestSound}
              isPlaying={isPlayingTest}
            />
          )}
        </div>
      </div>

      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitItem}
        formData={itemFormData}
        onFormChange={handleItemFormChange}
        companies={companies}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteItem}
        title={itemToDelete?.type === 'task' ? 'Excluir Tarefa' : 'Excluir Reunião'}
        message={`Tem certeza que deseja excluir esta ${
          itemToDelete?.type === 'task' ? 'tarefa' : 'reunião'
        }?`}
      />
    </div>
  );
}

export default App;
