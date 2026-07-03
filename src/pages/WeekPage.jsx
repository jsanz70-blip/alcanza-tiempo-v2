import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useDragDrop } from '@/hooks/useDragDrop';
import { useRecurrence } from '@/hooks/useRecurrence.js';
import Header from '@/components/Header.jsx';
import { useViewPreference } from '@/hooks/useViewPreference.js';
import { GridLayout } from '@/components/GridLayout.jsx';
import { GridTaskCard } from '@/components/GridTaskCard.jsx';
import DetailPanel from '@/components/DetailPanel.jsx';
import AlarmIndicator from '@/components/AlarmIndicator.jsx';
import { Calendar, RefreshCw, Clock, Check } from 'lucide-react';
import { filterTasksByWeek, groupTasksByWeekDay } from '@/lib/filterTasksByDate.js';
import AvailableTasksSidebar from '@/components/AvailableTasksSidebar.jsx';
import { useRealtimeSync } from '@/hooks/useRealtimeSync.js';

const WeekPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Vencidas');
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState('vigentes');
  
  const [viewMode, setViewMode] = useViewPreference('week', 'list');
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const { startDrag, endDrag, onDragOver, onDragLeave, onDrop, getDropZoneClass } = useDragDrop();
  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();

  // Listen for realtime changes from other devices
  useRealtimeSync(['tareas'], useCallback((event) => {
    console.log('[WeekPage] Realtime change detected:', event.table, event.eventType);
    fetchTasks(true);
  }, []));

  useEffect(() => {
    fetchTasks();
  }, []);

  // Group tasks by day - only vigentes for day grouping
  const activeTasks = useMemo(() => tasks.filter(t => t.estado !== 'Hecho'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.estado === 'Hecho'), [tasks]);
  
  const groupedTasks = useMemo(() => groupTasksByWeekDay(activeTasks), [activeTasks]);
  
  // Get overdue tasks (past dates, not completed)
  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return activeTasks.filter(t => {
      if (!t.fecha_vencimiento) return false;
      const dueDate = new Date(t.fecha_vencimiento);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  }, [activeTasks]);
  
  // Get tasks without specific date (for sidebar) - exclude 'A Futuro' and 'Hecho'
  const tasksWithoutDate = useMemo(() => {
    return activeTasks.filter(t => !t.fecha_vencimiento && t.estado !== 'A Futuro');
  }, [activeTasks]);
  
  const days = ['Vencidas', ...Object.keys(groupedTasks)];

  useEffect(() => {
    if (taskFilter === 'completadas') {
      setFilteredTasks(completedTasks);
    } else if (selectedDay === 'Vencidas') {
      setFilteredTasks(overdueTasks);
    } else {
      setFilteredTasks(groupedTasks[selectedDay] || []);
    }
  }, [selectedDay, tasks, groupedTasks, overdueTasks, taskFilter, completedTasks]);

  const fetchTasks = async (skipLoading = false) => {
    if (!skipLoading) setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('numero');
        
      if (error) throw error;
      
      const weekTasks = filterTasksByWeek(data);
      setTasks(weekTasks);
      setFilteredTasks(weekTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoChange = async (taskId, newEstado) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const isCompleting = newEstado === 'Hecho';
      
      if (isCompleting) {
        if (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && task.fecha_vencimiento) {
          const nextDate = calculateNextDate(task.fecha_vencimiento, task.tipo_recurrencia);
          const newTaskData = {
            ...task,
            id: undefined,
            numero: Math.floor(100000 + Math.random() * 900000).toString(),
            estado: 'Pendiente',
            fecha_vencimiento: nextDate,
            alarmas_historial: []
          };
          
          const { error } = await supabase.from('tareas').insert(newTaskData);
          if (error) throw error;
          
          toast.success(`Tarea recurrente creada para ${new Date(nextDate).toLocaleDateString()}`);
        } else {
          toast.success('Estado actualizado');
        }
      } else {
        toast.success('Estado actualizado');
      }

      const { data, error } = await supabase
        .from('tareas')
        .update({ estado: newEstado })
        .eq('id', taskId)
        .select()
        .single();
        
      if (error) throw error;
      
      if (isCompleting) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, estado: 'Hecho' } : t));
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? data : t));
      }
    } catch (error) {
      console.error('Error updating estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const onGridDrop = async (data, dropZoneId) => {
    const targetDay = dropZoneId.replace('day-', '');
    if (!data || !data.taskId || targetDay === 'Vencidas') return;

    const task = tasks.find(t => t.id === data.taskId);
    if (!task) return;

    // Dropping to 'A Futuro' - set estado to 'A Futuro' and clear date
    if (targetDay === 'A Futuro') {
      const updatedTask = { ...task, estado: 'A Futuro', fecha_vencimiento: null };
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success('Movido a A Futuro');
      try {
        const { error } = await supabase
          .from('tareas')
          .update({ estado: 'A Futuro', fecha_vencimiento: null })
          .eq('id', task.id);
        if (error) throw error;
      } catch (error) {
        console.error('Error moving task:', error);
        toast.error('Error al mover la tarea');
        setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      }
      return;
    }

    let newDateStr = task.fecha_vencimiento;
    if (targetDay !== 'Sin fecha específica') {
      const datePart = targetDay.split(' ')[1];
      if (datePart) {
        const [day, month] = datePart.split('/');
        const now = new Date();
        const newDate = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
        newDateStr = newDate.toISOString();
      }
    } else {
      newDateStr = null;
    }

    // If coming from 'A Futuro', reset estado to 'Pendiente'
    const newEstado = task.estado === 'A Futuro' ? 'Pendiente' : task.estado;

    // Optimistic update
    const updatedTask = { ...task, fecha_vencimiento: newDateStr, estado: newEstado };
    setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    toast.success(`Movido a ${targetDay}`);

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ fecha_vencimiento: newDateStr, estado: newEstado })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Error al mover la tarea');
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    }
  };

  const handleAssignDateFromSidebar = async (taskId, targetDay) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newDateStr = '';
    if (targetDay !== 'Sin fecha específica') {
      const datePart = targetDay.split(' ')[1];
      if (datePart) {
        const [day, month] = datePart.split('/');
        const now = new Date();
        const newDate = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
        newDateStr = newDate.toISOString();
      }
    }

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ fecha_vencimiento: newDateStr })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success(`Fecha asignada a ${targetDay}`);
      fetchTasks();
    } catch (error) {
      console.error('Error assigning date:', error);
      toast.error('Error al asignar fecha');
    }
  };

  const onListDropToDay = async (e, targetDay) => {
    const result = onDrop(e, { id: `day-${targetDay}`, type: 'week' });
    if (!result.success || !result.data) return;
    onGridDrop(result.data, `day-${targetDay}`);
  };

  const handleDropToSidebar = async (dragData) => {
    if (!dragData || !dragData.taskId) return;
    const task = tasks.find(t => t.id === dragData.taskId);
    if (!task) return;

    // Moving to sidebar = remove from A Futuro, set estado to Pendiente, clear date
    const updatedTask = { ...task, estado: 'Pendiente', fecha_vencimiento: null };
    setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    toast.success('Tarea movida a Sin Fecha Asignada');

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: 'Pendiente', fecha_vencimiento: null })
        .eq('id', task.id);
      if (error) throw error;
    } catch (error) {
      console.error('Error moving task to sidebar:', error);
      toast.error('Error al mover la tarea');
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    }
  };

  const handleEditClick = (task) => {
    setSelectedTaskToEdit(task);
    setIsDetailPanelOpen(true);
  };

  const handleDetailPanelUpdate = (updatedTask, isDeleted = false) => {
    if (isDeleted) {
      setTasks(prev => prev.filter(t => t.id !== updatedTask.id));
    } else {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
  };

  const getCategoryBadgeClass = (codigo) => `category-badge-${codigo?.toLowerCase() || 'a'}`;
  const getPriorityBadgeClass = (prioridad) => `priority-badge-${prioridad?.toLowerCase() || 'media'}`;

  const getDueDateColor = (dateStr) => {
    if (!dateStr) return 'text-muted-foreground';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-destructive';
    if (diffDays <= 1) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <>
      <Helmet>
        <title>Tareas de la semana - Gestor de Tareas</title>
        <meta name="description" content="Gestiona tus tareas semanales." />
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-3 py-4">
            <Header 
              title="Tareas de la semana"
              currentView={viewMode}
              onViewChange={setViewMode}
              moduleName="week"
            />
            
            <div className="flex items-center justify-between gap-2 mt-3">
              <div className="flex gap-1 bg-muted rounded-full p-1">
                <button
                  onClick={() => setTaskFilter('vigentes')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${taskFilter === 'vigentes' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Vigentes
                </button>
                <button
                  onClick={() => setTaskFilter('completadas')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${taskFilter === 'completadas' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Completadas
                </button>
              </div>
            </div>

            {viewMode === 'list' && taskFilter === 'vigentes' && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 mt-4">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? 'default' : 'outline'}
                    className={`h-[36px] whitespace-nowrap rounded-full px-4 transition-all duration-200 text-[13px] flex-shrink-0 ${selectedDay === day ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-muted'} ${getDropZoneClass({ id: `day-${day}` })}`}
                    onClick={() => setSelectedDay(day)}
                    onDragOver={(e) => day !== 'Vencidas' && onDragOver(e, { id: `day-${day}`, type: 'week' })}
                    onDragLeave={(e) => day !== 'Vencidas' && onDragLeave(e, { id: `day-${day}`, type: 'week' })}
                    onDrop={(e) => day !== 'Vencidas' && onListDropToDay(e, day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <main className="max-w-[1600px] w-full mx-auto px-3 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
            
            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9 min-h-screen">
          <div key={viewMode} className="animate-fade-in view-transition">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="task-card">
                    <Skeleton className="h-4 w-12 mb-2" />
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-5 w-12 rounded-md" />
                      <Skeleton className="h-5 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-[44px] w-full rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="space-y-8">
                  {Object.entries(groupedTasks).map(([day, dayTasks]) => {
                    return (
                      <div key={day} className="bg-card/30 p-3 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between mb-4 pl-2">
                          <h2 className="text-[16px] font-heading font-semibold text-foreground">{day}</h2>
                          <span className="text-[12px] bg-muted px-2 py-0.5 rounded-md text-muted-foreground">{dayTasks.length}</span>
                        </div>
                        
                        <GridLayout 
                          dropZoneId={`day-${day}`} 
                          dropZoneType="week"
                          onDrop={onGridDrop}
                        >
                          {dayTasks.length === 0 ? (
                            <div className="text-center py-8 w-full col-span-full border-2 border-dashed border-border/60 rounded-xl">
                              <p className="text-[13px] text-muted-foreground">Arrastra tareas aquí</p>
                            </div>
                          ) : (
                            dayTasks.map(task => (
                              <GridTaskCard 
                                key={task.id}
                                task={task}
                                onCheck={(id, val) => handleEstadoChange(id, val ? 'Hecho' : 'Pendiente')}
                                onEdit={(t) => handleEditClick(t)}
                                dragProps={{ sourceType: 'week' }}
                              />
                            ))
                          )}
                        </GridLayout>
                      </div>
                    );
                  })}
                </div>
              ) : (
                filteredTasks.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <p className="text-[14px] text-muted-foreground font-medium">
                      {selectedDay === 'Vencidas' 
                        ? 'No hay tareas vencidas' 
                        : `No hay tareas pendientes para ${selectedDay}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="task-card cursor-pointer group"
                        draggable="true"
                        onDragStart={(e) => startDrag(e, task.id, { type: 'week' })}
                        onDragEnd={endDrag}
                        onClick={() => handleEditClick(task)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEstadoChange(task.id, task.estado === 'Hecho' ? 'Pendiente' : 'Hecho');
                              }}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.estado === 'Hecho' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 hover:border-primary'}`}
                            >
                              {task.estado === 'Hecho' && <Check className="w-4 h-4" />}
                            </button>
                            <span className="text-[10px] font-bold text-muted-foreground bg-background px-1.5 py-0.5 rounded-md border border-border">#{task.numero}</span>
                          </div>
                          <AlarmIndicator task={task} />
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

                        {(task.fecha_vencimiento || (task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia')) && (
                          <div className="flex flex-wrap gap-2 text-[10px] font-medium mb-3">
                            {task.fecha_vencimiento && (
                              <span className={`flex items-center gap-1 ${getDueDateColor(task.fecha_vencimiento)}`}>
                                <Calendar className="w-3 h-3" />
                                {new Date(task.fecha_vencimiento).toLocaleDateString()}
                              </span>
                            )}
                            {task.tipo_recurrencia && task.tipo_recurrencia !== 'Sin recurrencia' && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCw className="w-3 h-3" />
                                {task.tipo_recurrencia}
                              </span>
                            )}
                          </div>
                        )}
                        
                        <Select 
                          value={task.estado} 
                          onValueChange={(value) => handleEstadoChange(task.id, value)}
                        >
                          <SelectTrigger 
                            className="bg-background border-border h-[44px] text-[13px]" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En curso">En curso</SelectItem>
                            <SelectItem value="Esperando">Esperando</SelectItem>
                            <SelectItem value="A Futuro">A Futuro</SelectItem>
                            <SelectItem value="Hecho">Hecho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )
              )
            )}
            </div>
          </div>
            
            {/* Right Sidebar: Tasks without date - fixed position on desktop */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:fixed lg:top-[80px] lg:right-4 lg:w-[calc(25%-2rem)] xl:w-[calc(25%-2.5rem)] lg:h-[calc(100vh-100px)] lg:z-30">
                <AvailableTasksSidebar 
                  tasks={tasksWithoutDate} 
                  title="Sin Fecha Asignada"
                  onEdit={(task) => handleEditClick(task)}
                  onDropTask={handleDropToSidebar}
                  onComplete={(taskId, newEstado) => handleEstadoChange(taskId, newEstado)}
                />
              </div>
            </div>
            
          </div>
        </main>
      </div>

      <DetailPanel
        task={selectedTaskToEdit}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={(updatedTask, isDeleted) => {
          handleDetailPanelUpdate(updatedTask, isDeleted);
          fetchTasks();
        }}
      />
    </>
  );
};

export default WeekPage;