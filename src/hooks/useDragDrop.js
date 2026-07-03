import { useState, useCallback, useEffect } from 'react';

// Global state for dragging to allow cross-component communication
let globalDraggingId = null;
let globalDragSource = null;
let globalListeners = new Set();

const notifyListeners = () => {
  globalListeners.forEach(listener => listener());
};

export const useDragDrop = () => {
  const [draggingId, setDraggingId] = useState(globalDraggingId);
  const [dragSource, setDragSource] = useState(globalDragSource);
  const [dragOverTarget, setDragOverTarget] = useState(null);
  const [isValidDrop, setIsValidDrop] = useState(false);

  useEffect(() => {
    const updateLocalState = () => {
      setDraggingId(globalDraggingId);
      setDragSource(globalDragSource);
    };
    
    globalListeners.add(updateLocalState);
    return () => {
      globalListeners.delete(updateLocalState);
    };
  }, []);

  const validateDrop = useCallback((source, target) => {
    if (!source || !target) return false;
    
    // Cross-section specific rules
    if (source.type === 'task' && target.type === 'project') return true;
    if (source.type === 'task' && target.type === 'sidebar') return true; // to unassign
    if (source.type === 'task' && target.type === 'slot') return true; // for daily objectives
    if (source.type === 'task' && target.type === 'week') return true; // drag from sidebar to week day
    if (source.type === 'slot-task' && target.type === 'sidebar') return true; // move from slot back to sidebar
    
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
    event.dataTransfer.setData('text/plain', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
    
    globalDraggingId = taskId;
    globalDragSource = sourceData;
    notifyListeners();

    setTimeout(() => {
      if (event.target && event.target.classList) {
        event.target.classList.add('dragging');
      }
    }, 0);
  }, []);

  const onDragOver = useCallback((event, targetData) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    
    setDragOverTarget(targetData);
    setIsValidDrop(validateDrop(globalDragSource, targetData));
  }, [validateDrop]);

  const onDragLeave = useCallback((event, targetData) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverTarget(null);
    setIsValidDrop(false);
  }, []);

  const onDrop = useCallback((event, targetData) => {
    event.preventDefault();
    event.stopPropagation();
    
    const targetSnapshot = { ...targetData };
    const sourceSnapshot = globalDragSource ? { ...globalDragSource } : null;
    const draggingIdSnapshot = globalDraggingId;
    
    globalDraggingId = null;
    globalDragSource = null;
    notifyListeners();
    
    setDragOverTarget(null);
    setIsValidDrop(false);

    try {
      let parsedData;
      const dataString = event.dataTransfer.getData('text/plain');
      
      if (dataString) {
        parsedData = JSON.parse(dataString);
      } else if (sourceSnapshot && draggingIdSnapshot) {
        // Fallback for environments where dataTransfer is lost
        parsedData = { taskId: draggingIdSnapshot, source: sourceSnapshot };
      } else {
        return { success: false, error: 'No data transferred' };
      }
      
      if (!validateDrop(parsedData.source || sourceSnapshot, targetSnapshot)) {
        return { success: false, error: 'Invalid drop target' };
      }
      
      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Drop parse error:', error);
      return { success: false, error };
    }
  }, [validateDrop]);

  const endDrag = useCallback((event) => {
    globalDraggingId = null;
    globalDragSource = null;
    notifyListeners();
    
    setDragOverTarget(null);
    setIsValidDrop(false);
    
    if (event?.target?.classList) {
      event.target.classList.remove('dragging');
    }
  }, []);

  const getDropZoneClass = useCallback((targetData) => {
    if (!dragOverTarget) return 'border-transparent';
    
    const isCurrentTarget = (
      (targetData.id && dragOverTarget.id === targetData.id) ||
      (targetData.projectId && dragOverTarget.projectId === targetData.projectId) ||
      (targetData.slotId && dragOverTarget.slotId === targetData.slotId) ||
      (targetData.type === dragOverTarget.type)
    );

    if (isCurrentTarget) {
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