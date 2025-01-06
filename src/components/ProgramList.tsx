// components/ProgramList.tsx
import React, { useState, useEffect } from 'react';
import { Program } from '../types';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface ProgramListProps {
  programs: Program[];
  setPrograms: (programs: Program[]) => void;
  activeProgram: Program | null;
  setActiveProgram: (program: Program | null) => void;
}

const ProgramList: React.FC<ProgramListProps> = ({
  programs,
  setPrograms,
  activeProgram,
  setActiveProgram
}) => {
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({});
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [newParties, setNewParties] = useState<Array<{ name: string; designation: string }>>([]);
  const [newParty, setNewParty] = useState<{ name: string; designation: string }>({
    name: '',
    designation: ''
  });

  const handleAddProgram = () => {
    if (!newProgram.name) return;

    const program: Program = {
      id: Date.now().toString(),
      name: newProgram.name,
      description: newProgram.description || '',
      startDate: newProgram.startDate || new Date().toISOString().split('T')[0],
      endDate: newProgram.endDate || '',
      status: 'Not Started',
      budget: newProgram.budget || 0,
      parties: newParties,
    };

    const updatedPrograms = [...programs, program];
    setPrograms(updatedPrograms);
    
    // Store in localStorage
    try {
      localStorage.setItem('programManagementData', JSON.stringify({
        programs: updatedPrograms,
        activeProgramId: activeProgram?.id
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    setNewProgram({});
    setNewParties([]);
    setIsAddingProgram(false);
  };

  const handleEditProgram = () => {
    if (!newProgram.name || !editingProgramId) return;

    const updatedPrograms = programs.map(program => {
      if (program.id === editingProgramId) {
        const updatedProgram = {
          ...program,
          name: newProgram.name || program.name,
          description: newProgram.description || program.description,
          parties: newParties.length ? newParties : program.parties,
        };
        
        // Update activeProgram if this was the active one
        if (activeProgram?.id === program.id) {
          setActiveProgram(updatedProgram);
        }
        return updatedProgram;
      }
      return program;
    });

    setPrograms(updatedPrograms);
    
    // Store in localStorage
    try {
      localStorage.setItem('programManagementData', JSON.stringify({
        programs: updatedPrograms,
        activeProgramId: activeProgram?.id
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    setNewProgram({});
    setNewParties([]);
    setIsEditingProgram(false);
    setEditingProgramId(null);
  };

  const handleDeleteProgram = (programId: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;

    const updatedPrograms = programs.filter(program => program.id !== programId);
    setPrograms(updatedPrograms);
    
    if (activeProgram?.id === programId) {
      setActiveProgram(null);
    }

    // Store in localStorage
    try {
      localStorage.setItem('programManagementData', JSON.stringify({
        programs: updatedPrograms,
        activeProgramId: activeProgram?.id === programId ? null : activeProgram?.id
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleAddParty = () => {
    if (!newParty.name || !newParty.designation) return;
    setNewParties(prevParties => [...prevParties, newParty]);
    setNewParty({ name: '', designation: '' });
  };

  const startEditing = (program: Program) => {
    setIsEditingProgram(true);
    setEditingProgramId(program.id);
    setNewProgram({
      name: program.name,
      description: program.description,
    });
    setNewParties(program.parties || []);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Programs</h2>
        <button
          onClick={() => setIsAddingProgram(true)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Program Form */}
      {(isAddingProgram || isEditingProgram) && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Program Name"
            className="w-full p-2 border rounded"
            value={newProgram.name || ''}
            onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newProgram.description || ''}
            onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
          />
          <div className="mb-2">
            <h3 className="font-medium">Add Parties</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Party Name"
                className="w-full p-2 border rounded"
                value={newParty.name}
                onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Party Designation"
                className="w-full p-2 border rounded"
                value={newParty.designation}
                onChange={(e) => setNewParty({ ...newParty, designation: e.target.value })}
              />
              <button
                onClick={handleAddParty}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Party
              </button>
            </div>
            <ul className="mt-2">
              {newParties.map((party, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {party.name} ({party.designation})
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            <button
              onClick={isEditingProgram ? handleEditProgram : handleAddProgram}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {isEditingProgram ? 'Update Program' : 'Save Program'}
            </button>
            <button
              onClick={() => {
                setIsAddingProgram(false);
                setIsEditingProgram(false);
                setEditingProgramId(null);
                setNewProgram({});
                setNewParties([]);
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-2">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`p-3 rounded ${
              activeProgram?.id === program.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div
                className="flex-1 cursor-pointer"
                onClick={() => setActiveProgram(program)}
              >
                <h3 className="font-medium">{program.name}</h3>
                <p className="text-sm text-gray-600">{program.status}</p>
                {program.parties && program.parties.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Parties: {program.parties.map(p => `${p.name} (${p.designation})`).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => startEditing(program)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;