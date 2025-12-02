export type Category = string; // Company ID

export interface Company {
  id: string;
  name: string;
  color: string; // CSS class or hex
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: Category;
  notified: boolean;
  completed?: boolean;
}

export interface Settings {
  autoLaunch: boolean;
  alarmSoundPath: string | null;
}
