import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Loader2, FolderKanban } from 'lucide-react';
import ProjectForm from './ProjectForm.jsx';

const ProjectSelectionDialog = ({ isOpen, onClose, onConfirm }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('nombre');
        
      if (error) throw error;
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Error al cargar proyectos');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedProjectId) {
      toast.error('Selecciona un proyecto primero');
      return;
    }
    onConfirm(selectedProjectId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[425px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Seleccionar Proyecto</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-[13px] text-muted-foreground mb-4">
              Las tareas puntuales deben estar asociadas a un proyecto. Selecciona uno:
            </p>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-6 bg-card rounded-lg border border-border">
                <FolderKanban className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-[13px] text-muted-foreground">No hay proyectos disponibles</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px] rounded-md border border-border bg-card/50 p-2">
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div 
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                        selectedProjectId === project.id 
                          ? 'bg-primary/10 border-primary shadow-sm' 
                          : 'bg-card border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: project.color || '#0ea5e9' }}
                      />
                      <span className="text-[14px] font-medium text-foreground">{project.nombre}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="mt-4 flex justify-center">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full text-[13px]"
                onClick={() => setIsProjectFormOpen(true)}
              >
                Crear nuevo proyecto
              </Button>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}
              disabled={!selectedProjectId || loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProjectForm 
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSuccess={fetchProjects}
      />
    </>
  );
};

export default ProjectSelectionDialog;