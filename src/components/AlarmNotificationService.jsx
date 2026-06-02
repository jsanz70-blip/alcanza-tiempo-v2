import React from 'react';
import { useAlarmService } from '@/hooks/useAlarmService.js';
import AlarmModal from './AlarmModal.jsx';

const AlarmNotificationService = ({ children }) => {
  const { activeAlarm, clearAlarm, postponeAlarm } = useAlarmService();

  return (
    <>
      {children}
      <AlarmModal 
        task={activeAlarm} 
        isOpen={!!activeAlarm} 
        onClose={clearAlarm} 
        onPostpone={postponeAlarm}
      />
    </>
  );
};

export default AlarmNotificationService;