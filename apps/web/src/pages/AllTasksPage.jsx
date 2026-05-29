import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import DetailPanel from '@/components/DetailPanel.jsx';
import DaySelector from '@/components/DaySelector.jsx';
import Header from '@/components/Header.jsx';
import NoDateSection from '@/components/NoDateSection.jsx';
import { toast } from 'sonner';
import { Search, X, CalendarPlus, Plus, Loader2, Calendar, RefreshCw, ChevronDown, ChevronUp, Undo2, Trash2 } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useRecurrence } from '@/hooks/useRecurrence.js';
import { useViewPreference } from '@/hooks/useViewPreference.js';
import { useTimeSlots } from '@/hooks/useTimeSlots.js';
import { GridLayout } from '@/components/GridLayout.jsx';
import { GridTaskCard } from '@/components/GridTaskCard.jsx';
import { filterTasksByDate, groupTasksByStatus } from '@/lib/filterTasksByDate.js';
import { useRealtimeSync } from '@/hooks/useRealtimeSync.js';

const AllTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [viewMode, setViewMode] = useViewPreference('all', 'list');

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedFrequency, setSelectedFrequency] = useState('Todas');
  const [selectedPriority, setSelectedPriority] = useState('Todas');
  const [selectedBloque, setSelectedBloque] = useState('Todos');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);
  const [taskForDayMove, setTaskForDayMove] = useState(null);

  const [addingTaskInEstado, setAddingTaskInEstado] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');

  const [expandedSections, setExpandedSections] = useState({
    Pendiente: true,
    'En curso': true,
    Hecho: false
  });

  const { startDrag, endDrag, getDropZoneClass, getDraggedItemClass } = useDragDrop();
  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();
  const { getTasksWithoutDate } = useTimeSlots();

  const categories = ['Todas', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const frequencies = ['Todas', 'Diaria', 'Semanal', 'Mensual', 'Puntual', 'Meta'];
  const priorities = ['Todas', 'Alta', 'Media', 'Baja'];

  // Listen for realtime changes from other devices
  useRealtimeSync(['tareas', 'projects'], useCallback((event) => {
    console.log('[AllTasksPage] Realtime change detected:', event.table, event.eventType);
    fetchData();
  }, []));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchQuery, selectedCategory, selectedFrequency, selectedPriority, selectedBloque]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        supabase.from('tareas').select('*').order('numero'),
        supabase.from('projects').select('*').order('nombre')
      ]);
      
      if (tasksRes.error) throw tasksRes.error;
      if (projectsRes.error) throw projectsRes.error;
      
      const allTasks = filterTasksByDate(tasksRes.data, 'all');
      setTasks(allTasks);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.tarea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.numero.includes(searchQuery)
      );
    }
    
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(task => task.categoria_codigo === selectedCategory);
    }
    
    if (selectedFrequency !== 'Todas') {
      filtered = filtered.filter(task => task.frecuencia === selectedFrequency);
    }
    
    if (selectedPriority !== 'Todas') {
      filtered = filtered.filter(task => task.prioridad === selectedPriority);
    }
    
    if (selectedBloque !== 'Todos') {
      filtered = filtered.filter(task => task.bloque === selectedBloque);
    }
    
    setFilteredTasks(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todas');
    setSelectedFrequency('Todas');
    setSelectedPriority('Todas');
    setSelectedBloque('Todos');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'Todas' || selectedFrequency !== 'Todas' || selectedPriority !== 'Todas' || selectedBloque !== 'Todos';

  const handleTaskClick = (task) => {
    console.log("handleTaskClick called with:", task);
    if (String(task.id).startsWith('temp-')) {
      toast.info('Guardando tarea, por favor espera un momento...');
      return;
    }
    setSelectedTask(task);
    setIsPanelOpen(true);
  };

  const handleDetailPanelUpdate = (updatedTask, isDeleted = false) => {
    if (isDeleted) {
      setTasks(prev => prev.filter(t => t.id !== updatedTask.id));
      return;
    }
    setTasks(prev => {
      const exists = prev.find(t => t.id === updatedTask.id);
      if (exists) {
        return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
      } else {
        return [...prev, updatedTask];
      }
    });
  };

  const handleAssignDate = async (taskId, dateStr) => {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .update({ fecha_vencimiento: new Date(dateStr).toISOString() })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      setTasks(tasks.map(t => t.id === taskId ? data : t));
      toast.success('Fecha asignada');
    } catch (error) {
      console.error('Error assigning date:', error);
      toast.error('Error al asignar fecha');
    }
  };

  const handleTaskCheck = async (taskId, isChecked) => {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .update({ estado: isChecked ? 'Hecho' : 'Pendiente' })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      setTasks(tasks.map(t => t.id === taskId ? data : t));
      toast.success(isChecked ? 'Tarea completada' : 'Tarea pendiente');
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCategoryBadgeClass = (codigo) => `category-badge-${codigo?.toLowerCase() || 'a'}`;
  const getPriorityBadgeClass = (prioridad) => `priority-badge-${prioridad?.toLowerCase() || 'media'}`;

  const bloques = ['Todos', ...new Set(tasks.map(t => t.bloque).filter(Boolean))];
  
  const tasksWithDate = filteredTasks;
  const tasksWithoutDate = getTasksWithoutDate(filteredTasks);
  
  const statusGroupedTasks = useMemo(() => groupTasksByStatus(tasksWithDate), [tasksWithDate]);

  const renderListSection = (title, estadoKey) => {
    const sectionTasks = statusGroupedTasks[estadoKey] || [];
    const isExpanded = expandedSections[estadoKey];

    return (
      <div className="mb-6">
        <button 
          onClick={() => toggleSection(estadoKey)}
          className="flex items-center justify-between w-full py-2 mb-3 touch-target group"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-heading font-bold text-foreground group-hover:text-primary transition-colors">{title}</h2>
            <span className="text-[12px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{sectionTasks.length}</span>
          </div>
          <div className="bg-card p-1.5 rounded-md border border-border group-hover:border-primary/50 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        
        {isExpanded && (
          sectionTasks.length === 0 ? (
            <div className="text-center py-8 bg-card rounded-xl border border-border shadow-sm">
              <p className="text-[13px] text-muted-foreground font-medium">No hay tareas en esta sección</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sectionTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`task-card cursor-pointer group ${task.estado === 'Hecho' ? 'opacity-80' : ''}`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-muted-foreground bg-background px-1.5 py-0.5 rounded-md border border-border">#{task.numero}</span>
                    </div>
                  </div>
                  
                  <h3 className={`font-medium text-[14px] mb-3 leading-tight transition-colors ${task.estado === 'Hecho' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {task.tarea}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${getCategoryBadgeClass(task.categoria_codigo)}`}>
                      {task.categoria_codigo}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
                      {task.prioridad}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Todas las tareas - Gestor de Tareas</title>
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-4 py-3 sm:py-4">
            <Header 
              title="Todas las tareas"
              currentView={viewMode}
              onViewChange={setViewMode}
              moduleName="all"
              actions={
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedTask({ isNew: true });
                    setIsPanelOpen(true);
                  }}
                  className="h-[32px] px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Nueva Tarea</span>
                </Button>
              }
            />
            
            <div className="relative mb-3 mt-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre o número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border h-[44px] text-[14px] focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>
        
        <main className="px-4 py-4">
          <div key={viewMode} className="animate-fade-in view-transition">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-6">
                {viewMode === 'grid' ? (
                  <GridLayout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
                    {filteredTasks.length === 0 ? (
                      <div className="col-span-full text-center py-8 bg-card rounded-xl border border-border shadow-sm">
                        <p className="text-[13px] text-muted-foreground font-medium">No hay tareas que coincidan con los filtros</p>
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <GridTaskCard 
                          key={task.id}
                          task={task}
                          onCheck={handleTaskCheck}
                          onEdit={handleTaskClick}
                        />
                      ))
                    )}
                  </GridLayout>
                ) : (
                  <>
                    {renderListSection('Pendientes', 'Pendiente')}
                    {renderListSection('En Curso', 'En curso')}
                    {renderListSection('Completadas', 'Hecho')}
                    
                    <NoDateSection 
                      tasks={tasksWithoutDate} 
                      onAssignDate={handleAssignDate} 
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <DetailPanel
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={() => {
          setIsPanelOpen(false);
          setSelectedTask(null);
        }}
        onUpdate={handleDetailPanelUpdate}
      />
    </>
  );
};

export default AllTasksPage;