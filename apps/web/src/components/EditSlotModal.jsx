import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

const PALETTE = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1'  // Indigo
];

const EditSlotModal = ({ isOpen, onClose, slot, onSave, onDelete, existingSlots = [] }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    hora_inicio: '',
    hora_fin: '',
    color: '',
    proyecto_id: 'none'
  });
  const [projects, setProjects] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && slot) {
      fetchProjects();
      setFormData({
        nombre: slot.nombre || '',
        hora_inicio: slot.hora_inicio || '',
        hora_fin: slot.hora_fin || '',
        color: slot.color || PALETTE[0],
        proyecto_id: slot.proyecto_id || 'none'
      });
    }
  }, [isOpen, slot]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('nombre');
        
      if (error) throw error;
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre de la franja es requerido');
      return;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      toast.error('La hora de fin debe ser posterior a la de inicio');
      return;
    }

    const otherSlots = existingSlots.filter(s => s.id !== slot.id);
    const hasOverlap = otherSlots.some(s => {
      return (formData.hora_inicio >= s.hora_inicio && formData.hora_inicio < s.hora_fin) ||
             (formData.hora_fin > s.hora_inicio && formData.hora_fin <= s.hora_fin) ||
             (formData.hora_inicio <= s.hora_inicio && formData.hora_fin >= s.hora_fin);
    });

    if (hasOverlap) {
      toast.error('El horario se superpone con otra franja existente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedProject = projects.find(p => p.id === formData.proyecto_id);

      const updatedSlot = {
        ...slot,
        nombre: formData.nombre.trim(),
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        color: formData.color,
        proyecto_id: formData.proyecto_id === 'none' ? null : formData.proyecto_id,
        proyecto_nombre: selectedProject ? selectedProject.nombre : null,
        categoria: selectedProject ? selectedProject.nombre : null // keep for backward compatibility
      };

      await onSave(updatedSlot);
      toast.success('Franja actualizada');
      onClose();
    } catch (error) {
      console.error('Error saving slot:', error);
      toast.error(`Error al actualizar franja: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('¿Seguro que deseas eliminar esta franja? Las tareas volverán a estar sin asignar.')) {
      setIsSubmitting(true);
      onDelete(slot.id).then(() => {
        toast.success('Franja eliminada');
        onClose();
      }).catch((error) => {
        toast.error(`Error al eliminar franja: ${error.message || 'Error desconocido'}`);
      }).finally(() => {
        setIsSubmitting(false);
      });
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Franja Horaria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre del objetivo/bloque</Label>
            <Input 
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hora Inicio</Label>
              <Input 
                type="time" 
                value={formData.hora_inicio}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora Fin</Label>
              <Input 
                type="time" 
                value={formData.hora_fin}
                onChange={(e) => handleChange('hora_fin', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Asociar a Proyecto</Label>
            <Select value={formData.proyecto_id} onValueChange={(v) => handleChange('proyecto_id', v)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin proyecto</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color de la franja</Label>
            <div className="flex flex-wrap gap-3 mt-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-9 h-9 rounded-full border-2 transition-all ${formData.color === c ? 'border-primary scale-110 shadow-md ring-2 ring-primary/20' : 'border-transparent hover:scale-105 shadow-sm'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => !isSubmitting && handleChange('color', c)}
                  aria-label="Seleccionar color"
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center w-full">
          <Button variant="destructive" size="sm" onClick={handleDeleteClick} disabled={isSubmitting}>
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Cambios
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSlotModal;