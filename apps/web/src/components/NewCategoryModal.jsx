import React, { useState } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const PALETTE = [
  'rgb(232, 245, 233)', // green-light
  'rgb(227, 242, 253)', // blue-light
  'rgb(255, 243, 224)', // orange-light
  'rgb(252, 228, 236)', // pink-light
  'rgb(243, 229, 245)', // purple-light
  'rgb(255, 253, 231)', // yellow-light
  'rgb(224, 242, 241)', // cyan-light/teal
  'rgb(255, 235, 238)', // red-light
  'rgb(232, 234, 246)'  // indigo-light
];

const NewCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('categorias_objetivos').create({
        nombre: nombre.trim(),
        color,
        activa: true
      }, { $autoCancel: false });
      
      toast.success('Categoría creada');
      onSuccess();
      onClose();
      setNombre('');
      setColor(PALETTE[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Error al crear categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Estudio, Trabajo, Personal..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Color identificador</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label="Seleccionar color"
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryModal;