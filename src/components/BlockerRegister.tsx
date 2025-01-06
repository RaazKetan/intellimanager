import React, { useState } from 'react';

interface Blocker {
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

interface BlockerRegisterProps {
  blockers: Blocker[];
  setBlockers: (blockers: Blocker[]) => void;
  programId: string;
}

const BlockerRegister: React.FC<BlockerRegisterProps> = ({ blockers, setBlockers, programId }) => {
  const [isAddingBlocker, setIsAddingBlocker] = useState(false);
  const [newBlocker, setNewBlocker] = useState<Partial<Blocker>>({});

  const handleAddBlocker = () => {
    if (!newBlocker.title || !newBlocker.startDate) return;

    const blocker: Blocker = {
      id: Date.now().toString(),
      programId,
      title: newBlocker.title,
      description: newBlocker.description || '',
      impact: newBlocker.impact || 'Medium',
      startDate: newBlocker.startDate,
      isProjectOnHold: newBlocker.isProjectOnHold || false,
      projectHoldDate: newBlocker.isProjectOnHold ? newBlocker.projectHoldDate : undefined,
      status: 'Active',
      resolution: '',
    };

    setBlockers([...blockers, blocker]);
    setNewBlocker({});
    setIsAddingBlocker(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Blocker Register</h2>
        <button
          onClick={() => setIsAddingBlocker(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Blocker
        </button>
      </div>

      {isAddingBlocker && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Blocker Title"
            className="w-full p-2 border rounded"
            value={newBlocker.title || ''}
            onChange={(e) => setNewBlocker({ ...newBlocker, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newBlocker.description || ''}
            onChange={(e) => setNewBlocker({ ...newBlocker, description: e.target.value })}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={newBlocker.startDate || ''}
                onChange={(e) => setNewBlocker({ ...newBlocker, startDate: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Impact Level</label>
              <select
                className="w-full p-2 border rounded"
                value={newBlocker.impact || 'Medium'}
                onChange={(e) => setNewBlocker({ ...newBlocker, impact: e.target.value as Blocker['impact'] })}
              >
                <option value="Low">Low Impact</option>
                <option value="Medium">Medium Impact</option>
                <option value="High">High Impact</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="projectHold"
                className="mr-2"
                checked={newBlocker.isProjectOnHold || false}
                onChange={(e) => setNewBlocker({ ...newBlocker, isProjectOnHold: e.target.checked })}
              />
              <label htmlFor="projectHold">Project On Hold</label>
            </div>
            {newBlocker.isProjectOnHold && (
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={newBlocker.projectHoldDate || ''}
                  onChange={(e) => setNewBlocker({ ...newBlocker, projectHoldDate: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddBlocker}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsAddingBlocker(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Blocker</th>
              <th className="p-2 text-left">Start Date</th>
              <th className="p-2 text-left">Impact</th>
              <th className="p-2 text-left">Project Status</th>
              <th className="p-2 text-left">Blocker Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blockers.map((blocker) => (
              <tr key={blocker.id} className="border-t">
                <td className="p-2">
                  <div className="font-medium">{blocker.title}</div>
                  <div className="text-sm text-gray-600">{blocker.description}</div>
                </td>
                <td className="p-2">{new Date(blocker.startDate).toLocaleDateString()}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${
                    blocker.impact === 'High'
                      ? 'bg-red-100 text-red-800'
                      : blocker.impact === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {blocker.impact}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={blocker.isProjectOnHold}
                      onChange={(e) => {
                        const updatedBlockers = blockers.map((b) =>
                          b.id === blocker.id
                            ? { 
                                ...b, 
                                isProjectOnHold: e.target.checked,
                                projectHoldDate: e.target.checked ? new Date().toISOString().split('T')[0] : undefined
                              }
                            : b
                        );
                        setBlockers(updatedBlockers);
                      }}
                    />
                    <span>On Hold</span>
                    {blocker.isProjectOnHold && blocker.projectHoldDate && (
                      <span className="text-sm text-gray-600">
                        since {new Date(blocker.projectHoldDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <select
                    className="p-1 border rounded"
                    value={blocker.status}
                    onChange={(e) => {
                      const updatedBlockers = blockers.map((b) =>
                        b.id === blocker.id
                          ? { ...b, status: e.target.value as Blocker['status'] }
                          : b
                      );
                      setBlockers(updatedBlockers);
                    }}
                  >
                    <option value="Active">Active</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      const updatedBlockers = blockers.filter((b) => b.id !== blocker.id);
                      setBlockers(updatedBlockers);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockerRegister;