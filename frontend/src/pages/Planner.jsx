import { useState, useEffect } from 'react';
import { Calendar, Clock, Wand2, BellRing, CheckCircle, Sunrise } from 'lucide-react';
import api from '../services/api';

const Planner = () => {
  const [dailyHours, setDailyHours] = useState(4);
  const [examDate, setExamDate] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [plan, setPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await api.get('/planner/history');
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/planner/generate', { 
        daily_hours: dailyHours, 
        exam_date: examDate,
        start_time: startTime
      });
      setPlan(response.data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const getMotivationalQuote = () => {
    const quotes = [
        "The secret of getting ahead is getting started. – Mark Twain",
        "It always seems impossible until it's done. – Nelson Mandela",
        "Don't let what you cannot do interfere with what you can do. – John Wooden",
        "Success is the sum of small efforts, repeated day-in and day-out. – Robert Collier"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const toggleCompletion = async (id, currentStatus) => {
    try {
      await api.put(`/planner/history/${id}`, { completed: !currentStatus });
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysPlan = history.filter(item => item.plan_date === today && item.type === 'daily');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Smart Study Planner</h2>

      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Wand2 className="text-primary" /> Generate New Plan
        </h3>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Clock size={16} /> Daily Available Hours
            </label>
            <input
              type="number"
              step="0.5" min="0.5" max="24" required
              className="w-full px-4 py-2 glass-input rounded-lg"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Sunrise size={16} /> Preferred Start Time
            </label>
            <input
              type="time"
              required
              className="w-full px-4 py-2 glass-input rounded-lg"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Calendar size={16} /> Exam Date
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 glass-input rounded-lg"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? 'Generating Advanced Timetable...' : 'Generate AI Plan'}
            </button>
          </div>
        </form>
      </div>

      {todaysPlan.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Main Timetable */}
          <div className="xl:col-span-2 glass-panel rounded-2xl overflow-hidden">
            <div className="bg-white/40 backdrop-blur-sm px-6 py-5 border-b border-white/50 flex justify-between items-center">
              <h4 className="font-bold text-lg text-gray-800">Today's Active Timetable (IST)</h4>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200 shadow-sm">{today}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium w-12">Done</th>
                    <th className="px-6 py-4 font-medium">Time Slot</th>
                    <th className="px-6 py-4 font-medium">Subject / Activity</th>
                    <th className="px-6 py-4 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {todaysPlan.map((item, idx) => {
                    const isBreak = item.subject === 'Break';
                    return (
                      <tr key={item.id || idx} className={`hover:bg-gray-50 transition-colors ${isBreak ? 'bg-orange-50/50' : ''}`}>
                        <td className="px-6 py-4">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                            checked={item.completed}
                            onChange={() => toggleCompletion(item.id, item.completed)}
                          />
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.start_time} - {item.end_time}
                        </td>
                        <td className={`px-6 py-4 ${item.completed ? 'line-through opacity-50' : ''}`}>
                          {isBreak ? (
                            <span className="inline-flex items-center gap-1.5 text-orange-600 font-medium bg-orange-100 px-2.5 py-0.5 rounded-md text-sm">
                              ☕ {item.subject}
                            </span>
                          ) : (
                            <span className="font-medium text-gray-800 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {item.subject}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {isBreak ? '15 mins' : `${item.allocated_hours} hrs`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Modules */}
          <div className="space-y-6">
            
            {/* Motivation & Alerts */}
            <div className="glass-panel rounded-2xl p-6 border border-white/60">
              <div className="flex items-center gap-2 mb-4 text-indigo-700">
                <BellRing size={20} className="animate-bounce" />
                <h4 className="font-bold">Alerts & Reminders</h4>
              </div>
              <div className="space-y-3">
                <div className="bg-white/50 p-3 rounded-xl shadow-sm flex gap-3 backdrop-blur-sm">
                  <div className="text-indigo-500 mt-0.5"><CheckCircle size={18} /></div>
                  <p className="text-sm text-gray-700">Your custom study plan is ready. Check off tasks as you complete them to track progress!</p>
                </div>
                <div className="bg-white/50 p-3 rounded-xl shadow-sm backdrop-blur-sm">
                  <p className="text-sm font-medium text-indigo-900 italic">"{getMotivationalQuote()}"</p>
                </div>
              </div>
            </div>

            {/* Weekly Target Overview */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/60">
              <div className="bg-purple-100/40 px-6 py-4 border-b border-white/50 backdrop-blur-sm">
                <h4 className="font-bold text-purple-800">Weekly Target</h4>
              </div>
              <ul className="divide-y divide-gray-100">
                {history.filter(i => i.plan_date === today && i.type === 'weekly' && i.subject !== 'Break').map((item, idx) => (
                  <li key={item.id || idx} className="px-6 py-4 flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-sm">{item.subject}</span>
                    <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-xs font-bold">{item.allocated_hours}h</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
