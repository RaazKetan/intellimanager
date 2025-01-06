import React, { useState } from 'react';
import { Risk } from '../types/index';

interface RiskRegisterProps {
  risks: Risk[];
  setRisks: (risks: Risk[]) => void;
  programId: string;
}

const RiskRegister: React.FC<RiskRegisterProps> = ({ risks, setRisks, programId }) => {
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({});

  const handleAddRisk = () => {
    if (!newRisk.title) return;

    const risk: Risk = {
      id: Date.now().toString(),
      programId,
      title: newRisk.title,
      description: newRisk.description || '',
      impact: newRisk.impact || 'Medium',
      probability: newRisk.probability || 'Medium',
      mitigationPlan: newRisk.mitigationPlan || '',
      status: 'Open',
    };

    setRisks([...risks, risk]);
    setNewRisk({});
    setIsAddingRisk(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Risk Register</h2>
        <button
          onClick={() => setIsAddingRisk(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Risk
        </button>
      </div>

      {isAddingRisk && (
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Risk Title"
            className="w-full p-2 border rounded"
            value={newRisk.title || ''}
            onChange={(e) => setNewRisk({ ...newRisk, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 border rounded"
            value={newRisk.description || ''}
            onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
          />
          <select
            className="w-full p-2 border rounded"
            value={newRisk.impact || 'Medium'}
            onChange={(e) => setNewRisk({ ...newRisk, impact: e.target.value as Risk['impact'] })}
          >
            <option value="Low">Low Impact</option>
            <option value="Medium">Medium Impact</option>
            <option value="High">High Impact</option>
          </select>
          <select
            className="w-full p-2 border rounded"
            value={newRisk.probability || 'Medium'}
            onChange={(e) => setNewRisk({ ...newRisk, probability: e.target.value as Risk['probability'] })}
          >
            <option value="Low">Low Probability</option>
            <option value="Medium">Medium Probability</option>
            <option value="High">High Probability</option>
          </select>
          <textarea
            placeholder="Mitigation Plan"
            className="w-full p-2 border rounded"
            value={newRisk.mitigationPlan || ''}
            onChange={(e) => setNewRisk({ ...newRisk, mitigationPlan: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddRisk}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsAddingRisk(false)}
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
              <th className="p-2 text-left">Risk</th>
              <th className="p-2 text-left">Impact</th>
              <th className="p-2 text-left">Probability</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk) => (
              <tr key={risk.id} className="border-t">
                <td className="p-2">
                  <div className="font-medium">{risk.title}</div>
                  <div className="text-sm text-gray-600">{risk.description}</div>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${
                    risk.impact === 'High'
                      ? 'bg-red-100 text-red-800'
                      : risk.impact === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {risk.impact}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded ${
                    risk.probability === 'High'
                      ? 'bg-red-100 text-red-800'
                      : risk.probability === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {risk.probability}
                  </span>
                </td>
                <td className="p-2">
                  <select
                    className="p-1 border rounded"
                    value={risk.status}
                    onChange={(e) => {
                      const updatedRisks = risks.map((r) =>
                        r.id === risk.id
                          ? { ...r, status: e.target.value as Risk['status'] }
                          : r
                      );
                      setRisks(updatedRisks);
                    }}
                  >
                    <option value="Open">Open</option>
                    <option value="Mitigated">Mitigated</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      const updatedRisks = risks.filter((r) => r.id !== risk.id);
                      setRisks(updatedRisks);
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

export default RiskRegister;