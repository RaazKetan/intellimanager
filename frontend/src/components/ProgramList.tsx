// components/ProgramList.tsx
import React, { useState } from 'react';
import { Program } from '../types';
import { Plus } from 'lucide-react';

interface Party {
  name: string;
  designation: string;
}

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
  setActiveProgram,
}) => {
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [newProgram, setNewProgram] = useState<Partial<Program>>({});
  const [newParty, setNewParty] = useState<Party>({ name: '', designation: '' });
  const [newParties, setNewParties] = useState<Party[]>([]);

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

    setPrograms([...programs, program]);
    setNewProgram({});
    setNewParties([]);
    setIsAddingProgram(false);
  };

  const handleAddParty = () => {
    if (!newParty.name || !newParty.designation) return;
    setNewParties([...newParties, newParty]);
    setNewParty({ name: '', designation: '' });
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

      {isAddingProgram && (
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
            <input
              type="text"
              placeholder="Party Name"
              className="w-full p-2 border rounded mb-2"
              value={newParty.name}
              onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Party Designation"
              className="w-full p-2 border rounded mb-2"
              value={newParty.designation}
              onChange={(e) => setNewParty({ ...newParty, designation: e.target.value })}
            />
            <button
              onClick={handleAddParty}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Party
            </button>
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
              onClick={handleAddProgram}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Program
            </button>
            <button
              onClick={() => {
                setIsAddingProgram(false);
                setNewParties([]);
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {programs.map((program) => (
          <div
            key={program.id}
            className={`p-3 rounded cursor-pointer ${
              activeProgram?.id === program.id
                ? 'bg-blue-100 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setActiveProgram(program)}
          >
            <h3 className="font-medium">{program.name}</h3>
            <p className="text-sm text-gray-600">{program.status}</p>
            <div>
              <p className="text-sm text-gray-600">
                Parties: {program.parties?.map((p) => `${p.name} (${p.designation})`).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramList;
