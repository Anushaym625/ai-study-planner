import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../services/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', priority: 1, difficulty: 1 });
  const [editingId, setEditingId] = useState(null);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects/');
      setSubjects(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/subjects/${editingId}`, formData);
      } else {
        await api.post('/subjects/', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', priority: 1, difficulty: 1 });
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/subjects/${id}`);
        fetchSubjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (subject) => {
    setFormData({ name: subject.name, priority: subject.priority, difficulty: subject.difficulty });
    setEditingId(subject.id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Subjects Management</h2>
        <button
          onClick={() => { setIsModalOpen(true); setEditingId(null); setFormData({ name: '', priority: 1, difficulty: 1 }); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-full hover:scale-105 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 border-b border-white/50 backdrop-blur-sm">
              <th className="px-6 py-4 font-medium text-gray-600">Subject Name</th>
              <th className="px-6 py-4 font-medium text-gray-600">Priority (1-5)</th>
              <th className="px-6 py-4 font-medium text-gray-600">Difficulty (1-5)</th>
              <th className="px-6 py-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No subjects added yet.</td>
              </tr>
            ) : (
              subjects.map((subject) => (
                <tr key={subject.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{subject.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium">{subject.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 rounded bg-orange-100 text-orange-800 text-sm font-medium">{subject.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button onClick={() => handleEdit(subject)} className="text-gray-400 hover:text-primary transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(subject.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel rounded-3xl w-full max-w-md p-8 border border-white/60">
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">{editingId ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 glass-input rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority (1-5)</label>
                <input
                  type="number"
                  min="1" max="5" required
                  className="w-full px-4 py-3 glass-input rounded-xl"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty (1-5)</label>
                <input
                  type="number"
                  min="1" max="5" required
                  className="w-full px-4 py-3 glass-input rounded-xl"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 bg-white/50 hover:bg-white/80 rounded-full transition-all font-medium backdrop-blur-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:scale-105 shadow-md transition-all font-medium"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
