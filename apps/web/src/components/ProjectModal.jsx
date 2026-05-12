import React, { useState } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

const ProjectModal = ({ isOpen, onClose, onSave, project = null, tasksCount = 0 }) => {
  const [formData, setFormData] = useState({
    nombre: project?.nombre || '',
    descripcion: project?.descripcion || '',
    color: project?.color || 'hsl(var(--color-blue-light))',
    estado: project?.estado || 'Activo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Soft palette options
  const colorOptions = [
    'hsl(var(--color-green-light))', 'hsl(var(--color-blue-light))', 
    'hsl(var(--color-orange-light))', 'hsl(var(--color-pink-light))', 
    'hsl(var(--color-purple-light))', 'hsl(var(--color-yellow-light))',
    'hsl(var(--color-cyan-light))', 'hsl(var(--color-red-light))'
  ];

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      let saved;
      if (project) {
        saved = await pb.collection('projects').update(project.id, formData, { $autoCancel: false });
        toast.success('Proyecto actualizado');
      } else {
        saved = await pb.collection('projects').create(formData, { $autoCancel: false });
        toast.success('Proyecto creado');
      }
      onSave(saved);
      onClose();
    } catch (error) {
      toast.error('Error al guardar el proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar el proyecto "${project.nombre}"? Las tareas asignadas quedarán sin proyecto.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      // First unassign all tasks (PocketBase relations often set to null automatically, but good practice to be sure or let PB handle it if relation is not required)
      await pb.collection('projects').delete(project.id, { $autoCancel: false });
      toast.success('Proyecto eliminado');
      onSave();
      onClose();
    } catch (error) {
      toast.error('Error al eliminar el proyecto');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && !isDeleting && onClose(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Proyecto</Label>
            <Input 
              id="nombre" 
              placeholder="Ej. Rediseño Web" 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (Opcional)</Label>
            <Input 
              id="descripcion" 
              placeholder="Breve descripción del objetivo" 
              value={formData.descripcion} 
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <Label>Color Identificativo</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setFormData({...formData, color: c})}
                  aria-label="Seleccionar color"
                />
              ))}
            </div>
          </div>

          {project && (
            <>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={formData.estado} onValueChange={(v) => setFormData({...formData, estado: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Pausado">Pausado</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                Este proyecto tiene <strong>{tasksCount}</strong> {tasksCount === 1 ? 'tarea asignada' : 'tareas asignadas'}.
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex sm:justify-between items-center">
          {project ? (
            <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isSubmitting || isDeleting} title="Eliminar proyecto">
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          ) : <div></div>}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting || isDeleting}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isDeleting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {project ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;