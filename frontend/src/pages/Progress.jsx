import { useState, useEffect } from 'react';
import api from '../services/api';

const Progress = () => {
  const [subjects, setSubjects] = useState([]);
  const [progressData, setProgressData] = useState([]);

  const fetchData = async () => {
    try {
      const [subjectsRes, progressRes] = await Promise.all([
        api.get('/subjects/'),
        api.get('/progress/')
      ]);
      setSubjects(subjectsRes.data);
      setProgressData(progressRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProgressValue = (subjectId) => {
    const p = progressData.find(p => p.subject_id === subjectId);
    return p ? p.completion_percentage : 0;
  };

  const handleUpdateProgress = async (subjectId, value) => {
    try {
      await api.post('/progress/', {
        subject_id: subjectId,
        completion_percentage: parseFloat(value)
      });
      fetchData(); // Refresh data
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Track Progress</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
        {subjects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No subjects found to track progress. Add subjects first.</p>
        ) : (
          subjects.map((subject) => {
            const currentProgress = getProgressValue(subject.id);
            return (
              <div key={subject.id} className="space-y-2 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{subject.name}</h3>
                  <span className="text-sm font-bold text-primary">{currentProgress}%</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={currentProgress}
                  onChange={(e) => handleUpdateProgress(subject.id, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${currentProgress}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Progress;
