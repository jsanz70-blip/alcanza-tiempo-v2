import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ProjectForm = ({ isOpen, onClose, projectToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo',
    fecha_vencimiento: '',
    color: '#0ea5e9'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (projectToEdit) {
        setFormData({
          nombre: projectToEdit.nombre || '',
          descripcion: projectToEdit.descripcion || '',
          estado: projectToEdit.estado || 'Activo',
          fecha_vencimiento: projectToEdit.fecha_vencimiento ? projectToEdit.fecha_vencimiento.split(' ')[0] : '',
          color: projectToEdit.color || '#0ea5e9'
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          estado: 'Activo',
          fecha_vencimiento: '',
          color: '#0ea5e9'
        });
      }
      setErrors({});
    }
  }, [isOpen, projectToEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setErrors({ nombre: true });
      toast.error('El nombre del proyecto es obligatorio');
      return;
    }

    setIsSaving(true);
    
    try {
      const dataToSave = {
        ...formData,
        fecha_vencimiento: formData.fecha_vencimiento ? new Date(formData.fecha_vencimiento).toISOString() : null,
      };

      if (projectToEdit) {
        const { error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', projectToEdit.id);
          
        if (error) throw error;
        toast.success('Proyecto actualizado');
      } else {
        dataToSave.progreso = 0;
        const { error } = await supabase
          .from('projects')
          .insert(dataToSave);
          
        if (error) throw error;
        toast.success('Proyecto creado con éxito');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Error al guardar el proyecto. Verifica permisos de acceso.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {projectToEdit ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[12px] text-muted-foreground uppercase">Nombre</Label>
            <Input 
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={`bg-background border-border text-foreground ${errors.nombre ? 'input-error' : ''}`}
              placeholder="Ej. Rediseño web"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[12px] text-muted-foreground uppercase">Descripción</Label>
            <Textarea 
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              className="bg-background border-border text-foreground resize-none"
              placeholder="Descripción del proyecto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[12px] text-muted-foreground uppercase">Estado</Label>
              <Select value={formData.estado} onValueChange={(v) => handleChange('estado', v)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                  <SelectItem value="Completado">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[12px] text-muted-foreground uppercase">Vencimiento</Label>
              <Input 
                type="date"
                value={formData.fecha_vencimiento}
                onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] text-muted-foreground uppercase">Color del Proyecto</Label>
            <div className="flex gap-2 items-center">
              <Input 
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 h-12 p-1 bg-background border-border cursor-pointer rounded-md"
              />
              <Input 
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="bg-background border-border text-foreground flex-1"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {projectToEdit ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectForm;