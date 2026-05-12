import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Save, Trash2, Loader2, FolderKanban, Plus, X, Bell, History, CheckCircle } from 'lucide-react';
import ProjectForm from './ProjectForm.jsx';
import { useRecurrence } from '@/hooks/useRecurrence.js';

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const CATEGORIES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const BLOQUES = ['Finanzas', 'Operación', 'Administración', 'Ventas', 'Estrategia', 'Sistemas', 'Desarrollo', 'Personal'];
const FREQUENCIES = ['Diaria', 'Semanal', 'Mensual', 'Puntual', 'Meta'];
const PRIORITIES = ['Alta', 'Media', 'Baja'];
const ESTADOS = ['Pendiente', 'En curso', 'Esperando', 'Hecho'];
const RECURRENCE_TYPES = ['Sin recurrencia', 'Diaria', 'Semanal', 'Quincenal', 'Mensual', 'Semestral', 'Anual'];

const DetailPanel = ({ task, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const { calculateNextDate } = useRecurrence();

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (task && !task.isNew) {
        const extractedDay = WEEK_DAYS.find(d => task.notas?.includes(d)) || '';
        const cleanNotas = task.notas ? task.notas.replace(extractedDay, '').replace(/^- | - $/g, '').trim() : '';
        
        setFormData({
          tarea: task.tarea || '',
          categoria_codigo: task.categoria_codigo || 'A',
          bloque: task.bloque || 'Operación',
          frecuencia: task.frecuencia || 'Diaria',
          prioridad: task.prioridad || 'Media',
          estado: task.estado || 'Pendiente',
          semana_actual: task.semana_actual || false,
          notas: cleanNotas,
          selectedDay: extractedDay,
          proyecto_id: task.proyecto_id || 'none',
          fecha_vencimiento: task.fecha_vencimiento ? task.fecha_vencimiento.split('T')[0] : '',
          tipo_recurrencia: task.tipo_recurrencia || 'Sin recurrencia',
          hora_alarma: task.hora_alarma || '09:00',
          alarmas_historial: task.alarmas_historial || []
        });
        setAlarmEnabled(!!task.hora_alarma);
      } else {
        setFormData({
          tarea: '',
          categoria_codigo: 'A',
          bloque: 'Operación',
          frecuencia: 'Puntual',
          prioridad: 'Media',
          estado: 'Pendiente',
          semana_actual: false,
          notas: '',
          selectedDay: '',
          proyecto_id: 'none',
          fecha_vencimiento: '',
          tipo_recurrencia: 'Sin recurrencia',
          hora_alarma: '09:00',
          alarmas_historial: []
        });
        setAlarmEnabled(false);
      }
      setErrors({});
      setShowHistory(false);
    }
  }, [task, isOpen]);

  const fetchProjects = async () => {
    try {
      const records = await pb.collection('projects').getFullList({ filter: 'estado="Activo"', sort: 'nombre', $autoCancel: false });
      setProjects(records);
    } catch (e) {
      console.error('Error fetching projects:', e);
    }
  };

  const handleProjectCreated = async () => {
    await fetchProjects();
  };

  if (!task && !isOpen) return null;

  const handleChange = (field, value) => {
    if (field === 'proyecto_id' && value === 'new_project') {
      setIsProjectFormOpen(true);
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'frecuencia' && value !== 'Semanal') {
        newData.selectedDay = '';
      }
      if (field === 'fecha_vencimiento' && !value) {
        setAlarmEnabled(false);
      }
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleTestAlarm = () => {
    if (!formData.tarea || !formData.fecha_vencimiento || !formData.hora_alarma) {
      toast.error('Configura la tarea, fecha y hora primero');
      return;
    }
    const mockTask = {
      id: task?.id || 'mock-id',
      tarea: formData.tarea,
      fecha_vencimiento: formData.fecha_vencimiento,
      hora_alarma: formData.hora_alarma,
      estado: formData.estado
    };
    window.dispatchEvent(new CustomEvent('TEST_ALARM', { detail: mockTask }));
  };

  const handleSave = async () => {
    if (!formData.tarea || !formData.tarea.trim()) {
      setErrors({ tarea: true });
      toast.error('El nombre de la tarea no puede estar vacío');
      return;
    }

    if (alarmEnabled) {
      if (!formData.fecha_vencimiento) {
        toast.error('La alarma requiere una fecha de vencimiento configurada');
        return;
      }
      if (!formData.hora_alarma || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.hora_alarma)) {
        toast.error('Formato de hora de alarma inválido (HH:MM)');
        return;
      }
    }

    setIsSaving(true);
    
    let finalNotas = formData.notas || '';
    if (formData.frecuencia === 'Semanal' && formData.selectedDay) {
      finalNotas = finalNotas ? `${finalNotas} - ${formData.selectedDay}` : formData.selectedDay;
    }

    const dataToSave = {
      tarea: formData.tarea.trim(),
      categoria_codigo: formData.categoria_codigo || 'A',
      categoria_nombre: formData.categoria_codigo || 'A',
      bloque: formData.bloque || 'Operación',
      frecuencia: formData.frecuencia || 'Puntual',
      prioridad: formData.prioridad || 'Media',
      estado: formData.estado || 'Pendiente',
      semana_actual: formData.semana_actual || false,
      notas: finalNotas,
      proyecto_id: formData.proyecto_id === 'none' ? null : formData.proyecto_id,
      fecha_vencimiento: formData.fecha_vencimiento ? new Date(formData.fecha_vencimiento).toISOString() : "",
      tipo_recurrencia: (!formData.tipo_recurrencia || formData.tipo_recurrencia === 'Sin recurrencia') ? "" : formData.tipo_recurrencia,
      hora_alarma: alarmEnabled ? formData.hora_alarma : "",
      alarmas_historial: formData.alarmas_historial || []
    };

    try {
      if (task && !task.isNew) {
        const isCompleting = dataToSave.estado === 'Hecho' && task.estado !== 'Hecho';
        
        if (isCompleting) {
          if (dataToSave.tipo_recurrencia && dataToSave.tipo_recurrencia !== 'Sin recurrencia' && dataToSave.fecha_vencimiento) {
            const nextDate = calculateNextDate(dataToSave.fecha_vencimiento, dataToSave.tipo_recurrencia);
            
            const newTaskData = {
              ...dataToSave,
              numero: Math.floor(100000 + Math.random() * 900000).toString(),
              estado: 'Pendiente',
              fecha_vencimiento: nextDate,
              alarmas_historial: []
            };
            
            await pb.collection('tareas').create(newTaskData, { $autoCancel: false });
            toast.success(`Tarea recurrente creada para ${new Date(nextDate).toLocaleDateString()}`);
          } else {
            toast.success('Tarea completada');
          }
        } else {
          toast.success('Tarea actualizada');
        }

        const updated = await pb.collection('tareas').update(task.id, dataToSave, { $autoCancel: false });
        onUpdate(updated);
      } else {
        dataToSave.numero = Math.floor(100000 + Math.random() * 900000).toString();
        const created = await pb.collection('tareas').create(dataToSave, { $autoCancel: false });
        onUpdate(created);
        toast.success('Tarea creada');
      }
      onClose(false);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error('Error al guardar tarea');
      if (task && !task.isNew) onUpdate(task);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (task?.isNew) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setIsDeleting(true);
      try {
        await pb.collection('tareas').delete(task.id, { $autoCancel: false });
        toast.success('Tarea eliminada');
        onUpdate(task, true);
        onClose(false);
      } catch (err) {
        console.error('Error deleting task:', err);
        toast.error('Error al eliminar tarea');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const showProjectField = ['Puntual', 'Meta'].includes(formData.frecuencia);
  const selectedProject = projects.find(p => p.id === formData.proyecto_id);

  const getStatusText = () => {
    if (!formData.fecha_vencimiento) return 'Sin fecha';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(formData.fecha_vencimiento);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Vencida';
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return 'Vence mañana';
    return `Vence en ${diffDays} días`;
  };

  const nextRecurrenceDate = formData.fecha_vencimiento && formData.tipo_recurrencia && formData.tipo_recurrencia !== 'Sin recurrencia' 
    ? calculateNextDate(new Date(formData.fecha_vencimiento).toISOString(), formData.tipo_recurrencia)
    : null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 bg-popover border-l border-border flex flex-col h-full overflow-hidden">
          
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border shrink-0 pr-12 bg-card">
            <SheetHeader className="text-left">
              <SheetTitle className="font-heading text-[18px] text-foreground flex items-center gap-2">
                {task?.isNew ? 'Nueva tarea' : 'Editar tarea'}
                {!task?.isNew && task?.numero && (
                  <span className="text-[12px] font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-md border border-border">
                    #{task.numero}
                  </span>
                )}
              </SheetTitle>
            </SheetHeader>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Nombre de la tarea</Label>
              <Input 
                value={formData.tarea || ''}
                onChange={(e) => handleChange('tarea', e.target.value)}
                className={`h-[48px] bg-background border-border text-[14px] text-foreground placeholder:text-muted-foreground ${errors.tarea ? 'border-destructive focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                placeholder="Ej. Revisar correos"
                autoFocus={task?.isNew}
              />
              {errors.tarea && <p className="text-xs text-destructive">Requerido</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Fecha de Vencimiento</Label>
                <div className="flex gap-2">
                  <Input 
                    type="date"
                    value={formData.fecha_vencimiento || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('fecha_vencimiento', e.target.value)}
                    className="h-[48px] bg-background border-border text-[14px] text-foreground flex-1"
                  />
                  {formData.fecha_vencimiento && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleChange('fecha_vencimiento', '')}
                      className="h-[48px] w-[48px] flex-shrink-0 text-muted-foreground hover:text-foreground border-border hover:bg-muted"
                      title="Limpiar fecha"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{getStatusText()}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Recurrencia</Label>
                <Select value={formData.tipo_recurrencia || 'Sin recurrencia'} onValueChange={(v) => handleChange('tipo_recurrencia', v)}>
                  <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCE_TYPES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.tipo_recurrencia && formData.tipo_recurrencia !== 'Sin recurrencia' && (
                  <p className="text-[11px] text-muted-foreground">
                    Se repetirá cada {formData.tipo_recurrencia.toLowerCase()}
                    {nextRecurrenceDate && <><br/>Siguiente: {new Date(nextRecurrenceDate).toLocaleDateString()}</>}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 bg-card rounded-xl border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex flex-col">
                  <Label className="text-[14px] font-medium text-foreground flex items-center gap-2">
                    <Bell className={`w-4 h-4 ${alarmEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    Alarma
                  </Label>
                  <p className="text-[12px] text-muted-foreground">Notificar antes de vencer</p>
                </div>
                <Switch 
                  checked={alarmEnabled}
                  onCheckedChange={(checked) => {
                    if (checked && !formData.fecha_vencimiento) {
                      toast.error('Agrega una fecha de vencimiento primero');
                      return;
                    }
                    setAlarmEnabled(checked);
                  }}
                />
              </div>

              {alarmEnabled && (
                <div className="pt-2 animate-fade-in grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Hora</Label>
                    <Input 
                      type="time" 
                      value={formData.hora_alarma || '09:00'}
                      onChange={(e) => handleChange('hora_alarma', e.target.value)}
                      className="h-[44px] bg-background border-border text-[14px] text-foreground"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <Button 
                      variant="outline" 
                      onClick={handleTestAlarm}
                      className="w-full h-[44px] border-border text-foreground hover:bg-muted"
                    >
                      Probar alarma
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {showProjectField && (
              <div className="space-y-2 p-3 bg-card border border-border rounded-xl">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <FolderKanban className="w-3 h-3" /> Proyecto Asociado
                </Label>
                <div className="flex items-center gap-2">
                  {selectedProject && (
                    <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: selectedProject.color }} />
                  )}
                  <Select value={formData.proyecto_id || 'none'} onValueChange={(v) => handleChange('proyecto_id', v)}>
                    <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground flex-1">
                      <SelectValue placeholder="Seleccionar proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin proyecto asignado</SelectItem>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                            {p.nombre}
                          </div>
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 mt-1 border-t border-border">
                        <SelectItem value="new_project" className="text-primary font-medium focus:text-primary focus:bg-primary/10">
                          <div className="flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Crear nuevo proyecto
                          </div>
                        </SelectItem>
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Categoría</Label>
                <Select value={formData.categoria_codigo || 'A'} onValueChange={(v) => handleChange('categoria_codigo', v)}>
                  <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Prioridad</Label>
                <Select value={formData.prioridad || 'Media'} onValueChange={(v) => handleChange('prioridad', v)}>
                  <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(pri => (
                      <SelectItem key={pri} value={pri}>{pri}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Bloque</Label>
                <Select value={formData.bloque || 'Operación'} onValueChange={(v) => handleChange('bloque', v)}>
                  <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOQUES.map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Frecuencia</Label>
                <Select value={formData.frecuencia || 'Diaria'} onValueChange={(v) => handleChange('frecuencia', v)}>
                  <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Estado</Label>
              <Select value={formData.estado || 'Pendiente'} onValueChange={(v) => handleChange('estado', v)}>
                <SelectTrigger className="h-[48px] bg-background border-border text-[14px] text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Notas adicionales</Label>
              <Textarea 
                value={formData.notas || ''}
                onChange={(e) => handleChange('notas', e.target.value)}
                placeholder="Agregar notas..."
                rows={3}
                className="resize-none bg-background border-border focus-visible:ring-primary text-[14px] text-foreground placeholder:text-muted-foreground p-3 min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="p-4 sm:p-6 border-t border-border bg-card shrink-0 flex flex-col gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isDeleting}
              className="w-full h-[48px] text-[14px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              {isSaving ? 'Guardando...' : 'Guardar tarea'}
            </Button>
            
            <div className={`grid ${task?.isNew ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
              <Button 
                variant="outline"
                onClick={() => onClose(false)}
                disabled={isSaving || isDeleting}
                className="h-[48px] text-[14px] bg-background border-border hover:bg-muted text-foreground"
              >
                Cancelar
              </Button>
              {!task?.isNew && (
                <Button 
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSaving || isDeleting}
                  className="h-[48px] text-[14px] font-medium"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Trash2 className="w-5 h-5 mr-2" />}
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ProjectForm 
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </>
  );
};

export default DetailPanel;