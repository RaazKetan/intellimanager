export interface Program {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';
  budget: number;
  parties?: Party[];
}

export interface Task {
  id: string;
  programId: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done';
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Blocker {
  id: string;
  programId: string;
  title: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  startDate: string;
  isProjectOnHold: boolean;
  projectHoldDate?: string;
  status: 'Active' | 'Resolved' | 'Deferred';
  resolution?: string;
}

export interface Party {
  name: string;
  designation: string;
}