import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, Plus, Trash2, Edit2, Check, X, 
  Sparkles, CheckCircle2, ListTodo, MoreVertical, 
  FolderHeart, Star
} from 'lucide-react';
import { toast } from 'sonner';

const COLOR_THEMES = {
  indigo: {
    name: 'indigo',
    card: 'bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    progress: 'bg-indigo-500',
    dot: 'bg-indigo-500',
    checkbox: 'border-indigo-500/30 text-indigo-500 focus:ring-indigo-500/50',
    accentText: 'text-indigo-400'
  },
  emerald: {
    name: 'emerald',
    card: 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    progress: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    checkbox: 'border-emerald-500/30 text-emerald-500 focus:ring-emerald-500/50',
    accentText: 'text-emerald-400'
  },
  rose: {
    name: 'rose',
    card: 'bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    progress: 'bg-rose-500',
    dot: 'bg-rose-500',
    checkbox: 'border-rose-500/30 text-rose-500 focus:ring-rose-500/50',
    accentText: 'text-rose-400'
  },
  amber: {
    name: 'amber',
    card: 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    progress: 'bg-amber-500',
    dot: 'bg-amber-500',
    checkbox: 'border-amber-500/30 text-amber-500 focus:ring-amber-500/50',
    accentText: 'text-amber-400'
  },
  purple: {
    name: 'purple',
    card: 'bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    progress: 'bg-purple-500',
    dot: 'bg-purple-500',
    checkbox: 'border-purple-500/30 text-purple-500 focus:ring-purple-500/50',
    accentText: 'text-purple-400'
  },
  sky: {
    name: 'sky',
    card: 'bg-sky-500/5 hover:bg-sky-500/10 border-sky-500/20 hover:border-sky-500/40',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    progress: 'bg-sky-500',
    dot: 'bg-sky-500',
    checkbox: 'border-sky-500/30 text-sky-500 focus:ring-sky-500/50',
    accentText: 'text-sky-400'
  }
};

const SAMPLE_LISTS = [
  {
    id: 'sample-1',
    title: '🛒 Lista de Compras',
    color: 'emerald',
    items: [
      { id: 'item-1-1', text: 'Frutas y Verduras frescas', completed: false },
      { id: 'item-1-2', text: 'Leche de Almendras', completed: true },
      { id: 'item-1-3', text: 'Café de grano premium', completed: false },
      { id: 'item-1-4', text: 'Pan integral', completed: true },
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: '🚀 Ideas de Negocios',
    color: 'indigo',
    items: [
      { id: 'item-2-1', text: 'MVP de aplicación de cobro automático', completed: false },
      { id: 'item-2-2', text: 'Landing page para consultoría', completed: false },
      { id: 'item-2-3', text: 'Validar prototipo con clientes reales', completed: true },
    ],
    createdAt: new Date().toISOString()
  }
];

const CheckListPage = () => {
  const [checklists, setChecklists] = useState([]);
  
  // States for Checklist creation inline
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');
  
  // State for Editing list title inline
  const [editingListId, setEditingListId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // States for new items inside cards
  const [newItemTexts, setNewItemTexts] = useState({}); // { listId: string }

  const createInputRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('horizon_checklists');
    if (stored) {
      try {
        setChecklists(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored checklists', e);
        setChecklists(SAMPLE_LISTS);
      }
    } else {
      setChecklists(SAMPLE_LISTS);
      localStorage.setItem('horizon_checklists', JSON.stringify(SAMPLE_LISTS));
    }
  }, []);

  // Save checklists helper
  const saveChecklists = (updated) => {
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
  };

  // Focus helper for creation card
  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreating]);

  // Create new checklist card
  const handleCreateChecklist = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('El título no puede estar vacío');
      return;
    }
    const newList = {
      id: `checklist-${Date.now()}`,
      title: newTitle.trim(),
      color: selectedColor,
      items: [],
      createdAt: new Date().toISOString()
    };
    saveChecklists([newList, ...checklists]);
    setNewTitle('');
    setIsCreating(false);
    toast.success('¡Nueva lista creada!');
  };

  // Delete checklist card
  const handleDeleteChecklist = (id, title) => {
    if (window.confirm(`¿Estás seguro de eliminar la lista "${title}"?`)) {
      const updated = checklists.filter(list => list.id !== id);
      saveChecklists(updated);
      toast.success('Lista eliminada');
    }
  };

  // Rename checklist card
  const handleStartRename = (id, currentTitle) => {
    setEditingListId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = (id) => {
    if (!editingTitle.trim()) {
      toast.error('El título no puede estar vacío');
      return;
    }
    const updated = checklists.map(list => {
      if (list.id === id) {
        return { ...list, title: editingTitle.trim() };
      }
      return list;
    });
    saveChecklists(updated);
    setEditingListId(null);
    toast.success('Título actualizado');
  };

  // Toggle item complete status
  const handleToggleItem = (listId, itemId) => {
    const updated = checklists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        return { ...list, items: updatedItems };
      }
      return list;
    });
    saveChecklists(updated);
  };

  // Delete item from checklist
  const handleDeleteItem = (listId, itemId) => {
    const updated = checklists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.filter(item => item.id !== itemId);
        return { ...list, items: updatedItems };
      }
      return list;
    });
    saveChecklists(updated);
  };

  // Add item inline inside card
  const handleAddItem = (e, listId) => {
    e.preventDefault();
    const itemText = newItemTexts[listId] || '';
    if (!itemText.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: itemText.trim(),
      completed: false
    };

    const updated = checklists.map(list => {
      if (list.id === listId) {
        return { ...list, items: [...list.items, newItem] };
      }
      return list;
    });

    saveChecklists(updated);
    setNewItemTexts({
      ...newItemTexts,
      [listId]: ''
    });
  };

  // Total stats for the top header widgets
  const stats = checklists.reduce((acc, curr) => {
    const totalItems = curr.items.length;
    const completedItems = curr.items.filter(i => i.completed).length;
    return {
      totalLists: acc.totalLists + 1,
      totalItems: acc.totalItems + totalItems,
      completedItems: acc.completedItems + completedItems
    };
  }, { totalLists: 0, totalItems: 0, completedItems: 0 });

  return (
    <>
      <Helmet>
        <title>Check List - Gestor de Tareas</title>
        <meta name="description" content="Gestiona tus listas de tareas rápidas de forma simple y visual." />
      </Helmet>

      <div className="min-h-screen bg-background pb-24 lg:pb-6">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">Check List</h1>
                <p className="text-[12px] text-muted-foreground hidden sm:block">
                  Crea listas de tareas rápidas y hazles seguimiento.
                </p>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
              <div className="bg-card border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-emerald-400" />
                <span className="text-[12px] font-semibold text-foreground">
                  {stats.totalLists} {stats.totalLists === 1 ? 'Lista' : 'Listas'}
                </span>
              </div>
              <div className="bg-card border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-[12px] font-semibold text-foreground">
                  {stats.completedItems}/{stats.totalItems} Hechos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <main className="max-w-[1600px] mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* 1. Trello-style Inline List Creation Card */}
            <AnimatePresence mode="wait">
              {!isCreating ? (
                <motion.button
                  key="new-button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => setIsCreating(true)}
                  className="flex flex-col items-center justify-center min-h-[220px] p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card/25 hover:bg-primary/5 transition-all duration-300 group cursor-pointer text-center relative overflow-hidden"
                >
                  <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 text-muted-foreground group-hover:text-primary transition-all duration-300 mb-3 shadow-inner">
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="font-heading font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors duration-300">
                    Nueva Lista
                  </h3>
                  <p className="text-[12px] text-muted-foreground mt-1 max-w-[200px]">
                    Crea una lista de compras, ideas, lecturas o pendientes
                  </p>
                </motion.button>
              ) : (
                <motion.div
                  key="new-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col min-h-[220px] p-5 rounded-2xl border border-primary/25 bg-card shadow-lg ring-1 ring-primary/5"
                >
                  <form onSubmit={handleCreateChecklist} className="flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Crear Lista
                        </span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setIsCreating(false)} 
                          className="h-6 w-6 rounded-full text-muted-foreground"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <input
                        ref={createInputRef}
                        type="text"
                        placeholder="Título de la lista..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-muted/50 border border-border focus:border-primary/50 rounded-xl px-3.5 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        maxLength={40}
                      />

                      {/* Color Theme Selector */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Tema de Color</span>
                        <div className="flex items-center gap-2">
                          {Object.keys(COLOR_THEMES).map((colorName) => {
                            const theme = COLOR_THEMES[colorName];
                            const isSelected = selectedColor === colorName;
                            return (
                              <button
                                key={colorName}
                                type="button"
                                onClick={() => setSelectedColor(colorName)}
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${theme.dot} hover:scale-110 shadow-sm relative`}
                              >
                                {isSelected && (
                                  <span className="absolute inset-0 rounded-full border-2 border-background scale-75 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button 
                        type="submit" 
                        className="flex-1 text-[12px] font-semibold h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Añadir Lista
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsCreating(false)} 
                        className="text-[12px] font-semibold h-9 rounded-xl border-border bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Checklist Cards (Trello style) */}
            <AnimatePresence>
              {checklists.map((list) => {
                const theme = COLOR_THEMES[list.color] || COLOR_THEMES.indigo;
                const totalItems = list.items.length;
                const completedItems = list.items.filter(i => i.completed).length;
                const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

                const isEditingThis = editingListId === list.id;

                return (
                  <motion.div
                    key={list.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col justify-between min-h-[300px] max-h-[480px] p-5 rounded-2xl border bg-card shadow-sm transition-all duration-300 relative group/card ${theme.card}`}
                  >
                    {/* Card Header */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1 w-full mr-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="flex-1 bg-muted border border-border focus:border-primary rounded-lg px-2 py-1 text-[13px] font-semibold outline-none"
                              maxLength={40}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(list.id);
                                if (e.key === 'Escape') setEditingListId(null);
                              }}
                            />
                            <Button 
                              size="icon" 
                              onClick={() => handleSaveRename(list.id)} 
                              className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shrink-0"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              onClick={() => setEditingListId(null)} 
                              className="h-7 w-7 rounded-lg shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex-1 min-w-0">
                            <h2 
                              onDoubleClick={() => handleStartRename(list.id, list.title)}
                              className="font-heading font-bold text-[15px] text-foreground tracking-tight line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                              title="Doble clic para renombrar"
                            >
                              {list.title}
                            </h2>
                          </div>
                        )}

                        {/* Options button */}
                        {!isEditingThis && (
                          <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover/card:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartRename(list.id, list.title)}
                              className="h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Renombrar lista"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteChecklist(list.id, list.title)}
                              className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-400"
                              title="Eliminar lista"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                          <span>Progreso</span>
                          <span className={`${theme.accentText}`}>
                            {completedItems}/{totalItems} ({progressPct}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden border border-border/50">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${theme.progress}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Scrollable Items Container */}
                    <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-1.5 scrollbar-thin">
                      {list.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/50">
                          <ListTodo className="w-8 h-8 stroke-[1.5] mb-2 opacity-30" />
                          <p className="text-[11px] font-medium max-w-[160px]">
                            No hay elementos. ¡Añade el primero abajo!
                          </p>
                        </div>
                      ) : (
                        list.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between group/item p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div 
                              onClick={() => handleToggleItem(list.id, item.id)}
                              className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                readOnly
                                className={`mt-0.5 w-4 h-4 rounded-md border bg-transparent shrink-0 focus:ring-0 ${theme.checkbox} transition-all`}
                              />
                              <span className={`text-[13px] leading-tight transition-all truncate ${
                                item.completed 
                                  ? 'line-through text-muted-foreground/60 font-medium' 
                                  : 'text-foreground font-medium'
                              }`}>
                                {item.text}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteItem(list.id, item.id)}
                              className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-muted-foreground hover:text-rose-400 shrink-0 ml-1.5"
                              title="Quitar elemento"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add Item Input Form */}
                    <form 
                      onSubmit={(e) => handleAddItem(e, list.id)}
                      className="flex items-center gap-1.5 pt-2 border-t border-border/50 shrink-0"
                    >
                      <input
                        type="text"
                        placeholder="+ Añadir elemento..."
                        value={newItemTexts[list.id] || ''}
                        onChange={(e) => setNewItemTexts({
                          ...newItemTexts,
                          [list.id]: e.target.value
                        })}
                        className="flex-1 bg-muted/40 border border-border/60 focus:border-primary/40 rounded-xl px-3 py-1.5 text-[12px] text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:bg-muted/80 focus:ring-1 focus:ring-primary/10"
                      />
                      {(newItemTexts[list.id] || '').trim() && (
                        <Button 
                          type="submit" 
                          size="icon" 
                          className={`h-7 w-7 rounded-lg shadow-sm shrink-0 bg-primary hover:bg-primary/95 text-primary-foreground`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </form>
                  </motion.div>
                );
              })}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </>
  );
};

export default CheckListPage;
