import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqtgvhpgegulsrducyzx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdGd2aHBnZWd1bHNyZHVjeXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzAzOTUsImV4cCI6MjA4MjM0NjM5NX0.Eo0-GmqzO3JB4kQf-tXhevg52rUBg453RD7f5cDihUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('tareas').select('id').limit(5);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data count:', data ? data.length : 0);
    console.log('Sample Data:', data);
  }
}

check();
