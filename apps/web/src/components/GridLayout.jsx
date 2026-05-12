import React from 'react';
import { useDragDrop } from '@/hooks/useDragDrop';

export const GridLayout = ({ children, className = '', dropZoneId, dropZoneType, onDrop }) => {
  const { onDragOver, onDragLeave, onDrop: handleHookDrop, getDropZoneClass } = useDragDrop();

  const handleDragOver = (e) => {
    if (!dropZoneId) return;
    onDragOver(e, { id: dropZoneId, type: dropZoneType });
  };

  const handleDragLeave = (e) => {
    if (!dropZoneId) return;
    onDragLeave(e, { id: dropZoneId, type: dropZoneType });
  };

  const handleDropEvent = (e) => {
    if (!dropZoneId) return;
    const result = handleHookDrop(e, { id: dropZoneId, type: dropZoneType });
    if (result.success && onDrop) {
      onDrop(result.data, dropZoneId);
    }
  };

  const dynamicClass = dropZoneId ? getDropZoneClass({ id: dropZoneId }) : '';

  return (
    <div 
      className={`grid-layout view-transition rounded-xl p-1 -m-1 ${dynamicClass} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropEvent}
    >
      {children}
    </div>
  );
};