import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, FolderKanban, ChevronDown, ChevronUp, Settings, LayoutList } from 'lucide-react';
import ProjectModal from '@/components/ProjectModal.jsx';
import TaskCardInProject from '@/components/TaskCardInProject.jsx';
import AvailableTasksSidebar from '@/components/AvailableTasksSidebar.jsx';
import { useDragDrop } from '@/hooks/useDragDrop.js';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);
  const [filterState, setFilterState] = useState('Todos');
  
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { onDragOver, onDragLeave, onDrop, getDropZoneClass } = useDragDrop();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, taskRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('tareas').select('*').order('created_at', { ascending: false })
      ]);
      
      if (projRes.error) throw projRes.error;
      if (taskRes.error) throw taskRes.error;
      
      setProjects(projRes.data);
      setTasks(taskRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDropTaskToProject = async (projectId, dragData) => {
    if (!dragData || !dragData.taskId) return;
    const taskId = dragData.taskId;
    
    // Prevent drop if it's already in this project
    const task = tasks.find(t => t.id === taskId);
    if (task?.proyecto_id === projectId) return;

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ proyecto_id: projectId })
        .eq('id', taskId);

      if (error) throw error;

      const targetProject = projects.find(p => p.id === projectId);
      toast.success(`Tarea asignada a ${targetProject.nombre}`);
      fetchData();
    } catch (error) {
      toast.error('Error al mover tarea');
    }
  };

  const handleRemoveTaskFromProject = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ proyecto_id: null })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Tarea desasignada del proyecto');
      fetchData();
    } catch (error) {
      toast.error('Error al desasignar tarea');
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const newStatus = task.estado === 'Hecho' ? 'Pendiente' : 'Hecho';
    try {
      const { error } = await supabase
        .from('tareas')
        .update({ estado: newStatus })
        .eq('id', task.id);

      if (error) throw error;
      
      toast.success(`Tarea marcada como ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar tarea');
    }
  };

  // Drop on sidebar handler
  const handleDropTaskToSidebar = async (dragData) => {
    if (!dragData || !dragData.taskId) return;
    const taskId = dragData.taskId;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task?.proyecto_id) return; // already unassigned

    try {
      const { error } = await supabase
        .from('tareas')
        .update({ proyecto_id: null })
        .eq('id', taskId);

      if (error) throw error;
      
      toast.success('Tarea devuelta a tareas disponibles');
      fetchData();
    } catch (error) {
      toast.error('Error al desasignar tarea');
    }
  };

  const unassignedTasks = tasks.filter(t => !t.proyecto_id);

  const filteredProjects = projects.filter(p => {
    if (filterState === 'Todos') return true;
    return p.estado === filterState;
  });

  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.proyecto_id === projectId);
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.estado === 'Hecho').length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent, tasks: projectTasks };
  };

  return (
    <>
      <Helmet>
        <title>Proyectos - Gestor de Tareas</title>
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24 lg:pb-6">
        <div className="sticky top-0 z-40 bg-popover/90 backdrop-blur-lg border-b border-border shadow-sm px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <FolderKanban className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground leading-tight tracking-tight">Proyectos</h1>
              <p className="text-sm text-muted-foreground">Gestiona tus proyectos y tareas asignadas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Activo">Activos</SelectItem>
                <SelectItem value="Completado">Completados</SelectItem>
                <SelectItem value="Pausado">Pausados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <Settings className="w-4 h-4" />
            </Button>
            <Button className="h-10" onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
            </Button>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar - Available Tasks */}
          <div className="lg:col-span-4 h-full"
               onDragOver={(e) => onDragOver(e, { type: 'sidebar' })}
               onDragLeave={(e) => onDragLeave(e, { type: 'sidebar' })}
               onDrop={(e) => {
                 const result = onDrop(e, { type: 'sidebar' });
                 if (result.success) handleDropTaskToSidebar(result.data);
               }}>
            <AvailableTasksSidebar tasks={unassignedTasks} title="Tareas Disponibles" />
          </div>

          {/* Right Main Content - Projects */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-24 bg-card border border-border rounded-2xl shadow-sm">
                <div className="inline-flex bg-muted p-4 rounded-full mb-4">
                  <FolderKanban className="w-12 h-12 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">No hay proyectos {filterState !== 'Todos' ? filterState.toLowerCase() + 's' : ''}</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">Crea un nuevo proyecto para comenzar a organizar tus tareas agrupadamente.</p>
                <Button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}>
                  <Plus className="w-4 h-4 mr-2" /> Crear Proyecto
                </Button>
              </div>
            ) : filteredProjects.map(project => {
              const isExpanded = expandedProject === project.id;
              const stats = getProjectStats(project.id);

              return (
                <div key={project.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                  {/* Project Header Card */}
                  <div 
                    className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors ${getDropZoneClass({ type: 'project', projectId: project.id })}`}
                    onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                    onDragOver={(e) => !isExpanded && onDragOver(e, { type: 'project', projectId: project.id })}
                    onDragLeave={(e) => !isExpanded && onDragLeave(e, { type: 'project', projectId: project.id })}
                    onDrop={(e) => {
                      if (!isExpanded) {
                        const result = onDrop(e, { type: 'project', projectId: project.id });
                        if (result.success) handleDropTaskToProject(project.id, result.data);
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3.5 h-3.5 rounded-md shadow-sm shrink-0" style={{ backgroundColor: project.color || 'hsl(var(--primary))' }} />
                        <h3 className="font-heading font-semibold text-lg text-foreground truncate">{project.nombre}</h3>
                        <span className="px-2.5 py-0.5 text-[11px] font-medium bg-muted text-muted-foreground rounded-md uppercase tracking-wide">
                          {project.estado}
                        </span>
                      </div>
                      {project.descripcion && <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{project.descripcion}</p>}
                      <div className="flex items-center gap-4 max-w-md">
                        <Progress value={stats.percent} className="h-2 flex-1 bg-muted" indicatorColor={project.color} />
                        <span className="text-xs font-semibold text-muted-foreground w-12 text-right tabular-nums">{stats.percent}%</span>
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground font-medium">
                        {stats.completed} de {stats.total} tareas completadas
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <Button variant="secondary" size="sm" className="h-9 font-medium" onClick={(e) => { e.stopPropagation(); setEditingProject(project); setIsProjectModalOpen(true); }}>
                        Editar
                      </Button>
                      <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Task List Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border overflow-hidden bg-muted/10"
                      >
                        <div 
                          className={`p-5 min-h-[150px] transition-colors ${getDropZoneClass({ type: 'project', projectId: project.id })}`}
                          onDragOver={(e) => onDragOver(e, { type: 'project', projectId: project.id })}
                          onDragLeave={(e) => onDragLeave(e, { type: 'project', projectId: project.id })}
                          onDrop={(e) => {
                            const result = onDrop(e, { type: 'project', projectId: project.id });
                            if (result.success) handleDropTaskToProject(project.id, result.data);
                          }}
                        >
                          {stats.tasks.length === 0 ? (
                            <div className="h-full py-8 flex flex-col items-center justify-center text-muted-foreground">
                              <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center max-w-sm w-full bg-background/50">
                                <LayoutList className="w-8 h-8 mx-auto mb-3 opacity-40" />
                                <p className="text-sm font-medium text-foreground">Aún no hay tareas en este proyecto</p>
                                <p className="text-xs mt-1">Arrastra tareas desde el panel lateral izquierdo para asignarlas aquí.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {stats.tasks.map(task => (
                                <TaskCardInProject 
                                  key={task.id} 
                                  task={task} 
                                  projectId={project.id} 
                                  onRemove={handleRemoveTaskFromProject}
                                  onToggleStatus={handleToggleTaskStatus}
                                  onEdit={() => {}} // Hook up to DetailPanel if needed
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        project={editingProject}
        tasksCount={editingProject ? tasks.filter(t => t.proyecto_id === editingProject.id).length : 0}
        onSave={fetchData}
      />
    </>
  );
};

export default ProjectsPage;