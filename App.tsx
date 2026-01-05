
import React, { useState, useCallback, useMemo } from 'react';
import { ChecklistItem, ChecklistData } from './types';
import ProgressChart from './components/ProgressChart';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [title, setTitle] = useState('My Zen List');
  const [inputValue, setInputValue] = useState('');

  const completedCount = useMemo(() => items.filter(i => i.completed).length, [items]);
  const totalCount = items.length;

  const addItem = useCallback((text: string) => {
    if (!text.trim()) return;
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now()
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(inputValue);
    setInputValue('');
  };

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCompleted = () => {
    setItems(prev => prev.filter(item => !item.completed));
  };

  const handleExport = () => {
    const data: ChecklistData = { title, items };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as ChecklistData;
        if (data.title && Array.isArray(data.items)) {
          setTitle(data.title);
          setItems(data.items);
        } else {
          alert('Invalid file format. Please upload a valid checklist JSON.');
        }
      } catch (error) {
        alert('Error reading file. Please ensure it is a valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto pt-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <i className="fa-solid fa-check-double text-xl"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ZenCheck</h1>
          </div>
          <p className="text-slate-500 font-medium">Simplify your focus, one check at a time.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-all shadow-sm">
            <i className="fa-solid fa-file-import text-slate-400"></i>
            <span className="text-sm font-semibold text-slate-700">Import</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm"
          >
            <i className="fa-solid fa-file-export text-slate-400"></i>
            <span className="text-sm font-semibold text-slate-700">Export</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress */}
        <aside className="lg:col-span-4 flex flex-col gap-8 order-2 lg:order-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center sticky top-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Task Progress</h3>
            <ProgressChart completed={completedCount} total={totalCount} />
            <div className="mt-6 flex justify-around text-sm font-medium">
              <div className="flex flex-col">
                <span className="text-slate-400 uppercase text-[10px] tracking-widest mb-1">Total</span>
                <span className="text-xl text-slate-700">{totalCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-emerald-400 uppercase text-[10px] tracking-widest mb-1">Done</span>
                <span className="text-xl text-emerald-600 font-bold">{completedCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 uppercase text-[10px] tracking-widest mb-1">Active</span>
                <span className="text-xl text-slate-700">{totalCount - completedCount}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Main Checklist */}
        <section className="lg:col-span-8 space-y-6 order-1 lg:order-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold text-slate-900 bg-transparent border-none outline-none focus:ring-0 w-full"
              />
              {completedCount > 0 && (
                <button 
                  onClick={handleClearCompleted}
                  className="text-xs font-semibold text-rose-500 hover:text-rose-600 uppercase tracking-wider px-3 py-1 hover:bg-rose-50 rounded-lg transition-all"
                >
                  Clear Done
                </button>
              )}
            </div>

            <form onSubmit={handleManualAdd} className="mb-8 flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all text-slate-700"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white p-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all"
              >
                <i className="fa-solid fa-plus text-xl"></i>
              </button>
            </form>

            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-regular fa-clipboard text-2xl"></i>
                  </div>
                  <p className="font-medium">No tasks yet. Start by adding one above!</p>
                </div>
              ) : (
                items
                  .sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt)
                  .map((item) => (
                    <div 
                      key={item.id}
                      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                        item.completed 
                        ? 'bg-slate-50/50 border-slate-100 grayscale opacity-60' 
                        : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100'
                      }`}
                    >
                      <button 
                        onClick={() => handleToggle(item.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                          item.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'border-slate-300 hover:border-indigo-500 group-hover:scale-110'
                        }`}
                      >
                        {item.completed && <i className="fa-solid fa-check text-[10px]"></i>}
                      </button>
                      <span className={`flex-1 font-medium transition-all ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50"
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs gap-4">
        <p>&copy; 2026 ZenCheck Checklist App by Khabir The Goat. Privacy-first: Your data never leaves this tab.</p>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-lock text-emerald-400"></i>
            Local Only
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-shield-halved text-indigo-400"></i>
            Privacy Focused
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
