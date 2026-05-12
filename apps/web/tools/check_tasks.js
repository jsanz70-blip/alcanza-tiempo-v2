import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqtgvhpgegulsrducyzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdGd2aHBnZWd1bHNyZHVjeXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzAzOTUsImV4cCI6MjA4MjM0NjM5NX0.Eo0-GmqzO3JB4kQf-tXhevg52rUBg453RD7f5cDihUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fullDiagnostic() {
  console.log('=== FULL DIAGNOSTIC ===\n');

  // 1. Test exact query from AllTasksPage
  console.log('--- AllTasksPage queries ---');
  const r1 = await supabase.from('tareas').select('*').order('numero');
  console.log('tareas select * order numero:', r1.error ? `❌ ${r1.error.message}` : `✅ ${r1.data.length} rows`);

  const r2 = await supabase.from('projects').select('*').order('nombre');
  console.log('projects select * order nombre:', r2.error ? `❌ ${r2.error.message}` : `✅ ${r2.data.length} rows`);

  // 2. Test exact query from TodayPage
  console.log('\n--- TodayPage queries ---');
  const todayStr = new Date().toISOString().split('T')[0];
  const startOfDay = new Date(todayStr + 'T00:00:00.000Z');
  const endOfDay = new Date(todayStr + 'T23:59:59.999Z');

  const r3 = await supabase.from('tareas').select('*').order('prioridad').in('frecuencia', ['Diaria', 'Semanal', 'Mensual']);
  console.log('tareas recurrentes:', r3.error ? `❌ ${r3.error.message}` : `✅ ${r3.data.length} rows`);

  const r4 = await supabase.from('daily_objectives').select('*').gte('fecha', startOfDay.toISOString()).lte('fecha', endOfDay.toISOString());
  console.log('daily_objectives today:', r4.error ? `❌ ${r4.error.message}` : `✅ ${r4.data.length} rows`);

  // 3. Test inserting a daily objective (like TodayPage does if none exist)
  if (!r4.error && r4.data.length === 0) {
    console.log('  -> No daily objective for today, testing INSERT...');
    const r5 = await supabase.from('daily_objectives').insert({
      fecha: todayStr + 'T12:00:00.000Z',
      franjas: {}
    }).select().single();
    console.log('  -> daily_objectives INSERT:', r5.error ? `❌ ${r5.error.message}` : `✅ created id=${r5.data.id}`);
  }

  // 4. Test AlarmService query
  console.log('\n--- AlarmService queries ---');
  const r6 = await supabase.from('tareas').select('*').neq('estado', 'Hecho').neq('hora_alarma', '');
  console.log('tareas alarm check:', r6.error ? `❌ ${r6.error.message}` : `✅ ${r6.data.length} rows`);

  // 5. Check columns of tareas
  console.log('\n--- tareas table columns ---');
  const r7 = await supabase.from('tareas').select('*').limit(1);
  if (!r7.error && r7.data.length > 0) {
    console.log('Columns:', Object.keys(r7.data[0]).join(', '));
  }

  // 6. Check new tables
  console.log('\n--- New tables ---');
  const r8 = await supabase.from('categorias_objetivos').select('*').limit(1);
  console.log('categorias_objetivos:', r8.error ? `❌ ${r8.error.message}` : `✅ OK`);

  const r9 = await supabase.from('time_slots').select('*').limit(1);
  console.log('time_slots:', r9.error ? `❌ ${r9.error.message}` : `✅ OK`);

  const r10 = await supabase.from('project_phases').select('*').limit(1);
  console.log('project_phases:', r10.error ? `❌ ${r10.error.message}` : `✅ OK`);
}

fullDiagnostic();
