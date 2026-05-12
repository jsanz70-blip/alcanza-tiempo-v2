import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react';
import ProjectForm from '@/components/ProjectForm.jsx';
import { toast } from 'sonner';

const ProjectManager = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setProjectToEdit(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este proyecto?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        setProjects(projects.filter(p => p.id !== id));
        toast.success('Proyecto eliminado');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Error al eliminar proyecto');
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col bg-popover border-border">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-foreground flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-primary" />
              Gestión de Proyectos
            </DialogTitle>
            <Button onClick={handleCreate} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-1" /> Nuevo
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-2 scrollbar-hide">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">No hay proyectos creados</p>
                <Button onClick={handleCreate} variant="link" className="mt-2 text-primary">Crear el primero</Button>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-card border border-border p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: project.color || '#0ea5e9' }}
                    />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{project.nombre}</h4>
                      <p className="text-xs text-muted-foreground flex gap-2">
                        <span>{project.estado}</span>
                        <span>•</span>
                        <span>{project.progreso || 0}% completado</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} className="text-muted-foreground hover:text-primary h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-muted-foreground hover:text-destructive h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ProjectForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        projectToEdit={projectToEdit}
        onSuccess={fetchProjects}
      />
    </>
  );
};

export default ProjectManager;