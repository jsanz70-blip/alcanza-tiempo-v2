import { useState, useEffect } from 'react';

export const useViewPreference = (moduleName, defaultView = 'list') => {
  const [view, setView] = useState(() => {
    const saved = localStorage.getItem(`view_pref_${moduleName}`);
    return ['list', 'grid'].includes(saved) ? saved : defaultView;
  });

  useEffect(() => {
    localStorage.setItem(`view_pref_${moduleName}`, view);
  }, [view, moduleName]);

  return [view, setView];
};

export const getViewPreference = (moduleName, defaultView = 'list') => {
  const saved = localStorage.getItem(`view_pref_${moduleName}`);
  return ['list', 'grid'].includes(saved) ? saved : defaultView;
};

export const setViewPreference = (moduleName, viewType) => {
  if (['list', 'grid'].includes(viewType)) {
    localStorage.setItem(`view_pref_${moduleName}`, viewType);
  }
};