import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import supabase from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format, addDays, subDays, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Settings2, Target, Calendar, Loader2 } from 'lucide-react';
import DailyObjectiveSlotCard from '@/components/DailyObjectiveSlotCard.jsx';
import AvailableTasksSidebar from '@/components/AvailableTasksSidebar.jsx';
import NewSlotModal from '@/components/NewSlotModal.jsx';
import EditSlotModal from '@/components/EditSlotModal.jsx';
import CategoriesModal from '@/components/CategoriesModal.jsx';
import DetailPanel from '@/components/DetailPanel.jsx';
import { filterTasksByDateExcludingCompleted, filterTasksByWeekExcludingCompleted } from '@/lib/filterTasksByDate.js';

const DailyObjectivesPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyRecord, setDailyRecord] = useState(null);
  const [franjas, setFranjas] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isNewSlotOpen, setIsNewSlotOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [slotToEdit, setSlotToEdit] = useState(null);
  
  // Task detail
  const [taskToEdit, setTaskToEdit] = useState(null);
  
  useEffect(() => {
    fetchDataForDate(selectedDate);
  }, [selectedDate]);

  const fetchDataForDate = async (date) => {
    setLoading(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Validate fecha format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        throw new Error("Formato de fecha inválido. Debe ser YYYY-MM-DD.");
      }

      const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
      const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

      const [objRes, tksRes, prjRes] = await Promise.all([
        supabase
          .from('daily_objectives')
          .select('*')
          .gte('fecha', startOfDay.toISOString())
          .lte('fecha', endOfDay.toISOString()),
        supabase
          .from('tareas')
          .select('*, projects(*)')
          .order('prioridad'),
        supabase
          .from('projects')
          .select('*')
          .order('nombre')
      ]);

      if (objRes.error) throw objRes.error;
      if (tksRes.error) throw tksRes.error;
      if (prjRes.error) throw prjRes.error;

      let currentRecord = objRes.data[0];
      const tasksRes = tksRes.data;
      const projectsRes = prjRes.data;

      // Create record if it doesn't exist
      if (!currentRecord) {
        const payload = {
          fecha: dateStr + 'T12:00:00.000Z',
          franjas: []
        };
        
        const { data, error } = await supabase
          .from('daily_objectives')
          .insert(payload)
          .select()
          .single();
          
        if (error) throw error;
        currentRecord = data;
        toast.success('Registro del día inicializado');
      }

      setDailyRecord(currentRecord);
      
      // Ensure franjas is a valid array
      let parsedFranjas = [];
      if (currentRecord.franjas) {
        try {
          parsedFranjas = typeof currentRecord.franjas === 'string' 
            ? JSON.parse(currentRecord.franjas) 
            : currentRecord.franjas;
            
          if (!Array.isArray(parsedFranjas)) parsedFranjas = [];
        } catch (e) {
          parsedFranjas = [];
        }
      }
      setFranjas(parsedFranjas);
      setAllTasks(tasksRes);
      setProjects(projectsRes);

    } catch (error) {
      console.error('Error fetching/creating daily objectives:', error);
      toast.error(`Error al inicializar registro: ${error.message || 'Error desconocido'}`);
      setDailyRecord(null);
      setFranjas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (direction) => {
    setSelectedDate(prev => direction === 'next' ? addDays(prev, 1) : subDays(prev, 1));
  };

  const updateFranjasInDB = async (newFranjas) => {
    if (!dailyRecord) return;
    try {
      const { data, error } = await supabase
        .from('daily_objectives')
        .update({
          franjas: newFranjas
        })
        .eq('id', dailyRecord.id)
        .select()
        .single();
        
      if (error) throw error;
      
      setDailyRecord(data);
      setFranjas(newFranjas);
    } catch (error) {
      console.error('Error updating franjas:', error);
      throw error;
    }
  };

  const handleOpenNewSlotModal = () => {
    if (!dailyRecord) {
      toast.error('El registro del día no está inicializado');
      return;
    }
    setIsNewSlotOpen(true);
  };

  const handleSaveSlot = async (slot) => {
    try {
      const isNew = !franjas.find(s => s.id === slot.id);
      let newFranjas;
      
      if (isNew) {
        newFranjas = [...franjas, slot].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      } else {
        newFranjas = franjas.map(s => s.id === slot.id ? slot : s).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      }
      
      await updateFranjasInDB(newFranjas);
      await fetchDataForDate(selectedDate);
    } catch (error) {
      toast.error('Error al sincronizar franjas con el servidor');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const newFranjas = franjas.filter(s => s.id !== slotId);
      await updateFranjasInDB(newFranjas);
    } catch (error) {
      toast.error('Error al eliminar franja');
    }
  };

  const handleDropTaskToSlot = async (slotId, dragData) => {
    if (!dragData || !dragData.taskId) return;
    
    const taskId = dragData.taskId;
    
    const targetSlot = franjas.find(s => s.id === slotId);
    if (targetSlot && targetSlot.tareas_ids.includes(taskId)) return;

    const newFranjas = franjas.map(slot => {
      let newTareasIds = slot.tareas_ids.filter(id => id !== taskId);
      if (slot.id === slotId) {
        newTareasIds.push(taskId);
      }
      return { ...slot, tareas_ids: newTareasIds };
    });

    try {
      await updateFranjasInDB(newFranjas);
      toast.success('Tarea asignada a la franja');
    } catch (error) {
      toast.error('Error al asignar tarea');
    }
  };

  const handleRemoveTaskFromSlot = async (slotId, taskId) => {
    const newFranjas = franjas.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, tareas_ids: slot.tareas_ids.filter(id => id !== taskId) };
      }
      return slot;
    });

    try {
      await updateFranjasInDB(newFranjas);
      toast.success('Tarea removida de la franja');
    } catch (error) {
      toast.error('Error al remover tarea');
    }
  };

  const handleDropToSidebar = async (e) => {
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      
      if (data.type === 'slot-task' && data.sourceSlotId && data.taskId) {
        await handleRemoveTaskFromSlot(data.sourceSlotId, data.taskId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDetailPanelUpdate = (updatedTask, isDeleted = false) => {
    if (isDeleted || updatedTask.estado === 'Hecho') {
      setAllTasks(prev => prev.filter(t => t.id !== updatedTask.id));
      const newFranjas = franjas.map(s => ({...s, tareas_ids: s.tareas_ids.filter(id => id !== updatedTask.id)}));
      if(JSON.stringify(newFranjas) !== JSON.stringify(franjas)) {
        updateFranjasInDB(newFranjas);
      }
    } else {
      setAllTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }
  };

  const tasksInSlotsIds = useMemo(() => {
    return new Set(franjas.flatMap(s => s.tareas_ids));
  }, [franjas]);

  const availableTasksToday = useMemo(() => {
    return filterTasksByDateExcludingCompleted(allTasks, selectedDate)
      .filter(t => !tasksInSlotsIds.has(t.id));
  }, [allTasks, selectedDate, tasksInSlotsIds]);

  const availableTasksWeek = useMemo(() => {
    const todayIds = new Set(availableTasksToday.map(t => t.id));
    return filterTasksByWeekExcludingCompleted(allTasks, selectedDate)
      .filter(t => !tasksInSlotsIds.has(t.id) && !todayIds.has(t.id));
  }, [allTasks, selectedDate, tasksInSlotsIds, availableTasksToday]);

  const getTaskData = (taskId) => allTasks.find(t => t.id === taskId);

  return (
    <>
      <Helmet>
        <title>Objetivos del Día - Gestor de Tareas</title>
        <meta name="description" content="Organiza tu día en franjas horarias y asigna tareas." />
      </Helmet>
      
      <div className="min-h-screen bg-background pb-24 lg:pb-6">
        <div className="sticky top-0 z-40 bg-popover border-b border-border shadow-sm">
          <div className="px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-heading font-bold text-foreground">Objetivos del Día</h1>
              {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin ml-2" />}
            </div>
            
            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-2 sm:gap-4">
              <div className="flex items-center bg-card border border-border rounded-lg p-1">
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('prev')} disabled={loading} className="h-7 w-7 text-muted-foreground">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 px-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-[13px] font-semibold min-w-[100px] text-center capitalize">
                    {format(selectedDate, "EEEE d MMM", { locale: es })}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDateChange('next')} disabled={loading} className="h-7 w-7 text-muted-foreground">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setIsCategoriesOpen(true)} disabled={loading} className="h-9 w-9 bg-card border-border" title="Categorías">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button onClick={handleOpenNewSlotModal} disabled={loading || !dailyRecord} className="h-9 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-[13px]">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Nueva Franja</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-[1600px] mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Timeline / Slots */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-2">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-[120px] w-full rounded-2xl" />
                  ))}
                </div>
              ) : franjas.length === 0 ? (
                <div className="text-center py-20 bg-card/50 border border-border border-dashed rounded-2xl flex flex-col items-center">
                  <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay franjas horarias configuradas</h3>
                  <p className="text-sm text-muted-foreground max-w-md mb-6">
                    Organiza tu día en bloques de tiempo (ej. Deep Work, Reuniones) y arrastra tareas a cada bloque para estructurar tu jornada.
                  </p>
                  <Button onClick={handleOpenNewSlotModal} disabled={!dailyRecord}>
                    <Plus className="w-4 h-4 mr-2" /> Crear primera franja
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {franjas.map(slot => {
                    const slotTasks = slot.tareas_ids
                      .map(id => getTaskData(id))
                      .filter(Boolean);

                    return (
                      <DailyObjectiveSlotCard
                        key={slot.id}
                        slot={slot}
                        tasks={slotTasks}
                        onEditSlot={setSlotToEdit}
                        onRemoveTask={handleRemoveTaskFromSlot}
                        onDropTask={handleDropTaskToSlot}
                        onEditTask={setTaskToEdit}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Available Tasks */}
            <div 
              className="lg:col-span-4 xl:col-span-3 space-y-6 pb-20"
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={handleDropToSidebar}
            >
              <div className="sticky top-[80px]">
                <AvailableTasksSidebar 
                  tasks={availableTasksToday}
                  projects={projects}
                  title="Tareas de Hoy"
                />
                <AvailableTasksSidebar 
                  tasks={availableTasksWeek}
                  projects={projects}
                  title="Resto de la Semana"
                />
              </div>
            </div>

          </div>
        </main>
      </div>

      {isNewSlotOpen && (
        <NewSlotModal 
          isOpen={isNewSlotOpen}
          onClose={() => setIsNewSlotOpen(false)}
          onSave={handleSaveSlot}
          existingSlots={franjas}
          dailyObjectiveId={dailyRecord?.id}
        />
      )}

      {slotToEdit && (
        <EditSlotModal 
          isOpen={!!slotToEdit}
          onClose={() => setSlotToEdit(null)}
          slot={slotToEdit}
          onSave={handleSaveSlot}
          onDelete={handleDeleteSlot}
          existingSlots={franjas}
        />
      )}

      <CategoriesModal 
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
      />

      {taskToEdit && (
        <DetailPanel
          task={taskToEdit}
          isOpen={!!taskToEdit}
          onClose={() => setTaskToEdit(null)}
          onUpdate={handleDetailPanelUpdate}
        />
      )}
    </>
  );
};

export default DailyObjectivesPage;