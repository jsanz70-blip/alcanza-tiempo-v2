import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';

const PALETTE = [
  '#E8F5E9', '#E3F2FD', '#FFF3E0', 
  '#FCE4EC', '#F3E5F5', '#FFFDE7', 
  '#E0F2F1', '#FFEBEE', '#E8EAF6'
];

const EditSlotModal = ({ isOpen, onClose, slot, onSave, onDelete, existingSlots = [] }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    hora_inicio: '',
    hora_fin: '',
    color: '',
    categoria: ''
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && slot) {
      fetchCategories();
      setFormData({
        nombre: slot.nombre || '',
        hora_inicio: slot.hora_inicio || '',
        hora_fin: slot.hora_fin || '',
        color: slot.color || PALETTE[0],
        categoria: slot.categoria || ''
      });
    }
  }, [isOpen, slot]);

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categorias_objetivos').getFullList({
        filter: 'activa = true',
        sort: 'nombre',
        $autoCancel: false
      });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      // 1. Update the time_slot record in PocketBase with all fields including categoria
      await pb.collection('time_slots').update(slot.id, {
        name: formData.nombre.trim(),
        start_time: formData.hora_inicio,
        end_time: formData.hora_fin,
        color: formData.color,
        categoria: formData.categoria
      }, { $autoCancel: false });

      // 2. Update the franja object in daily_objectives.franjas JSON
      const updatedSlot = {
        ...slot,
        nombre: formData.nombre.trim(),
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        color: formData.color,
        categoria: formData.categoria
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
            <Label>Categoría</Label>
            <Select value={formData.categoria} onValueChange={(v) => handleChange('categoria', v)} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c.id} value={c.nombre}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Color de fondo</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSlotModal;