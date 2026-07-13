export interface User {
  id: string;
  email: string;
}

export interface LifeArea {
  id: string;
  name: string;
  color?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused';
  targetDate?: string;
  lifeArea?: LifeArea;
  tasks?: Task[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  goal?: Goal;
  createdAt: string;
}
