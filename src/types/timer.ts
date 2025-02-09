export interface ITimer {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  status: 'paused' | 'running' | 'completed';
  progress: number;
  category: string;
  halfAlert: boolean;
}
