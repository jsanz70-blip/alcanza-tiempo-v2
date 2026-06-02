import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Info, ChevronDown, ChevronUp, Calendar, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import { GridLayout } from '@/components/GridLayout.jsx';
import { GridTaskCard } from '@/components/GridTaskCard.jsx';
import DetailPanel from '@/components/DetailPanel.jsx';
import AlarmIndicator from '@/components/AlarmIndicator.jsx';
import { useViewPreference } from '@/hooks/useViewPreference.js';
import { useRecurrence } from '@/hooks/useRecurrence.js';
import { useRealtimeSync } from '@/hooks/useRealtimeSync.js';
import { filterRoutinesExcludingCompleted } from '@/lib/filterTasksByDate.js';

const RoutinesPage = () => {
  const [routineTasks, setRoutineTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useViewPreference('routines', 'list');

  const [expandedSections, setExpandedSections] = useState({
    routines: true
  });

  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();

  // Listen for realtime changes from other devices
  useRealtimeSync(['tareas'], useCallback((event) => {
    console.log('[RoutinesPage] Realtime change detected:', event.table, event.eventType);
    fetchTasks();
  }, []));

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('numero');
        
      if (error) throw error;
      
      const routines = filterRoutinesExcludingCompleted(data);
      setRoutineTasks(routines);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar rutinas');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckChange = async (taskId, currentValue) => {
    try {
      const task = routineTasks.find(t => t.id === taskId);
      const isCompleting = !currentValue;
      
      if (isCompleting) {
        if (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && task.fecha_vencimiento) {
          const nextDate = calculateNextDate(task.fecha_vencimiento, task.tipo_recurrencia);
          const newTaskData = {
            ...task,
            id: undefined,
            numero: Math.floor(100000 + Math.random() * 900000).toString(),
            estado: 'Pendiente',
            check_semana: false,
            fecha_vencimiento: nextDate,
            alarmas_historial: []
          };
          
          const { error } = await supabase.from('tareas').insert(newTaskData);
          if (error) throw error;
          
          toast.success(`Rutina recurrente creada para ${new Date(nextDate).toLocaleDateString()}`);
        } else {
          toast.success('Rutina completada');
        }
      }

      const { data, error } = await supabase
        .from('tareas')
        .update({
          check_semana: !currentValue,
          estado: !currentValue ? 'Hecho' : 'Pendiente'
        })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      
      if (isCompleting) {
        setRoutineTasks(routineTasks.filter(t => t.id !== taskId));
      } else {
        setRoutineTasks(routineTasks.map(t => t.id === taskId ? data : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar rutina');
    }
  };

  const handleTaskUpdate = (updatedTask, isDeleted = false) => {
    if (isDeleted || updatedTask.estado === 'Hecho') {
      setRoutineTasks(routineTasks.filter(t => t.id !== updatedTask.id));
    } else {
      setRoutineTasks(routineTasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
  };

  const handleEditClick = (task) => {
    setSelectedTaskToEdit(task);
    setIsDetailPanelOpen(true);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getCategoryBadgeClass = (codigo) => `category-badge-${codigo?.toLowerCase() || 'a'}`;
  const getPriorityBadgeClass = (prioridad) => `priority-badge-${prioridad?.toLowerCase() || 'media'}`;

  const renderTaskList = (tasks, title, sectionKey) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div className="mb-6">
        <button 
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full py-2 mb-3 touch-target group"
        >
          <h2 className="text-[18px] font-heading font-bold text-foreground group-hover:text-primary transition-colors">{title}</h2>
          <div className="bg-card p-1.5 rounded-md border border-border group-hover:border-primary/50 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
        
        {isExpanded && (
          tasks.length === 0 ? (
            <div className="text-center py-8 bg-card rounded-xl border border-border shadow-sm">
              <p className="text-[13px] text-muted-foreground font-medium">No hay rutinas pendientes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="task-card cursor-pointer group" onClick={() => handleEditClick(task)}>
                  <div className="flex items-start gap-3">
                    <div className="touch-target -ml-2 -mt-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={task.check_semana}
                        onCheckedChange={() => handleCheckChange(task.id, task.check_semana)}
                        className="w-6 h-6 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                      />
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium text-[14px] mb-2 transition-all duration-200 leading-tight ${task.check_semana ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}>
                          {task.tarea}
                        </h3>
                        <AlarmIndicator task={task} />
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${getCategoryBadgeClass(task.categoria_codigo)}`}>
                          {task.categoria_codigo}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${getPriorityBadgeClass(task.prioridad)}`}>
                          {task.prioridad}
                        </span>
                      </div>

                      {task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && (
                        <div className="flex flex-wrap gap-2 text-[10px] font-medium mb-2">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <RefreshCw className="w-3 h-3" />
                            {task.tipo_recurrencia}
                          </span>
                        </div>
                      )}
                      
                      {task.notas && (
                        <div className="bg-background rounded-lg p-2.5 mt-2 border border-border">
                          <p className="text-[12px] text-muted-foreground leading-normal line-clamp-2">
                            {task.notas}
                          </p>
                        </div>
                      )}
                    </div>
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
        <title>Rutinas - Gestor de Tareas</title>
        <meta name="description" content="Gestiona tus rutinas." />
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-4 py-3 sm:py-4">
            <Header 
              title="Rutinas"
              currentView={viewMode}
              onViewChange={setViewMode}
              moduleName="routines"
              actions={
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedTaskToEdit({ isNew: true, frecuencia: 'Semanal' });
                    setIsDetailPanelOpen(true);
                  }}
                  className="h-[32px] px-3 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Nueva Rutina</span>
                </Button>
              }
            />
          </div>
        </div>
        
        <main className="px-4 py-4">
          <div key={viewMode} className="animate-fade-in view-transition">
            <div className="bg-card border border-border rounded-xl p-3 mb-6 flex items-start gap-2 shadow-sm">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-muted-foreground leading-normal">
                El check de rutinas se reinicia automáticamente cada lunes a las 00:00 UTC.
              </p>
            </div>
            
            {loading ? (
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="task-card">
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-6 h-6 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <div className="flex gap-2">
                              <Skeleton className="h-5 w-12 rounded-md" />
                              <Skeleton className="h-5 w-12 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <GridLayout>
                  {routineTasks.map(task => (
                    <GridTaskCard 
                      key={task.id}
                      task={task}
                      onCheck={(id, val) => handleCheckChange(id, !val)}
                      onEdit={handleEditClick}
                      dragProps={{}}
                    />
                  ))}
                </GridLayout>
              ) : (
                <>
                  {renderTaskList(routineTasks, 'Todas las Rutinas', 'routines')}
                </>
              )
            )}
          </div>
        </main>
      </div>

      <DetailPanel
        task={selectedTaskToEdit}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={handleTaskUpdate}
      />
    </>
  );
};

export default RoutinesPage;