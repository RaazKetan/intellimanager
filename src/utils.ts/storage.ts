// src/utils/storage.ts
import { Program, Task, Risk } from '../types';

export const StorageKeys = {
  PROGRAMS: 'programs',
  TASKS: 'tasks',
  RISKS: 'risks',
} as const;

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadPrograms = (): Program[] => 
  getStorageItem<Program[]>(StorageKeys.PROGRAMS, []);

export const loadTasks = (): Task[] => 
  getStorageItem<Task[]>(StorageKeys.TASKS, []);

export const loadRisks = (): Risk[] => 
  getStorageItem<Risk[]>(StorageKeys.RISKS, []);

export const savePrograms = (programs: Program[]): void =>
  setStorageItem(StorageKeys.PROGRAMS, programs);

export const saveTasks = (tasks: Task[]): void =>
  setStorageItem(StorageKeys.TASKS, tasks);

export const saveRisks = (risks: Risk[]): void =>
  setStorageItem(StorageKeys.RISKS, risks); 