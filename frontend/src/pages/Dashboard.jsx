import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data.user || res.data);
    } catch (err) { console.error(err); }
  };

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProfile(); loadTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await api.post("/tasks", { title });
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) { console.error(err); }
  };

  const removeTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const toggleComplete = async (task) => {
    try {
      const res = await api.put(`/tasks/${task._id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) { console.error(err); }
  };

  const filteredTasks = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
      {/* SIDEBAR - Desktop lo matrame kanipisthundi (Responsive) */}
      <aside className="hidden lg:flex w-72 bg-white flex-col border-r border-gray-200 p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-[#5D5CFF] rounded-lg flex items-center justify-center text-white font-bold">B</div>
          <h1 className="text-xl font-bold tracking-tight">BetterTasks</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Main Menu</p>
          <div className="bg-[#F3F4F6] text-[#5D5CFF] p-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer">
            <span>📋</span> To-do
          </div>
          
        </nav>

      

        {/* USER PROFILE TAB */}
        <div className="mt-10 flex items-center gap-3 p-2 border-t pt-6 border-gray-100">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold border border-white">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{profile?.name || "User"}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="ml-auto text-gray-400 hover:text-red-500 text-xs">Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* HEADER SECTION */}
        <header className="bg-white p-8 rounded-[2rem] shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Good Morning, {profile?.name?.split(' ')[0] || "Friend"}!</h2>
            <p className="text-gray-400 text-sm mt-1">What do you plan to do today?</p>
          </div>
          <div className="mt-4 md:mt-0 flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200`} />)}
          </div>
        </header>

        {/* TASK SECTION */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h3 className="text-xl font-bold">Today Task</h3>
            <div className="flex gap-2 w-full md:w-auto">
               <input 
                className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 ring-indigo-100 w-full"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="p-8">
            {/* ADD TASK INPUT */}
            <div className="flex gap-3 mb-10 group">
              <input
                className="flex-1 bg-gray-50 border-2 border-transparent focus:border-[#5D5CFF]/20 focus:bg-white p-4 rounded-2xl outline-none transition-all"
                placeholder="Add a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                onClick={addTask}
                className="bg-[#5D5CFF] text-white px-8 rounded-2xl font-bold hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all"
              >
                +
              </button>
            </div>

            {/* TASK LIST */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((t) => (
                  <motion.div
                    key={t._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        onClick={() => toggleComplete(t)}
                        className={`w-6 h-6 rounded-lg cursor-pointer flex items-center justify-center transition-all border-2 ${
                          t.completed ? "bg-[#5D5CFF] border-[#5D5CFF]" : "border-gray-200 hover:border-indigo-400"
                        }`}
                      >
                        {t.completed && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                      <span className={`font-medium ${t.completed ? "text-gray-300 line-through" : "text-gray-700"}`}>
                        {t.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="hidden md:block px-3 py-1 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">Medium</span>
                      <button 
                        onClick={() => removeTask(t._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && <p className="text-center py-10 text-gray-400 animate-pulse">Fetching your tasks...</p>}
              {!loading && filteredTasks.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 italic font-medium">No tasks found. Start by adding one!</p>
                </div>
              )}
            </div>
            
            {/* FINISH BUTTON */}
            <div className="mt-10 flex gap-4">
              <button className="bg-[#5D5CFF] text-white px-8 py-3 rounded-xl font-bold text-sm">Finish</button>
              <button className="text-gray-400 font-bold text-sm">+ Add Task</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}