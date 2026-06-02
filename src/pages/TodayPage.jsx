import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Info, CalendarDays, Edit2, FolderKanban, Plus, RefreshCw, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useRecurrence } from '@/hooks/useRecurrence.js';
import { useTimeSlots } from '@/hooks/useTimeSlots.js';
import DaySelector from '@/components/DaySelector.jsx';
import DetailPanel from '@/components/DetailPanel.jsx';
import ProjectManager from '@/components/ProjectManager.jsx';
import ProjectForm from '@/components/ProjectForm.jsx';
import { useProjectProgress } from '@/hooks/useProjectProgress.js';
import Header from '@/components/Header.jsx';
import { useViewPreference } from '@/hooks/useViewPreference.js';
import ProjectSelectionDialog from '@/components/ProjectSelectionDialog.jsx';
import FrequencySelectionDialog from '@/components/FrequencySelectionDialog.jsx';
import AlarmIndicator from '@/components/AlarmIndicator.jsx';
import OverdueBadge from '@/components/OverdueBadge.jsx';
import TimeSlotSelector from '@/components/TimeSlotSelector.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AvailableTasksSidebar from '@/components/AvailableTasksSidebar.jsx';
import { filterTasksByDateExcludingCompleted } from '@/lib/filterTasksByDate.js';
import { useRealtimeSync } from '@/hooks/useRealtimeSync.js';

const TodayPage = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dailyObjective, setDailyObjective] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('recurrentes');
  const [isAvailableTasksOpen, setIsAvailableTasksOpen] = useState(false);
  
  const [viewMode, setViewMode] = useViewPreference('today', 'list');

  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);
  const [selectedTaskForMove, setSelectedTaskForMove] = useState(null);
  
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  
  const [isProjectSelectOpen, setIsProjectSelectOpen] = useState(false);
  const [isFreqSelectOpen, setIsFreqSelectOpen] = useState(false);
  const [pendingDropTask, setPendingDropTask] = useState(null);

  const [isSlotSelectorOpen, setIsSlotSelectorOpen] = useState(false);
  const [taskForSlot, setTaskForSlot] = useState(null);

  const [collapsedSlots, setCollapsedSlots] = useState({ 'Sin franja': true });

  const { draggingId, getDropZoneClass, onDragOver, onDragLeave, onDrop } = useDragDrop();
  const { updateProjectProgress } = useProjectProgress();
  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();
  const { SLOTS, getTasksBySlot } = useTimeSlots();

  // Listen for realtime changes from other devices
  useRealtimeSync(['tareas', 'projects', 'daily_objectives'], useCallback((event) => {
    console.log('[TodayPage] Realtime change detected:', event.table, event.eventType);
    // Force refresh data to ensure UI is updated
    fetchData();
  }, []));

  useEffect(() => {
    fetchData();
    // Polling de respaldo cada 5s para sincronización entre ventanas
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const startOfDay = new Date(todayStr + 'T00:00:00.000Z');
      const endOfDay = new Date(todayStr + 'T23:59:59.999Z');

      const [projectsRes, tasksRes, objectivesRes] = await Promise.all([
        supabase.from('projects').select('*').order('nombre'),
        supabase.from('tareas').select('*').order('prioridad'),
        supabase.from('daily_objectives').select('*').gte('fecha', startOfDay.toISOString()).lte('fecha', endOfDay.toISOString())
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (tasksRes.error) throw tasksRes.error;
      if (objectivesRes.error) throw objectivesRes.error;

      setProjects(projectsRes.data);
      
      let currentObjective = objectivesRes.data[0];
      if (!currentObjective) {
        const { data, error } = await supabase
          .from('daily_objectives')
          .insert({
            fecha: todayStr + 'T12:00:00.000Z',
            franjas: {}
          })
          .select()
          .single();
          
        if (error) throw error;
        currentObjective = data;
      }
      setDailyObjective(currentObjective);

      setAllTasks(tasksRes.data);
      
      const filteredForView = tasksRes.data.filter(t => {
        const matchesFilter = activeFilter === 'recurrentes' 
          ? ['Diaria', 'Semanal', 'Mensual'].includes(t.frecuencia)
          : t.frecuencia === 'Puntual';
        
        if (!matchesFilter) return false;
        
        const todayFiltered = filterTasksByDateExcludingCompleted([t]);
        return todayFiltered.length > 0;
      });

      const sorted = filteredForView.sort((a, b) => {
        const priorityOrder = { 'Alta': 0, 'Media': 1, 'Baja': 2 };
        return priorityOrder[a.prioridad] - priorityOrder[b.prioridad];
      });
      
      setTasks(sorted);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const isCompleting = updates.estado === 'Hecho' || updates.check_hoy;
      
      if (isCompleting) {
        updates.estado = 'Hecho';
        updates.check_hoy = true;
        
        if (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && task.fecha_vencimiento) {
          const nextDate = calculateNextDate(task.fecha_vencimiento, task.tipo_recurrencia);
          const newTaskData = {
            ...task,
            id: undefined,
            numero: Math.floor(100000 + Math.random() * 900000).toString(),
            estado: 'Pendiente',
            check_hoy: false,
            fecha_vencimiento: nextDate,
            alarmas_historial: []
          };
          
          const { error } = await supabase.from('tareas').insert(newTaskData);
          if (error) throw error;
          
          toast.success(`Tarea recurrente creada para ${new Date(nextDate).toLocaleDateString()}`);
        } else {
          toast.success('Tarea completada');
        }
      }

      const { data, error } = await supabase
        .from('tareas')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      
      if (isCompleting) {
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        setTasks(tasks.map(t => t.id === taskId ? data : t));
      }

      const projectId = updates.proyecto_id !== undefined ? updates.proyecto_id : task?.proyecto_id;
      if (projectId) {
        await updateProjectProgress(projectId);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar tarea');
    }
  };

  const handleAssignSlot = async (slotId) => {
    if (!taskForSlot || !dailyObjective) return;
    try {
      const newFranjas = { ...(dailyObjective.franjas || {}), [taskForSlot.id]: slotId };
      const { data, error } = await supabase
        .from('daily_objectives')
        .update({ franjas: newFranjas })
        .eq('id', dailyObjective.id)
        .select()
        .single();
        
      if (error) throw error;
      setDailyObjective(data);
      toast.success('Franja asignada');
    } catch (error) {
      console.error('Error assigning slot:', error);
      toast.error('Error al asignar franja');
    } finally {
      setTaskForSlot(null);
    }
  };

  const handleEditClick = (e, task) => {
    if (e?.stopPropagation) e.stopPropagation();
    setSelectedTaskToEdit(task);
    setIsDetailPanelOpen(true);
  };

  const handleDetailPanelUpdate = async (updatedTask, isDeleted = false) => {
    if (isDeleted || updatedTask.estado === 'Hecho') {
      setTasks(tasks.filter(t => t.id !== updatedTask.id));
      if (updatedTask.proyecto_id) await updateProjectProgress(updatedTask.proyecto_id);
    } else {
      const belongsInCurrentView = activeFilter === 'recurrentes' 
        ? ['Diaria', 'Semanal', 'Mensual'].includes(updatedTask.frecuencia)
        : updatedTask.frecuencia === 'Puntual';

      if (belongsInCurrentView) {
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      } else {
        setTasks(tasks.filter(t => t.id !== updatedTask.id));
      }
    }
  };

  const toggleSlotCollapse = (slotId) => {
    setCollapsedSlots(prev => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const groupedTasks = useMemo(() => getTasksBySlot(tasks, dailyObjective), [tasks, dailyObjective]);

  const renderTaskCard = (task) => {
    const isCompleted = task.check_hoy || task.estado === 'Hecho';
    return (
      <div 
        key={task.id} 
        className="bg-card border border-border p-3 rounded-lg flex items-start gap-3 group relative hover:shadow-sm transition-all cursor-pointer mb-2"
        onClick={(e) => handleEditClick(e, task)}
      >
        <div className="touch-target -ml-2 -mt-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isCompleted}
            onCheckedChange={(val) => handleTaskUpdate(task.id, { check_hoy: val, estado: val ? 'Hecho' : 'Pendiente' })}
            className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        
        <div className="flex-1 pt-0.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-medium text-[13px] mb-1.5 leading-tight truncate ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {task.tarea}
            </h3>
            <div className="flex items-center gap-1">
              <OverdueBadge task={task} />
              <AlarmIndicator task={task} />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-muted text-muted-foreground`}>
              {task.prioridad}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-[10px] px-2"
            onClick={(e) => {
              e.stopPropagation();
              setTaskForSlot(task);
              setIsSlotSelectorOpen(true);
            }}
          >
            Franja
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Tareas de hoy - Gestor de Tareas</title>
      </Helmet>
      
      <div className="min-h-screen bg-background pb-40">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-4 py-3 sm:py-4">
            <Header 
              title="Tareas de hoy"
              currentView={viewMode}
              onViewChange={setViewMode}
              moduleName="today"
              actions={
                <>
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={() => setIsAvailableTasksOpen(true)}
                    className="h-[32px] px-2"
                  >
                    <Plus className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Añadir</span>
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedTaskToEdit({ isNew: true });
                      setIsDetailPanelOpen(true);
                    }}
                    className="h-[32px] px-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Nuevo</span>
                  </Button>
                </>
              }
            />
            
            <div className="flex gap-2 mb-2 mt-3">
              <button
                onClick={() => setActiveFilter('recurrentes')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFilter === 'recurrentes' ? 'filter-chip-active shadow-sm' : 'filter-chip-inactive hover:brightness-110'
                }`}
              >
                Recurrentes
              </button>
              <button
                onClick={() => setActiveFilter('puntuales')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeFilter === 'puntuales' ? 'filter-chip-active shadow-sm' : 'filter-chip-inactive hover:brightness-110'
                }`}
              >
                Puntuales
              </button>
            </div>
          </div>
        </div>
        
        <main className="px-4 py-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-6">
              {SLOTS.map(slot => {
                const slotTasks = groupedTasks[slot.id] || [];
                const isCollapsed = collapsedSlots[slot.id];
                
                if (slot.id === 'Sin franja' && slotTasks.length === 0) return null;

                return (
                  <div key={slot.id} className="mb-6">
                    <button 
                      onClick={() => toggleSlotCollapse(slot.id)}
                      className="flex items-center justify-between w-full py-2 mb-3 touch-target group"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${slot.colorClass}`} />
                        <h2 className="text-[16px] font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                          {slot.label} <span className="text-xs font-normal text-muted-foreground ml-2">{slot.time}</span>
                        </h2>
                        <span className="text-[12px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{slotTasks.length}</span>
                      </div>
                      <div className="bg-card p-1.5 rounded-md border border-border group-hover:border-primary/50 transition-colors">
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </div>
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-2">
                        {slotTasks.length === 0 ? (
                          <div className="text-center py-6 bg-card/50 rounded-xl border border-border border-dashed">
                            <p className="text-[13px] text-muted-foreground">No hay tareas en esta franja</p>
                          </div>
                        ) : (
                          slotTasks.map(renderTaskCard)
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <DetailPanel
        task={selectedTaskToEdit}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={handleDetailPanelUpdate}
      />

      <Sheet open={isAvailableTasksOpen} onOpenChange={setIsAvailableTasksOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Añadir tarea a Hoy</SheetTitle>
          </SheetHeader>
          <div className="p-4 h-full overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-4">Haz clic en una tarea para asignarla a hoy.</p>
            <div className="space-y-3">
              {allTasks
                .filter(t => t.estado !== 'Hecho' && filterTasksByDateExcludingCompleted([t]).length === 0)
                .map(task => (
                  <div 
                    key={task.id}
                    className="bg-card border border-border p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={async () => {
                      await handleTaskUpdate(task.id, { fecha_vencimiento: new Date().toISOString() });
                      setIsAvailableTasksOpen(false);
                      fetchData();
                    }}
                  >
                    <h4 className="text-sm font-medium">{task.tarea}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{task.prioridad}</span>
                      <span className="text-[10px] text-muted-foreground">{task.frecuencia}</span>
                    </div>
                  </div>
                ))}
              {allTasks.filter(t => t.estado !== 'Hecho' && filterTasksByDateExcludingCompleted([t]).length === 0).length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">No hay tareas pendientes disponibles para añadir.</p>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <TimeSlotSelector 
        isOpen={isSlotSelectorOpen}
        onClose={() => setIsSlotSelectorOpen(false)}
        onConfirm={handleAssignSlot}
        taskName={taskForSlot?.tarea || ''}
      />
    </>
  );
};

export default TodayPage;