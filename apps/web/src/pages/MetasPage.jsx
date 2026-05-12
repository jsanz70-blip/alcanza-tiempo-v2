import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import { GridLayout } from '@/components/GridLayout.jsx';
import { GridTaskCard } from '@/components/GridTaskCard.jsx';
import DetailPanel from '@/components/DetailPanel.jsx';
import AlarmIndicator from '@/components/AlarmIndicator.jsx';
import { useViewPreference } from '@/hooks/useViewPreference.js';
import { useRecurrence } from '@/hooks/useRecurrence.js';
import { Calendar, RefreshCw } from 'lucide-react';
import { filterGoalsExcludingCompleted } from '@/lib/filterTasksByDate.js';

const MetasPage = () => {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useViewPreference('metas', 'list');
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const { handleRecurringTaskCompletion, calculateNextDate } = useRecurrence();

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*, projects(*)')
        .order('numero');
        
      if (error) throw error;
      
      const filtered = filterGoalsExcludingCompleted(data);
      setMetas(filtered);
    } catch (error) {
      console.error('Error fetching metas:', error);
      toast.error('Error al cargar metas');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckChange = async (taskId, currentValue) => {
    try {
      const task = metas.find(t => t.id === taskId);
      const isCompleting = !currentValue;
      
      if (isCompleting) {
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
          
          toast.success(`Meta recurrente creada para ${new Date(nextDate).toLocaleDateString()}`);
        } else {
          toast.success('Meta alcanzada');
        }
      }

      const { data, error } = await supabase
        .from('tareas')
        .update({
          check_hoy: !currentValue,
          estado: !currentValue ? 'Hecho' : 'Pendiente'
        })
        .eq('id', taskId)
        .select('*, projects(*)')
        .single();
        
      if (error) throw error;
      
      if (isCompleting) {
        setMetas(metas.filter(t => t.id !== taskId));
      } else {
        setMetas(metas.map(t => t.id === taskId ? data : t));
      }
    } catch (error) {
      console.error('Error updating meta:', error);
      toast.error('Error al actualizar meta');
    }
  };

  const handleDetailPanelUpdate = async (updatedData, isDeleted = false) => {
    if (isDeleted || updatedData.estado === 'Hecho') {
      setMetas(metas.filter(t => t.id !== updatedData.id));
      setIsDetailPanelOpen(false);
      setSelectedTaskToEdit(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tareas')
        .update(updatedData)
        .eq('id', updatedData.id)
        .select('*, projects(*)')
        .single();
        
      if (error) throw error;
      
      setMetas(metas.map(t => t.id === data.id ? data : t));
      
      toast.success('Meta actualizada correctamente');
      setIsDetailPanelOpen(false);
      setSelectedTaskToEdit(null);
    } catch (error) {
      console.error('Error updating meta:', error);
      toast.error('Error al actualizar la meta');
    }
  };

  const handleEditClick = (task) => {
    setSelectedTaskToEdit(task);
    setIsDetailPanelOpen(true);
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
        <title>Metas - Gestor de Tareas</title>
        <meta name="description" content="Gestiona tus metas y objetivos." />
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-3 py-4">
            <Header 
              title="Mis Metas"
              currentView={viewMode}
              onViewChange={setViewMode}
              moduleName="metas"
            />
          </div>
        </div>
        
        <main className="px-3 py-4">
          <div key={viewMode} className="animate-fade-in view-transition">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="task-card">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-6 h-6 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : metas.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border shadow-sm">
                <p className="text-[14px] text-muted-foreground font-medium">No tienes metas pendientes</p>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <GridLayout>
                  {metas.map(task => (
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
                <div className="space-y-3">
                  {metas.map((task) => {
                    const isCompleted = task.check_hoy || task.estado === 'Hecho';
                    const projectProgress = task.projects?.progreso || 0;
                    
                    return (
                      <div key={task.id} className="task-card cursor-pointer group" onClick={() => handleEditClick(task)}>
                        <div className="flex items-start gap-3">
                          <div className="touch-target -ml-2 -mt-2" onClick={(e) => e.stopPropagation()}>
                            <Checkbox 
                              checked={isCompleted}
                              onCheckedChange={() => handleCheckChange(task.id, isCompleted)}
                              className="w-6 h-6 rounded-md border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                            />
                          </div>
                          
                          <div className="flex-1 pt-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className={`font-semibold text-[15px] mb-2 leading-tight ${isCompleted ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'}`}>
                                {task.tarea}
                              </h3>
                              <AlarmIndicator task={task} />
                            </div>
                            
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
                            
                            {task.projects && (
                              <div className="mt-3 bg-background rounded-lg p-2.5 border border-border">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-[11px] font-medium text-muted-foreground">Proyecto: {task.projects.nombre}</span>
                                  <span className="text-[11px] font-bold text-primary">{projectProgress}%</span>
                                </div>
                                <div className="w-full h-[4px] bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-primary transition-all duration-500" 
                                    style={{ width: `${projectProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <DetailPanel
        task={selectedTaskToEdit}
        isOpen={isDetailPanelOpen}
        onClose={() => setIsDetailPanelOpen(false)}
        onUpdate={handleDetailPanelUpdate}
      />
    </>
  );
};

export default MetasPage;