import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Book, Clock, Target, Award, Bell, Lightbulb, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/');
        setData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );
  
  if (!data) return (
    <div className="glass-panel rounded-2xl p-8 text-center text-gray-600">
      <h3 className="text-xl font-bold mb-2">No Data Available</h3>
      <p>Please add some subjects and generate a study plan to start tracking your progress!</p>
    </div>
  );

  const { stats, subject_progress, study_hours } = data;

  const summaryCards = [
    { title: 'Total Study Hours', value: stats.total_study_hours, icon: <Clock className="text-blue-600" size={24} />, bg: 'bg-blue-100/50' },
    { title: 'Subjects Added', value: stats.subjects_added, icon: <Book className="text-purple-600" size={24} />, bg: 'bg-purple-100/50' },
    { title: 'Completion Rate', value: `${stats.completion_percentage}%`, icon: <Target className="text-green-600" size={24} />, bg: 'bg-green-100/50' },
    { title: 'Consistency Score', value: stats.consistency_score, icon: <Award className="text-orange-600" size={24} />, bg: 'bg-orange-100/50' },
  ];

  // Data for the Donut Chart
  const taskData = [
    { name: 'Completed', value: stats.completed_tasks, color: '#10b981' },
    { name: 'Missed', value: stats.missed_schedules, color: '#ef4444' },
    { name: 'Pending', value: stats.pending_tasks, color: '#f59e0b' },
  ];
  
  const hasTaskData = stats.completed_tasks > 0 || stats.missed_schedules > 0 || stats.pending_tasks > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Dashboard Overview
        </h2>
      </div>

      {/* Notifications & Reminders Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="bg-white/60 shadow-sm p-3 rounded-full text-blue-600 backdrop-blur-md">
            <Bell size={24} className="animate-pulse" />
          </div>
          <div className="z-10">
            <h4 className="font-bold text-gray-800 text-lg">Pending Tasks & Alerts</h4>
            {stats.missed_schedules > 0 ? (
               <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5 font-medium">
                 <AlertTriangle size={16} /> You have {stats.missed_schedules} missed study session(s). Try to catch up!
               </p>
            ) : null}
            <p className="text-sm text-gray-600 mt-2">
              You have <span className="font-bold text-indigo-600">{stats.pending_tasks}</span> upcoming tasks scheduled. 
              <br/>Head over to the Planner to view your active timetable.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex gap-4 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="bg-white/60 shadow-sm p-3 rounded-full text-amber-500 backdrop-blur-md">
            <Lightbulb size={24} />
          </div>
          <div className="z-10">
            <h4 className="font-bold text-gray-800 text-lg">Daily Motivation</h4>
            <p className="text-sm text-gray-600 mt-2 italic leading-relaxed">
              "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing or learning to do."
            </p>
          </div>
        </div>
      </div>
      
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden">
            <div className={`p-4 rounded-xl shadow-inner ${card.bg} backdrop-blur-md`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{card.title}</p>
              <h3 className="text-3xl font-black text-gray-800 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Task Completion Donut Chart */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Task Tracking Status</h3>
          <p className="text-sm text-gray-500 mb-6">Overview of your study blocks</p>
          <div className="flex-1 min-h-[250px] relative">
            {!hasTaskData ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                No tasks generated yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Study Hours Trend */}
        <div className="glass-panel rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Study Hours Trend</h3>
          <p className="text-sm text-gray-500 mb-6">Total hours allocated per day</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={study_hours} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }} 
                  activeDot={{ r: 8, fill: '#6366f1' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
