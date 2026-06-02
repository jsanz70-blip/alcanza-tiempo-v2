import React from 'react';
import { ViewToggle } from '@/components/ViewToggle.jsx';

const Header = ({ title, currentView, onViewChange, moduleName, actions, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3 sm:gap-0">
      <div className="flex flex-col min-w-0">
        <h1 className="text-[16px] sm:text-[20px] font-heading font-bold text-foreground truncate">{title}</h1>
        {children}
      </div>
      
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {moduleName && onViewChange && (
          <ViewToggle 
            currentView={currentView} 
            onViewChange={onViewChange} 
            moduleName={moduleName} 
          />
        )}
        {actions}
      </div>
    </div>
  );
};

export default Header;