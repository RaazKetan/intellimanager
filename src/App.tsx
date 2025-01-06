import React, { useState, useEffect, useCallback } from 'react';
import { Program, Task, Blocker } from './types';
import ProgramList from './components/ProgramList';
import TaskBoard from './components/TaskBoard';
import AIAssistant from './components/AIAssistant';
import BlockerRegister from './components/BlockerRegister';

interface ProgramData {
  program: Program;
  tasks: {
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  };
  blockers: {
    active: Blocker[];
    resolved: Blocker[];
    deferred: Blocker[];
  };
}

const App: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [programData, setProgramData] = useState<Record<string, ProgramData>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('programManagementData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.programs) {
          setPrograms(parsedData.programs);
          if (parsedData.activeProgramId) {
            const activeProgram = parsedData.programs.find(
              (p: Program) => p.id === parsedData.activeProgramId
            );
            setActiveProgram(activeProgram || null);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const saveData = () => {
      try {
        const dataToStore = {
          programs,
          programData,
          activeProgramId: activeProgram?.id
        };
        localStorage.setItem('programManagementData', JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [programs, programData, activeProgram]);

  // Initialize program data when a new program is created
  const initializeProgramData = (program: Program) => {
    setProgramData(prev => ({
      ...prev,
      [program.id]: {
        program,
        tasks: {
          todo: [],
          inProgress: [],
          done: []
        },
        blockers: {
          active: [],
          resolved: [],
          deferred: []
        }
      }
    }));
  };

  // Handle program selection
  const handleSetActiveProgram = (program: Program | null) => {
    setActiveProgram(program);
    if (program && !programData[program.id]) {
      initializeProgramData(program);
    }
  };

  // Handle tasks updates
  const handleUpdateTasks = useCallback((tasks: Task[]) => {
    if (!activeProgram) return;

    setProgramData(prev => ({
      ...prev,
      [activeProgram.id]: {
        ...prev[activeProgram.id],
        tasks: {
          todo: tasks.filter(task => task.status === 'Todo'),
          inProgress: tasks.filter(task => task.status === 'In Progress'),
          done: tasks.filter(task => task.status === 'Done')
        }
      }
    }));
  }, [activeProgram]);

  // Handle blockers updates
  const handleUpdateBlockers = useCallback((blockers: Blocker[]) => {
    if (!activeProgram) return;

    setProgramData(prev => ({
      ...prev,
      [activeProgram.id]: {
        ...prev[activeProgram.id],
        blockers: {
          active: blockers.filter(blocker => blocker.status === 'Active'),
          resolved: blockers.filter(blocker => blocker.status === 'Resolved'),
          deferred: blockers.filter(blocker => blocker.status === 'Deferred')
        }
      }
    }));
  }, [activeProgram]);

  // Get all tasks for current program
  const getCurrentProgramTasks = useCallback((): Task[] => {
    if (!activeProgram || !programData[activeProgram.id]) return [];
    const { todo, inProgress, done } = programData[activeProgram.id].tasks;
    return [...todo, ...inProgress, ...done];
  }, [activeProgram, programData]);

  // Get all blockers for current program
  const getCurrentProgramBlockers = useCallback((): Blocker[] => {
    if (!activeProgram || !programData[activeProgram.id]) return [];
    const { active, resolved, deferred } = programData[activeProgram.id].blockers;
    return [...active, ...resolved, ...deferred];
  }, [activeProgram, programData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Program Management Assistant</h1>
      </nav>
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3">
            <ProgramList 
              programs={programs}
              setPrograms={setPrograms}
              activeProgram={activeProgram}
              setActiveProgram={handleSetActiveProgram}
            />
          </div>
          
          <div className="md:col-span-9">
            {activeProgram ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{activeProgram.name}</h2>
                <div className="p-4 bg-white rounded-lg shadow mb-4">
                  <h3 className="text-lg font-medium mb-2">Program Overview</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Tasks</p>
                      <p className="font-medium">
                        Todo: {programData[activeProgram.id]?.tasks.todo.length || 0}
                      </p>
                      <p className="font-medium">
                        In Progress: {programData[activeProgram.id]?.tasks.inProgress.length || 0}
                      </p>
                      <p className="font-medium">
                        Done: {programData[activeProgram.id]?.tasks.done.length || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Blockers</p>
                      <p className="font-medium">
                        Active: {programData[activeProgram.id]?.blockers.active.length || 0}
                      </p>
                      <p className="font-medium">
                        Resolved: {programData[activeProgram.id]?.blockers.resolved.length || 0}
                      </p>
                      <p className="font-medium">
                        Deferred: {programData[activeProgram.id]?.blockers.deferred.length || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{activeProgram.status}</p>
                      <p className="text-sm mt-1">
                        Start: {new Date(activeProgram.startDate).toLocaleDateString()}
                      </p>
                      {activeProgram.endDate && (
                        <p className="text-sm">
                          End: {new Date(activeProgram.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <TaskBoard 
                  tasks={getCurrentProgramTasks()}
                  setTasks={handleUpdateTasks}
                  programId={activeProgram.id}
                />
                <BlockerRegister
                  blockers={getCurrentProgramBlockers()}
                  setBlockers={handleUpdateBlockers}
                  programId={activeProgram.id}
                />
                <AIAssistant 
                  program={activeProgram}
                  tasks={getCurrentProgramTasks()}
                  blockers={getCurrentProgramBlockers()}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                Select a program to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;