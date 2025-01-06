// src/components/AIAssistant.tsx
import React, { useState, useCallback } from 'react';
import { Program, Task, Risk } from '../types';
import { generateAIResponse } from '../services/openai';

interface AIAssistantProps {
  program: Program;
  tasks: Task[];
  risks: Risk[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ program, tasks, risks }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateProgramData = useCallback(() => {
    return {
      name: program.name,
      description: program.description,
      status: program.status,
      startDate: program.startDate,
      endDate: program.endDate,
      budget: program.budget,
      tasks: tasks.map(task => ({
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee
      })),
      risks: risks.map(risk => ({
        title: risk.title,
        impact: risk.impact,
        probability: risk.probability,
        status: risk.status,
        mitigationPlan: risk.mitigationPlan
      }))
    };
  }, [program, tasks, risks]);

  const generatePrompt = useCallback((type: 'status' | 'risks' | 'timeline' | 'custom') => {
    const programData = generateProgramData();

    const prompts = {
      status: `Please generate a comprehensive status report for the program "${program.name}". Include:
1. Overall program health
2. Key milestones and their status
3. Task completion metrics
4. Major blockers or concerns
5. Recommendations for improvement

Program Data:
${JSON.stringify(programData, null, 2)}`,

      risks: `Analyze the risks for the program "${program.name}" and provide:
1. Risk assessment summary
2. Top 3 critical risks that need immediate attention
3. Effectiveness of current mitigation plans
4. Recommendations for additional risk mitigation
5. Potential upcoming risks based on the program status

Risk Data:
${JSON.stringify(programData.risks, null, 2)}`,

      timeline: `Review the program timeline for "${program.name}" and provide:
1. Timeline health assessment
2. Key dates and milestones
3. Potential schedule risks
4. Recovery recommendations for delayed items
5. Resource allocation suggestions

Timeline Data:
${JSON.stringify({ 
  startDate: program.startDate, 
  endDate: program.endDate, 
  tasks: programData.tasks 
}, null, 2)}`,

      custom: prompt
    };

    return prompts[type];
  }, [program.name, generateProgramData, prompt]);

  const handleSubmit = async (type: 'status' | 'risks' | 'timeline' | 'custom') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { response: aiResponse, error: aiError } = await generateAIResponse(generatePrompt(type));
      
      if (aiError) {
        setError(aiError);
      } else {
        setResponse(aiResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">AI Program Assistant</h2>
      
      <div className="space-y-4">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSubmit('status')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Generate Status Report
          </button>
          <button
            onClick={() => handleSubmit('risks')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Analyze Risks
          </button>
          <button
            onClick={() => handleSubmit('timeline')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Review Timeline
          </button>
        </div>

        {/* Custom Query Section */}
        <div className="space-y-2">
          <textarea
            placeholder="Ask anything about your program (e.g., 'What are the top priorities for next week?' or 'How can we improve task completion rates?')"
            className="w-full p-2 border rounded h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={() => handleSubmit('custom')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading || !prompt.trim()}
          >
            Send Query
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center text-gray-600 py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
            Analyzing program data...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* AI Response */}
        {response && !isLoading && (
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-2">Analysis & Recommendations:</h3>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-700">
                {response}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;