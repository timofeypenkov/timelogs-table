export interface TooltipState {
  content: string;
  visible: boolean;
  position: { top: number; left: number };
}

export interface TaskRecord {
  id: string;
  project: string;
  description: string;
  date: string;
  time: number;
}

export interface Person {
  id: string;
  name: string;
  team: string;
  records: TaskRecord[];
}

export interface Team {
  name: string;
  members: Person[];
}

export interface DateInfo {
  fullDate: string;
  date: string;
  weekday: string;
  month: string;
  isWeekend: boolean;
}
