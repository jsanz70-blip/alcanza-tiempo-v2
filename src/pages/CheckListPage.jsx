import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, Plus, Trash2, Edit2, Check, X, 
  Sparkles, CheckCircle2, ListTodo, ArrowRightToLine, GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import supabase from '@/lib/supabaseClient';
import { useRealtimeSync } from '@/hooks/useRealtimeSync.js';

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
  const [loading, setLoading] = useState(true);
  
  // States for Checklist creation inline
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');
  
  // State for Editing list title inline
  const [editingListId, setEditingListId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // States for new items inside cards
  const [newItemTexts, setNewItemTexts] = useState({});

  // States for editing item inline
  const [editingItem, setEditingItem] = useState(null); // { listId, itemId }
  const [editingItemText, setEditingItemText] = useState('');

  // States for drag & drop between checklists
  const [draggedItem, setDraggedItem] = useState(null); // { listId, item }
  const [dragOverListId, setDragOverListId] = useState(null);

  const createInputRef = useRef(null);

  // Cargar datos de Supabase
  const fetchChecklists = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .order('created_at');
      
      if (error) throw error;

      if (data && data.length > 0) {
        // Transformar datos de Supabase al formato local
        const transformed = data.map(row => ({
          id: row.id,
          title: row.title,
          color: row.color || 'indigo',
          items: Array.isArray(row.items) ? row.items : [],
          createdAt: row.created_at
        }));
        setChecklists(transformed);
        
        // También guardar en localStorage para compatibilidad
        localStorage.setItem('horizon_checklists', JSON.stringify(transformed));
      } else {
        // No hay datos en Supabase - intentar migrar desde localStorage
        const stored = localStorage.getItem('horizon_checklists');
        if (stored) {
          try {
            const localData = JSON.parse(stored);
            if (localData.length > 0) {
              setChecklists(localData);
              // Migrar a Supabase en background
              migrateToSupabase(localData);
            } else {
              setChecklists(SAMPLE_LISTS);
            }
          } catch (e) {
            console.error('Error parsing local checklists', e);
            setChecklists(SAMPLE_LISTS);
          }
        } else {
          // Sin datos en ningun lado - mostrar ejemplos
          setChecklists(SAMPLE_LISTS);
          localStorage.setItem('horizon_checklists', JSON.stringify(SAMPLE_LISTS));
          // Migrar ejemplos a Supabase
          migrateToSupabase(SAMPLE_LISTS);
        }
      }
    } catch (error) {
      console.error('Error fetching checklists:', error);
      // Fallback a localStorage
      const stored = localStorage.getItem('horizon_checklists');
      if (stored) {
        try {
          setChecklists(JSON.parse(stored));
        } catch (e) {
          setChecklists(SAMPLE_LISTS);
        }
      } else {
        setChecklists(SAMPLE_LISTS);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Migrar datos locales a Supabase
  const migrateToSupabase = async (localData) => {
    for (const list of localData) {
      try {
        const { error } = await supabase
          .from('checklists')
          .insert({
            title: list.title,
            color: list.color || 'indigo',
            items: list.items || []
          });
        if (error) console.error('Error migrating checklist:', error);
      } catch (e) {
        console.error('Error migrating checklist:', e);
      }
    }
    console.log(`[CheckList] Migrados ${localData.length} checklists a Supabase`);
  };

  // Polling cada 5s para sincronización entre dispositivos
  useEffect(() => {
    fetchChecklists();
    const interval = setInterval(fetchChecklists, 5000);
    return () => clearInterval(interval);
  }, [fetchChecklists]);

  // Realtime sync - cuando otro dispositivo hace un cambio
  useRealtimeSync(['checklists'], useCallback((event) => {
    console.log('[CheckList] Realtime change detected:', event.eventType);
    fetchChecklists();
  }, [fetchChecklists]));

  // Focus helper for creation card
  useEffect(() => {
    if (isCreating && createInputRef.current) {
      createInputRef.current.focus();
    }
  }, [isCreating]);

  // Create new checklist card
  const handleCreateChecklist = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('El título no puede estar vacío');
      return;
    }
    
    // Optimistic UI update
    const tempId = `checklist-${Date.now()}`;
    const newList = {
      id: tempId,
      title: newTitle.trim(),
      color: selectedColor,
      items: [],
      createdAt: new Date().toISOString()
    };
    
    // Actualizar UI inmediatamente
    const updatedLists = [newList, ...checklists];
    setChecklists(updatedLists);
    localStorage.setItem('horizon_checklists', JSON.stringify(updatedLists));
    
    setNewTitle('');
    setIsCreating(false);
    
    // Guardar en Supabase
    try {
      const { data, error } = await supabase
        .from('checklists')
        .insert({
          title: newList.title,
          color: newList.color,
          items: []
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Reemplazar tempId con el ID real de Supabase
        const finalLists = updatedLists.map(list => 
          list.id === tempId 
            ? { ...list, id: data[0].id, createdAt: data[0].created_at }
            : list
        );
        setChecklists(finalLists);
        localStorage.setItem('horizon_checklists', JSON.stringify(finalLists));
      }
      
      toast.success('¡Nueva lista creada!');
    } catch (error) {
      console.error('Error creating checklist:', error);
      toast.error('Error al crear lista en la nube');
    }
  };

  // Delete checklist card
  const handleDeleteChecklist = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar la lista "${title}"?`)) return;
    
    // Optimistic UI update
    const updated = checklists.filter(list => list.id !== id);
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    toast.success('Lista eliminada');
    
    // Eliminar de Supabase
    try {
      const { error } = await supabase
        .from('checklists')
        .delete()
        .eq('id', id);
      if (error) console.error('Error deleting checklist:', error);
    } catch (e) {
      console.error('Error deleting checklist:', e);
    }
  };

  // Rename checklist card
  const handleStartRename = (id, currentTitle) => {
    setEditingListId(id);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (id) => {
    if (!editingTitle.trim()) {
      toast.error('El título no puede estar vacío');
      return;
    }
    
    // Optimistic UI update
    const updated = checklists.map(list => {
      if (list.id === id) {
        return { ...list, title: editingTitle.trim() };
      }
      return list;
    });
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    setEditingListId(null);
    
    // Guardar en Supabase
    try {
      const { error } = await supabase
        .from('checklists')
        .update({ title: editingTitle.trim() })
        .eq('id', id);
      if (error) throw error;
      toast.success('Título actualizado');
    } catch (error) {
      console.error('Error renaming checklist:', error);
    }
  };

  // Toggle item complete status
  const handleToggleItem = async (listId, itemId) => {
    // Optimistic UI update
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
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    
    // Guardar en Supabase
    try {
      const list = updated.find(l => l.id === listId);
      if (list) {
        const { error } = await supabase
          .from('checklists')
          .update({ items: list.items })
          .eq('id', listId);
        if (error) console.error('Error toggling item:', error);
      }
    } catch (e) {
      console.error('Error toggling item:', e);
    }
  };

  // Delete item from checklist
  const handleDeleteItem = async (listId, itemId) => {
    // Optimistic UI update
    const updated = checklists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.filter(item => item.id !== itemId);
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    
    // Guardar en Supabase
    try {
      const list = updated.find(l => l.id === listId);
      if (list) {
        const { error } = await supabase
          .from('checklists')
          .update({ items: list.items })
          .eq('id', listId);
        if (error) console.error('Error deleting item:', error);
      }
    } catch (e) {
      console.error('Error deleting item:', e);
    }
  };

  // Add item inline inside card
  const handleAddItem = async (e, listId) => {
    e.preventDefault();
    const itemText = newItemTexts[listId] || '';
    if (!itemText.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      text: itemText.trim(),
      completed: false
    };

    // Optimistic UI update
    const updated = checklists.map(list => {
      if (list.id === listId) {
        return { ...list, items: [...list.items, newItem] };
      }
      return list;
    });

    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    setNewItemTexts({ ...newItemTexts, [listId]: '' });

    // Guardar en Supabase
    try {
      const list = updated.find(l => l.id === listId);
      if (list) {
        const { error } = await supabase
          .from('checklists')
          .update({ items: list.items })
          .eq('id', listId);
        if (error) console.error('Error adding item:', error);
      }
    } catch (e) {
      console.error('Error adding item:', e);
    }
  };

  // Edit item inline - start editing
  const handleStartEditItem = (listId, itemId, currentText) => {
    setEditingItem({ listId, itemId });
    setEditingItemText(currentText);
  };

  // Edit item inline - save
  const handleSaveEditItem = async () => {
    if (!editingItem) return;
    const { listId, itemId } = editingItem;
    if (!editingItemText.trim()) {
      toast.error('El texto no puede estar vacío');
      return;
    }

    const updated = checklists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item => {
          if (item.id === itemId) {
            return { ...item, text: editingItemText.trim() };
          }
          return item;
        });
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    setEditingItem(null);
    setEditingItemText('');

    // Guardar en Supabase
    try {
      const list = updated.find(l => l.id === listId);
      if (list) {
        const { error } = await supabase
          .from('checklists')
          .update({ items: list.items })
          .eq('id', listId);
        if (error) console.error('Error editing item:', error);
      }
    } catch (e) {
      console.error('Error editing item:', e);
    }
  };

  // Edit item inline - cancel
  const handleCancelEditItem = () => {
    setEditingItem(null);
    setEditingItemText('');
  };

  // Convert checklist item to a tarea (task)
  const handleConvertToTask = async (item) => {
    const taskData = {
      tarea: item.text,
      numero: String(Math.floor(100000 + Math.random() * 900000)),
      estado: 'Pendiente',
      prioridad: 'Media',
      project_id: null,
      categoria_codigo: 'G',
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('tareas')
        .insert(taskData)
        .select()
        .single();
      
      if (error) throw error;
      toast.success(`✓ Creada como tarea: "${item.text.substring(0, 40)}${item.text.length > 40 ? '...' : ''}"`);
    } catch (error) {
      console.error('Error converting to task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  // Drag & Drop handlers
  const handleItemDragStart = (e, listId, item) => {
    setDraggedItem({ listId, item });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    // Add a subtle visual effect
    e.currentTarget.classList.add('opacity-50');
  };

  const handleItemDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverListId(null);
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleListDragOver = (e, listId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverListId(listId);
  };

  const handleListDragLeave = (e, listId) => {
    // Only clear if leaving the list area entirely
    const relatedTarget = e.relatedTarget;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverListId(prev => prev === listId ? null : prev);
    }
  };

  const handleItemDrop = async (e, targetListId) => {
    e.preventDefault();
    setDragOverListId(null);
    
    if (!draggedItem || draggedItem.listId === targetListId) {
      setDraggedItem(null);
      return;
    }

    const { listId: sourceListId, item } = draggedItem;
    
    // Optimistic UI update: remove from source, add to target
    const updated = checklists.map(list => {
      if (list.id === sourceListId) {
        return { ...list, items: list.items.filter(i => i.id !== item.id) };
      }
      if (list.id === targetListId) {
        return { ...list, items: [...list.items, item] };
      }
      return list;
    });

    setChecklists(updated);
    localStorage.setItem('horizon_checklists', JSON.stringify(updated));
    setDraggedItem(null);

    // Guardar ambos listados en Supabase
    try {
      const sourceList = updated.find(l => l.id === sourceListId);
      const targetList = updated.find(l => l.id === targetListId);
      
      if (sourceList) {
        const { error: err1 } = await supabase
          .from('checklists')
          .update({ items: sourceList.items })
          .eq('id', sourceListId);
        if (err1) console.error('Error updating source list:', err1);
      }
      if (targetList) {
        const { error: err2 } = await supabase
          .from('checklists')
          .update({ items: targetList.items })
          .eq('id', targetListId);
        if (err2) console.error('Error updating target list:', err2);
      }
      toast.success('Elemento movido');
    } catch (e) {
      console.error('Error moving item:', e);
      toast.error('Error al mover el elemento');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 lg:pb-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Cargando listas...</p>
        </div>
      </div>
    );
  }

  // Stats
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
                    className={`flex flex-col justify-between min-h-[300px] max-h-[600px] p-5 rounded-2xl border bg-card shadow-sm transition-all duration-300 relative group/card ${theme.card}`}
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
                    <div className={`flex-1 overflow-y-auto my-4 pr-1 space-y-1.5 scrollbar-thin rounded-lg transition-colors ${dragOverListId === list.id ? 'bg-primary/5 ring-1 ring-primary/30' : ''}`}
                      onDragOver={(e) => handleListDragOver(e, list.id)}
                      onDragLeave={(e) => handleListDragLeave(e, list.id)}
                      onDrop={(e) => handleItemDrop(e, list.id)}
                    >
                      {list.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground/50 pt-8">
                          <ListTodo className="w-8 h-8 stroke-[1.5] mb-2 opacity-30" />
                          <p className="text-[11px] font-medium max-w-[160px]">
                            Arrastra elementos aquí
                          </p>
                        </div>
                      ) : (
                        list.items.map((item) => {
                          const isEditingThis = editingItem?.listId === list.id && editingItem?.itemId === item.id;
                          return (
                            <div
                              key={item.id}
                              draggable={!isEditingThis}
                              onDragStart={(e) => handleItemDragStart(e, list.id, item)}
                              onDragEnd={handleItemDragEnd}
                              className="flex items-start justify-between group/item p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              {/* Drag Handle */}
                              <div className="flex items-center gap-0.5 shrink-0 mt-0.5 mr-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover/item:opacity-30 transition-opacity text-muted-foreground">
                                <GripVertical className="w-3 h-3" />
                              </div>

                              {/* Checkbox */}
                              <div 
                                onClick={() => handleToggleItem(list.id, item.id)}
                                className="flex items-start gap-2 flex-1 min-w-0 cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  readOnly
                                  className={`mt-0.5 w-4 h-4 rounded-md border bg-transparent shrink-0 focus:ring-0 ${theme.checkbox} transition-all`}
                                />

                                {isEditingThis ? (
                                  <div className="flex-1 flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={editingItemText}
                                      onChange={(e) => setEditingItemText(e.target.value)}
                                      className="flex-1 bg-muted border border-border focus:border-primary rounded-lg px-2 py-1 text-[13px] outline-none"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEditItem();
                                        if (e.key === 'Escape') handleCancelEditItem();
                                      }}
                                    />
                                    <Button 
                                      size="icon"
                                      onMouseDown={(e) => { e.preventDefault(); handleSaveEditItem(); }}
                                      className="h-6 w-6 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg shrink-0"
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button 
                                      size="icon"
                                      variant="outline"
                                      onMouseDown={(e) => { e.preventDefault(); handleCancelEditItem(); }}
                                      className="h-6 w-6 rounded-lg shrink-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartEditItem(list.id, item.id, item.text);
                                    }}
                                    className={`text-[13px] leading-relaxed transition-all whitespace-pre-wrap break-words cursor-text hover:text-primary ${
                                      item.completed 
                                        ? 'line-through text-muted-foreground/60 font-medium' 
                                        : 'text-foreground font-medium'
                                    }`}
                                  >
                                    {item.text}
                                  </span>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-0.5 shrink-0 ml-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                {/* Convert to Task */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConvertToTask(item);
                                  }}
                                  className="p-0.5 text-muted-foreground hover:text-emerald-400 transition-colors"
                                  title="Convertir en tarea"
                                >
                                  <ArrowRightToLine className="w-3.5 h-3.5" />
                                </button>
                                {/* Delete */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(list.id, item.id);
                                  }}
                                  className="p-0.5 text-muted-foreground hover:text-rose-400 transition-colors"
                                  title="Quitar elemento"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
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
