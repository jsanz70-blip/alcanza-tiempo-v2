import React, { useState, useEffect, useMemo } from 'react';
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
import { Calendar, RefreshCw } from 'lucide-react';
import { filterTasksByWeekExcludingCompleted, groupTasksByWeekDay } from '@/lib/filterTasksByDate.js';

const WeekPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Todos');
  const [loading, setLoading] = useState(true);
  
  const [viewMode, setViewMode] = useViewPreference('week', 'list');
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const { startDrag, endDrag, onDragOver, onDragLeave, onDrop, getDropZoneClass } = useDragDrop();
  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();

  useEffect(() => {
    fetchTasks();

    // Subscribe to real-time changes in tareas
    const channel = supabase
      .channel('week-tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tareas' },
        (payload) => {
          console.log('Realtime change received in WeekPage:', payload);
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const groupedTasks = useMemo(() => groupTasksByWeekDay(tasks), [tasks]);
  const days = ['Todos', ...Object.keys(groupedTasks)];

  useEffect(() => {
    if (selectedDay === 'Todos') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(groupedTasks[selectedDay] || []);
    }
  }, [selectedDay, tasks, groupedTasks]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('numero');
        
      if (error) throw error;
      
      const weekTasks = filterTasksByWeekExcludingCompleted(data);
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
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        setTasks(tasks.map(t => t.id === taskId ? data : t));
      }
    } catch (error) {
      console.error('Error updating estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const onGridDrop = async (data, dropZoneId) => {
    const targetDay = dropZoneId.replace('day-', '');
    if (!data || !data.taskId || targetDay === 'Todos') return;

    const task = tasks.find(t => t.id === data.taskId);
    if (!task) return;

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
      newDateStr = "";
    }

    const updatedTask = { ...task, fecha_vencimiento: newDateStr };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    toast.success(`Movido a ${targetDay}`);

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ fecha_vencimiento: newDateStr })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Error al mover la tarea');
      setTasks(tasks.map(t => t.id === task.id ? task : t));
    }
  };

  const onListDropToDay = async (e, targetDay) => {
    const result = onDrop(e, { id: `day-${targetDay}`, type: 'week' });
    if (!result.success || !result.data) return;
    onGridDrop(result.data, `day-${targetDay}`);
  };

  const handleEditClick = (task) => {
    setSelectedTaskToEdit(task);
    setIsDetailPanelOpen(true);
  };

  const handleDetailPanelUpdate = (updatedTask, isDeleted = false) => {
    if (isDeleted || updatedTask.estado === 'Hecho') {
      setTasks(tasks.filter(t => t.id !== updatedTask.id));
    } else {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
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
            
            {viewMode === 'list' && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 mt-4">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? 'default' : 'outline'}
                    className={`h-[36px] whitespace-nowrap rounded-full px-4 transition-all duration-200 text-[13px] flex-shrink-0 ${selectedDay === day ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-card hover:bg-muted'} ${getDropZoneClass({ id: `day-${day}` })}`}
                    onClick={() => setSelectedDay(day)}
                    onDragOver={(e) => day !== 'Todos' && onDragOver(e, { id: `day-${day}`, type: 'week' })}
                    onDragLeave={(e) => day !== 'Todos' && onDragLeave(e, { id: `day-${day}`, type: 'week' })}
                    onDrop={(e) => day !== 'Todos' && onListDropToDay(e, day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <main className="px-3 py-4">
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
                      {selectedDay === 'Todos' 
                        ? 'No hay tareas pendientes para esta semana' 
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