// App.tsx
import React, { useState, useEffect } from 'react';
import { Program, Task, Risk } from './types';
import ProgramList from './components/ProgramList';
import TaskBoard from './components/TaskBoard';
import RiskRegister from './components/RiskRegister';
import AIAssistant from './components/AIAssistant';
import PeopleInvolved from './components/PeopleInvolved';

const App: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPrograms = localStorage.getItem('programs');
    const savedTasks = localStorage.getItem('tasks');
    const savedRisks = localStorage.getItem('risks');

    if (savedPrograms) setPrograms(JSON.parse(savedPrograms));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedRisks) setRisks(JSON.parse(savedRisks));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('programs', JSON.stringify(programs));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('risks', JSON.stringify(risks));
  }, [programs, tasks, risks]);

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
              setActiveProgram={setActiveProgram}
            />
          </div>
          
          <div className="md:col-span-9">
            {activeProgram ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">{activeProgram.name}</h2>
                <TaskBoard 
                  tasks={tasks.filter(task => task.programId === activeProgram.id)}
                  setTasks={setTasks}
                  programId={activeProgram.id}
                />
                <RiskRegister 
                  risks={risks.filter(risk => risk.programId === activeProgram.id)}
                  setRisks={setRisks}
                  programId={activeProgram.id}
                />
                <AIAssistant 
                  program={activeProgram}
                  tasks={tasks}
                  risks={risks}
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