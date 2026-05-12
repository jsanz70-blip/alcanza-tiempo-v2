import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PhaseModal = ({ isOpen, onClose, onSave, projectId, phase = null }) => {
  const [formData, setFormData] = useState({
    nombre: phase?.nombre || '',
    descripcion: phase?.descripcion || '',
    color: phase?.color || 'hsl(var(--color-green-light))',
    estado: phase?.estado || 'Pendiente',
    orden: phase?.orden || 0,
    proyecto_id: projectId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      let data, error;
      if (phase) {
        const response = await supabase
          .from('project_phases')
          .update(formData)
          .eq('id', phase.id)
          .select()
          .single();
        data = response.data;
        error = response.error;
        toast.success('Fase actualizada');
      } else {
        const response = await supabase
          .from('project_phases')
          .insert(formData)
          .select()
          .single();
        data = response.data;
        error = response.error;
        toast.success('Fase creada');
      }
      
      if (error) throw error;
      
      onSave(data);
      onClose();
    } catch (error) {
      toast.error('Error al guardar la fase');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{phase ? 'Editar Fase' : 'Nueva Fase'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.estado} onValueChange={(v) => setFormData({...formData, estado: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseModal;