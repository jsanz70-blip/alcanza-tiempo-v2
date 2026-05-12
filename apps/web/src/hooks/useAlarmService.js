import { useState, useEffect, useRef, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export const useAlarmService = () => {
  const [activeAlarm, setActiveAlarm] = useState(null);
  const triggeredAlarms = useRef(new Set());
  const timerRef = useRef(null);

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.error('Error requesting notification permission:', err);
      }
    }
  };

  const playSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio playback failed or not supported', e);
    }
  };

  const triggerAlarm = useCallback((task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Alarma: ' + task.tarea, {
        body: `Es hora de: ${task.tarea}`,
        icon: '/favicon.ico'
      });
    }
    playSound();
    setActiveAlarm(task);
  }, []);

  const clearAlarm = useCallback(() => {
    setActiveAlarm(null);
  }, []);

  const postponeAlarm = useCallback(async (task, minutesToPostpone, customTimeStr = null) => {
    try {
      const now = new Date();
      let newDate = new Date(task.fecha_vencimiento);
      let newTimeStr = "";

      if (customTimeStr) {
        // Custom specific time postponement
        newTimeStr = customTimeStr;
        // Keep the same date, unless the time is earlier than now, maybe it's for tomorrow
        const [h, m] = customTimeStr.split(':').map(Number);
        newDate = new Date(); // assume today for custom time
        newDate.setHours(h, m, 0, 0);
        if (newDate < now) {
          newDate.setDate(newDate.getDate() + 1); // Move to tomorrow
        }
      } else {
        // Relative minutes postponement
        const [hours, minutes] = task.hora_alarma.split(':').map(Number);
        newDate = new Date(task.fecha_vencimiento);
        newDate.setHours(hours, minutes, 0, 0);
        
        // Add minutes
        newDate.setMinutes(newDate.getMinutes() + minutesToPostpone);
        newTimeStr = newDate.getHours().toString().padStart(2, '0') + ':' + newDate.getMinutes().toString().padStart(2, '0');
      }

      const newFechaVencimiento = newDate.toISOString();
      const historyEntry = {
        fecha_original: task.fecha_vencimiento,
        hora_original: task.hora_alarma,
        fecha_pospuesta: newFechaVencimiento,
        hora_pospuesta: newTimeStr,
        timestamp: new Date().toISOString()
      };

      const existingHistory = Array.isArray(task.alarmas_historial) ? task.alarmas_historial : [];

      await pb.collection('tareas').update(task.id, {
        hora_alarma: newTimeStr,
        fecha_vencimiento: newFechaVencimiento,
        alarmas_historial: [...existingHistory, historyEntry]
      }, { $autoCancel: false });

      toast.success(`Alarma pospuesta para las ${newTimeStr}`);
      clearAlarm();
    } catch (err) {
      console.error('Error postponing alarm:', err);
      toast.error('Error al postergar la alarma');
    }
  }, [clearAlarm]);

  const checkAlarms = useCallback(async () => {
    try {
      const now = new Date();
      const currentHHMM = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

      // Fetch tasks that have an alarm set and are not done
      const tasks = await pb.collection('tareas').getFullList({
        filter: `estado != "Hecho" && hora_alarma != ""`,
        $autoCancel: false
      });

      tasks.forEach(task => {
        if (!task.fecha_vencimiento || !task.hora_alarma) return;

        const taskDate = new Date(task.fecha_vencimiento);
        // Check if the due date is today in local time
        if (
          taskDate.getDate() === now.getDate() &&
          taskDate.getMonth() === now.getMonth() &&
          taskDate.getFullYear() === now.getFullYear()
        ) {
          if (task.hora_alarma === currentHHMM) {
            // Use a unique ID based on date and time to prevent duplicate triggers
            const uniqueTriggerId = `${task.id}-${taskDate.toISOString().split('T')[0]}-${currentHHMM}`;
            if (!triggeredAlarms.current.has(uniqueTriggerId)) {
              triggeredAlarms.current.add(uniqueTriggerId);
              triggerAlarm(task);
            }
          }
        }
      });
    } catch (err) {
      console.error('Error checking alarms', err);
    }
  }, [triggerAlarm]);

  useEffect(() => {
    // Initial setup and align to the next minute
    requestPermission();
    checkAlarms();

    const now = new Date();
    const delayToNextMinute = (60 - now.getSeconds()) * 1000;

    const startInterval = () => {
      checkAlarms();
      timerRef.current = setInterval(checkAlarms, 60000); // Check every minute
    };

    const initialTimeout = setTimeout(startInterval, delayToNextMinute);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [checkAlarms]);

  useEffect(() => {
    // Listener for testing alarms from DetailPanel
    const handleTestAlarm = (e) => {
      if (e.detail) triggerAlarm(e.detail);
    };
    window.addEventListener('TEST_ALARM', handleTestAlarm);
    return () => window.removeEventListener('TEST_ALARM', handleTestAlarm);
  }, [triggerAlarm]);

  return { activeAlarm, checkAlarms, triggerAlarm, postponeAlarm, clearAlarm };
};