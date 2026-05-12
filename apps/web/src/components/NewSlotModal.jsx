import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PALETTE = [
  '#E8F5E9', '#E3F2FD', '#FFF3E0', 
  '#FCE4EC', '#F3E5F5', '#FFFDE7', 
  '#E0F2F1', '#FFEBEE', '#E8EAF6'
];

const NewSlotModal = ({ isOpen, onClose, onSave, existingSlots = [], dailyObjectiveId }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    hora_inicio: '09:00',
    hora_fin: '10:00',
    color: PALETTE[0],
    categoria: ''
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setFormData({
        nombre: '',
        hora_inicio: '09:00',
        hora_fin: '10:00',
        color: PALETTE[0],
        categoria: ''
      });
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const records = await pb.collection('categorias_objetivos').getFullList({
        filter: 'activa = true',
        sort: 'nombre',
        $autoCancel: false
      });
      setCategories(records);
      if (records.length > 0 && !formData.categoria) {
        setFormData(prev => ({ ...prev, categoria: records[0].nombre }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.nombre || !formData.nombre.trim()) {
      toast.error('El nombre de la franja es requerido');
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!formData.hora_inicio || !timeRegex.test(formData.hora_inicio)) {
      toast.error('La hora de inicio debe estar en formato HH:MM válido');
      return;
    }
    
    if (!formData.hora_fin || !timeRegex.test(formData.hora_fin)) {
      toast.error('La hora de fin debe estar en formato HH:MM válido');
      return;
    }

    if (formData.hora_inicio >= formData.hora_fin) {
      toast.error('La hora de fin debe ser posterior a la de inicio');
      return;
    }

    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!formData.color || !hexRegex.test(formData.color)) {
      toast.error('El color debe ser un código hexadecimal válido (ej. #E8F5E9)');
      return;
    }

    if (!dailyObjectiveId) {
      toast.error('Error interno: no se ha encontrado el registro del objetivo del día');
      return;
    }

    // Overlap check
    const hasOverlap = existingSlots.some(slot => {
      return (formData.hora_inicio >= slot.hora_inicio && formData.hora_inicio < slot.hora_fin) ||
             (formData.hora_fin > slot.hora_inicio && formData.hora_fin <= slot.hora_fin) ||
             (formData.hora_inicio <= slot.hora_inicio && formData.hora_fin >= slot.hora_fin);
    });

    if (hasOverlap) {
      toast.error('El horario se superpone con otra franja existente');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create time_slot in PocketBase collection with categoria field
      const timeSlotPayload = {
        name: formData.nombre.trim(),
        start_time: formData.hora_inicio,
        end_time: formData.hora_fin,
        color: formData.color,
        categoria: formData.categoria,
        daily_objectives_id: dailyObjectiveId
      };

      const createdSlot = await pb.collection('time_slots').create(timeSlotPayload, { $autoCancel: false });

      // 2. Prepare JSON formatted slot to update daily_objectives.franjas
      const newFranjaSlot = {
        id: createdSlot.id,
        nombre: timeSlotPayload.name,
        hora_inicio: timeSlotPayload.start_time,
        hora_fin: timeSlotPayload.end_time,
        color: timeSlotPayload.color,
        categoria: timeSlotPayload.categoria,
        tareas_ids: [],
        orden: existingSlots.length
      };

      await onSave(newFranjaSlot);
      toast.success(`Franja ${timeSlotPayload.name} creada exitosamente`);
      onClose();
    } catch (error) {
      console.error('Error in NewSlotModal:', error);
      toast.error(`Error al crear franja: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Franja Horaria</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre de la franja <span className="text-destructive">*</span></Label>
            <Input 
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej. Deep Work, Reuniones..."
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hora Inicio <span className="text-destructive">*</span></Label>
              <Input 
                type="time" 
                value={formData.hora_inicio}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Hora Fin <span className="text-destructive">*</span></Label>
              <Input 
                type="time" 
                value={formData.hora_fin}
                onChange={(e) => handleChange('hora_fin', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría (Opcional)</Label>
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
            <Label>Color de fondo <span className="text-destructive">*</span></Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === c ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => !isSubmitting && handleChange('color', c)}
                  aria-label={`Seleccionar color ${c}`}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? 'Guardando...' : 'Crear Franja'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSlotModal;