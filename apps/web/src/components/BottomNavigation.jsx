import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, CalendarDays, LayoutList, Target, ListTodo, FolderKanban } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    { path: '/hoy', label: 'Hoy', icon: CheckCircle2 },
    { path: '/semana', label: 'Semana', icon: CalendarDays },
    { path: '/todas', label: 'Todas', icon: LayoutList },
    { path: '/daily-objectives', label: 'Objetivos', icon: Target },
    { path: '/projects', label: 'Proyectos', icon: FolderKanban },
    { path: '/rutinas', label: 'Rutinas', icon: ListTodo },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-popover/95 backdrop-blur-md border-t border-border pb-safe pt-1">
      <ul className="flex items-center justify-between w-full h-[56px] sm:h-[64px] max-w-2xl mx-auto px-0.5 sm:px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path} className="flex-1 min-w-0">
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full h-full gap-0.5 sm:gap-1 transition-all duration-200 group
                  ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className={`
                      relative flex items-center justify-center w-8 sm:w-10 h-7 sm:h-8 rounded-full transition-all duration-200
                      ${isActive ? 'bg-primary/10' : 'group-hover:bg-muted'}
                    `}>
                      <Icon className={`w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] ${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-200`} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-medium transition-all duration-200 truncate w-full text-center px-1 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavigation;