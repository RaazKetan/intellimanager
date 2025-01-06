// src/types/index.ts
export interface Program {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: 'Not Started' | 'In Progress' | 'On Hold' | 'Completed';
    budget: number;
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
  
  export interface Risk {
    id: string;
    programId: string;
    title: string;
    description: string;
    impact: 'Low' | 'Medium' | 'High';
    probability: 'Low' | 'Medium' | 'High';
    mitigationPlan: string;
    status: 'Open' | 'Mitigated' | 'Closed';
  }