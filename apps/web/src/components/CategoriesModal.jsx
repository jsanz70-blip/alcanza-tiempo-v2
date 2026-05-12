import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import NewCategoryModal from './NewCategoryModal.jsx';

const CategoriesModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [isNewCatOpen, setIsNewCatOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, showInactive]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const filter = showInactive ? '' : 'activa = true';
      const records = await pb.collection('categorias_objetivos').getFullList({
        filter,
        sort: '-created',
        $autoCancel: false
      });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await pb.collection('categorias_objetivos').update(id, {
        activa: !currentStatus
      }, { $autoCancel: false });
      
      if (!showInactive && currentStatus) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        setCategories(categories.map(c => c.id === id ? { ...c, activa: !currentStatus } : c));
      }
      toast.success(currentStatus ? 'Categoría desactivada' : 'Categoría activada');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error al actualizar categoría');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center pr-4">
              <span>Categorías de Franjas</span>
              <Button size="sm" onClick={() => setIsNewCatOpen(true)} className="h-8">
                <Plus className="w-4 h-4 mr-1" /> Nueva
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2 py-2 border-b border-border shrink-0">
            <Switch 
              id="show-inactive" 
              checked={showInactive} 
              onCheckedChange={setShowInactive} 
            />
            <Label htmlFor="show-inactive" className="text-sm font-medium">
              Mostrar categorías inactivas
            </Label>
          </div>

          <div className="flex-1 overflow-y-auto py-4 scrollbar-hide space-y-2">
            {loading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No hay categorías. Crea la primera.
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className={`flex items-center justify-between p-3 rounded-lg border ${cat.activa ? 'bg-card border-border' : 'bg-muted/50 border-transparent opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-sm" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium text-sm">{cat.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">
                      {cat.activa ? 'Activa' : 'Inactiva'}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleToggleActive(cat.id, cat.activa)}
                      title={cat.activa ? "Desactivar" : "Activar"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <NewCategoryModal 
        isOpen={isNewCatOpen} 
        onClose={() => setIsNewCatOpen(false)} 
        onSuccess={fetchCategories}
      />
    </>
  );
};

export default CategoriesModal;