import React from 'react';
import { List, LayoutGrid } from 'lucide-react';

export const ViewToggle = ({ currentView, onViewChange, moduleName }) => {
  return (
    <div className="flex items-center gap-1 bg-card p-1 rounded-lg border border-border">
      <button
        onClick={() => onViewChange('list')}
        aria-label="Vista Lista"
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
          currentView === 'list' 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewChange('grid')}
        aria-label="Vista Cuadrícula"
        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
          currentView === 'grid' 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
};