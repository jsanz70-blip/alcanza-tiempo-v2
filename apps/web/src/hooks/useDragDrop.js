import { useState, useCallback } from 'react';

export const useDragDrop = () => {
  const [draggingId, setDraggingId] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [isValidDrop, setIsValidDrop] = useState(false);

  const validateDrop = useCallback((source, target) => {
    if (!source || !target) return false;
    
    // Cross-section specific rules
    if (source.type === 'task' && target.type === 'project') return true;
    if (source.type === 'task' && target.type === 'sidebar') return true; // to unassign
    if (source.type === 'kanban' && target.type === 'kanban') return true;
    if (source.type === 'week' && target.type === 'week') return true;
    if (source.type === 'project' && target.type === 'project') return true;
    
    // Today page specific rules: allowing recurring <-> oneTime
    if ((source.type === 'recurrentes' || source.type === 'puntuales') && 
        (target.type === 'recurrentes' || target.type === 'puntuales')) {
      return true;
    }
    
    if ((source.type === 'recurrentes' || source.type === 'puntuales') && 
        (target.type === 'week-drop' || target.type === 'puntuales-drop' || target.type === 'recurrentes-drop')) {
      return true;
    }

    return source.type === target.type;
  }, []);

  const onDragStart = useCallback((event, taskId, sourceData) => {
    const data = { taskId, source: sourceData };
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
    
    setDraggingId(taskId);
    setDragSource(sourceData);

    setTimeout(() => {
      if (event.target && event.target.classList) {
        event.target.classList.add('dragging');
      }
    }, 0);
  }, []);

  const onDragOver = useCallback((event, targetData) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    setDragOverTarget(targetData);
    setIsValidDrop(validateDrop(dragSource, targetData));
  }, [dragSource, validateDrop]);

  const onDragLeave = useCallback((event, targetData) => {
    event.preventDefault();
    setDragOverTarget(null);
    setIsValidDrop(false);
  }, []);

  const onDrop = useCallback((event, targetData) => {
    event.preventDefault();
    
    const targetSnapshot = { ...targetData };
    const sourceSnapshot = { ...dragSource };
    
    setDragOverTarget(null);
    setIsValidDrop(false);
    setDraggingId(null);
    setDragSource(null);

    try {
      const dataString = event.dataTransfer.getData('application/json');
      if (!dataString) return { success: false, error: 'No data transferred' };
      
      const parsedData = JSON.parse(dataString);
      
      if (!validateDrop(parsedData.source || sourceSnapshot, targetSnapshot)) {
        return { success: false, error: 'Invalid drop target' };
      }
      
      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Drop parse error:', error);
      return { success: false, error };
    }
  }, [dragSource, validateDrop]);

  const endDrag = useCallback((event) => {
    setDraggingId(null);
    setDragSource(null);
    setDragOverTarget(null);
    setIsValidDrop(false);
    
    if (event?.target?.classList) {
      event.target.classList.remove('dragging');
    }
  }, []);

  const getDropZoneClass = useCallback((targetData) => {
    const targetId = typeof targetData === 'string' ? targetData : targetData?.id;
    if (dragOverTarget?.id === targetId || dragOverTarget?.projectId === targetId || dragOverTarget?.type === targetData?.type) {
      return isValidDrop 
        ? 'border-primary/50 bg-primary/5 shadow-inner' 
        : 'border-destructive/50 bg-destructive/5';
    }
    return 'border-transparent';
  }, [dragOverTarget, isValidDrop]);

  const getDraggedItemClass = useCallback((taskId) => {
    return draggingId === taskId ? 'opacity-50 shadow-xl scale-[1.02] cursor-grabbing z-50 ring-2 ring-primary' : 'cursor-grab hover:shadow-md hover:-translate-y-0.5 transition-all';
  }, [draggingId]);

  return {
    draggingId,
    dragSource,
    dragOverTarget,
    isValidDrop,
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    endDrag,
    getDropZoneClass,
    getDraggedItemClass,
    validateDrop,
    startDrag: onDragStart,
  };
};