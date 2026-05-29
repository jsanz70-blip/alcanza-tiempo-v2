import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import BottomNavigation from '@/components/BottomNavigation.jsx';
import HomePage from '@/pages/HomePage.jsx';
import CheckListPage from '@/pages/CheckListPage.jsx';
import WeekPage from '@/pages/WeekPage.jsx';
import AllTasksPage from '@/pages/AllTasksPage.jsx';
import RoutinesPage from '@/pages/RoutinesPage.jsx';
import MetasPage from '@/pages/MetasPage.jsx';
import DailyObjectivesPage from '@/pages/DailyObjectivesPage.jsx';
import ProjectsPage from '@/pages/ProjectsPage.jsx';
import AlarmNotificationService from '@/components/AlarmNotificationService.jsx';
import { forceServiceWorkerUpdate } from '@/forceSWUpdate.js';

function App() {
  // Force SW update on mount to ensure new code with Realtime is loaded
  useEffect(() => {
    forceServiceWorkerUpdate();
  }, []);

  return (
    <Router>
      <AlarmNotificationService>
        <ScrollToTop />
        <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/checklist" element={<CheckListPage />} />
            <Route path="/semana" element={<WeekPage />} />
            <Route path="/todas" element={<AllTasksPage />} />
            <Route path="/mi-dia" element={<DailyObjectivesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/rutinas" element={<RoutinesPage />} />
            <Route path="/metas" element={<MetasPage />} />
          </Routes>
          <BottomNavigation />
        </div>
        <Toaster position="bottom-center" />
      </AlarmNotificationService>
    </Router>
  );
}

export default App;