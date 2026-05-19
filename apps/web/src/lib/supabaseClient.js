import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Real Supabase client instance
const realSupabase = createClient(supabaseUrl, supabaseAnonKey)

// Global list of active realtime callbacks
const realtimeCallbacks = [];

// Helper functions for offline caching and synchronization
function loadFromCache(table) {
  try {
    return JSON.parse(localStorage.getItem(`offline_cache_${table}`) || '[]');
  } catch (e) {
    console.error('Error loading offline cache for table:', table, e);
    return [];
  }
}

function saveToCache(table, data) {
  try {
    localStorage.setItem(`offline_cache_${table}`, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving offline cache for table:', table, e);
  }
}

function queueMutation(mutation) {
  try {
    const queue = JSON.parse(localStorage.getItem('offline_mutations_queue') || '[]');
    queue.push(mutation);
    localStorage.setItem('offline_mutations_queue', JSON.stringify(queue));
  } catch (e) {
    console.error('Error queuing mutation:', e);
  }
}

function isNetworkError(error) {
  if (!error) return false;
  const msg = (error.message || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('network error') ||
    msg.includes('load failed') ||
    msg.includes('connection refused') ||
    error.status === 0 ||
    error.code === 'TypeError'
  );
}

function showToast(type, message, options) {
  if (typeof window !== 'undefined') {
    try {
      if (type === 'loading') return toast.loading(message, options);
      if (type === 'success') return toast.success(message, options);
      if (type === 'error') return toast.error(message, options);
      if (type === 'info') return toast.info(message, options);
    } catch (e) {
      console.warn('Toast failed to display:', e);
    }
  }
  return null;
}

// Trigger all local callbacks matching this table (mocking realtime events)
function triggerRealtimeCallbacks(table, payload) {
  realtimeCallbacks.forEach(cb => {
    if (cb.filter && cb.filter.table === table) {
      try {
        cb.callback(payload);
      } catch (err) {
        console.error('Error invoking mock realtime callback:', err);
      }
    }
  });
}

// Sync execution status
let isSyncing = false;

export async function triggerSync() {
  if (isSyncing || !navigator.onLine) return;
  
  const queue = JSON.parse(localStorage.getItem('offline_mutations_queue') || '[]');
  if (queue.length === 0) return;
  
  isSyncing = true;
  const toastId = showToast('loading', 'Sincronizando cambios guardados offline...');
  
  const idMap = new Map();
  const failedItems = [];
  
  for (const item of queue) {
    try {
      // Resolve any temporary IDs in data
      const resolvedData = { ...item.data };
      Object.keys(resolvedData).forEach(key => {
        if (idMap.has(resolvedData[key])) {
          resolvedData[key] = idMap.get(resolvedData[key]);
        }
      });
      
      let resolvedFilters = null;
      if (item.filters) {
        resolvedFilters = item.filters.map(f => {
          let val = f.value;
          if (idMap.has(val)) {
            val = idMap.get(val);
          }
          return { column: f.column, value: val };
        });
      }

      const builder = realSupabase.from(item.table);
      
      if (item.type === 'insert') {
        // Exclude temp ID to allow auto-generation
        if (typeof resolvedData.id === 'string' && resolvedData.id.startsWith('temp-')) {
          delete resolvedData.id;
        }
        
        const { data, error } = await builder.insert(resolvedData).select();
        if (error) throw error;
        
        const insertedRow = data && data[0];
        if (item.tempId && insertedRow && insertedRow.id) {
          idMap.set(item.tempId, insertedRow.id);
        }
      } else if (item.type === 'update') {
        if (!resolvedFilters || resolvedFilters.length === 0) {
          throw new Error('Sync update requires filters');
        }
        let updateBuilder = builder.update(resolvedData);
        resolvedFilters.forEach(f => {
          updateBuilder = updateBuilder.eq(f.column, f.value);
        });
        const { error } = await updateBuilder;
        if (error) throw error;
      } else if (item.type === 'delete') {
        if (!resolvedFilters || resolvedFilters.length === 0) {
          throw new Error('Sync delete requires filters');
        }
        let deleteBuilder = builder.delete();
        resolvedFilters.forEach(f => {
          deleteBuilder = deleteBuilder.eq(f.column, f.value);
        });
        const { error } = await deleteBuilder;
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error syncing queued mutation:', item, err);
      if (isNetworkError(err)) {
        failedItems.push(...queue.slice(queue.indexOf(item)));
        showToast('error', 'Sincronización pausada por problemas de red', { id: toastId });
        isSyncing = false;
        return;
      }
      // If it's a validation error, log it but don't block the queue
      console.warn('Skipping unrecoverable sync item due to error:', err);
    }
  }
  
  localStorage.setItem('offline_mutations_queue', JSON.stringify(failedItems));
  
  if (failedItems.length === 0) {
    // Refresh local cache with latest cloud data for all modified tables
    const modifiedTables = [...new Set(queue.map(item => item.table))];
    for (const table of modifiedTables) {
      try {
        const { data, error } = await realSupabase.from(table).select('*');
        if (!error && data) {
          saveToCache(table, data);
          // Notify the UI to refresh
          triggerRealtimeCallbacks(table, { eventType: 'UPDATE', new: null });
        }
      } catch (e) {
        console.error(`Failed to refresh cache for table ${table} post-sync`, e);
      }
    }
    showToast('success', '¡Sincronización completada con la nube!', { id: toastId });
  }
  
  isSyncing = false;
}

// Mock channel to support realtime subscriptions when offline or online
class MockChannel {
  constructor(name, realChannel) {
    this.name = name;
    this.realChannel = realChannel;
    this.listeners = [];
  }

  on(event, filter, callback) {
    this.listeners.push({ event, filter, callback });
    realtimeCallbacks.push({ channel: this.name, event, filter, callback });
    if (this.realChannel) {
      this.realChannel.on(event, filter, callback);
    }
    return this;
  }

  subscribe(callback) {
    if (this.realChannel) {
      this.realChannel.subscribe(callback);
    } else if (callback) {
      callback('SUBSCRIBED');
    }
    return this;
  }
}

// Query Chain Builder to support offline/online routing and operations
class OfflineQueryChain {
  constructor(table, realQueryBuilder) {
    this.table = table;
    this.realQueryBuilder = realQueryBuilder;
    this.filters = [];
    this.sorts = [];
    this.limitCount = null;
    this.isSingle = false;
    this.operation = 'select';
    this.mutationData = null;
  }

  select(columns) {
    this.operation = 'select';
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.select(columns);
    return this;
  }

  insert(data) {
    this.operation = 'insert';
    this.mutationData = data;
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.insert(data);
    return this;
  }

  update(data) {
    this.operation = 'update';
    this.mutationData = data;
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.update(data);
    return this;
  }

  delete() {
    this.operation = 'delete';
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.delete();
    return this;
  }

  eq(column, value) {
    this.filters.push({ type: 'eq', column, value });
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.eq(column, value);
    return this;
  }

  neq(column, value) {
    this.filters.push({ type: 'neq', column, value });
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.neq(column, value);
    return this;
  }

  gte(column, value) {
    this.filters.push({ type: 'gte', column, value });
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.gte(column, value);
    return this;
  }

  lte(column, value) {
    this.filters.push({ type: 'lte', column, value });
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.lte(column, value);
    return this;
  }

  order(column, options = {}) {
    const ascending = options.ascending !== false;
    this.sorts.push({ column, ascending });
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.order(column, options);
    return this;
  }

  limit(count) {
    this.limitCount = count;
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.limit(count);
    return this;
  }

  single() {
    this.isSingle = true;
    if (this.realQueryBuilder) this.realQueryBuilder = this.realQueryBuilder.single();
    return this;
  }

  then(onfulfilled, onrejected) {
    return this.execute().then(onfulfilled, onrejected);
  }

  async execute() {
    if (navigator.onLine) {
      try {
        const result = await this.realQueryBuilder;
        if (result && result.error) {
          if (isNetworkError(result.error)) {
            return this.executeOffline();
          }
          return result;
        }

        // Cache successful select results
        if (this.operation === 'select' && result && result.data) {
          saveToCache(this.table, result.data);
        }

        // Trigger sync of any pending queue changes on successful online mutation
        if (this.operation !== 'select') {
          triggerSync();
        }

        return result;
      } catch (err) {
        if (isNetworkError(err)) {
          return this.executeOffline();
        }
        throw err;
      }
    } else {
      return this.executeOffline();
    }
  }

  async executeOffline() {
    console.log(`[Offline mode] Query executing on "${this.table}":`, this.operation, this.filters);
    
    let localData = loadFromCache(this.table);

    if (this.operation === 'select') {
      let result = [...localData];
      
      // Apply filters
      for (const filter of this.filters) {
        if (filter.type === 'eq') {
          result = result.filter(row => String(row[filter.column]) === String(filter.value));
        } else if (filter.type === 'neq') {
          result = result.filter(row => String(row[filter.column]) !== String(filter.value));
        } else if (filter.type === 'gte') {
          result = result.filter(row => row[filter.column] >= filter.value);
        } else if (filter.type === 'lte') {
          result = result.filter(row => row[filter.column] <= filter.value);
        }
      }

      // Apply sorts
      for (const sort of this.sorts) {
        result.sort((a, b) => {
          let valA = a[sort.column];
          let valB = b[sort.column];

          const numA = Number(valA);
          const numB = Number(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
            valA = numA;
            valB = numB;
          }

          if (valA === valB) return 0;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;

          const comparison = valA > valB ? 1 : -1;
          return sort.ascending ? comparison : -comparison;
        });
      }

      // Apply limit
      if (this.limitCount !== null) {
        result = result.slice(0, this.limitCount);
      }

      if (this.isSingle) {
        return { data: result[0] || null, error: null };
      }

      return { data: result, error: null };
    }

    // Mutations (insert, update, delete)
    if (this.operation === 'insert') {
      const recordsToInsert = Array.isArray(this.mutationData) ? this.mutationData : [this.mutationData];
      const insertedRecords = [];

      for (const record of recordsToInsert) {
        const tempId = record.id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        let numero = record.numero;
        if (this.table === 'tareas' && !numero) {
          const maxNum = localData.reduce((max, t) => {
            const num = parseInt(t.numero, 10);
            return !isNaN(num) && num > max ? num : max;
          }, 0);
          numero = String(maxNum + 1);
        }

        const newRecord = {
          id: tempId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          numero,
          ...record
        };

        localData.push(newRecord);
        insertedRecords.push(newRecord);

        queueMutation({
          id: `mut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'insert',
          table: this.table,
          data: record,
          tempId: tempId
        });
      }

      saveToCache(this.table, localData);
      
      triggerRealtimeCallbacks(this.table, {
        eventType: 'INSERT',
        new: this.isSingle ? insertedRecords[0] : insertedRecords
      });

      return { data: this.isSingle ? insertedRecords[0] : insertedRecords, error: null };
    }

    if (this.operation === 'update') {
      const eqFilters = this.filters.filter(f => f.type === 'eq');
      if (eqFilters.length === 0) {
        return { data: null, error: new Error('Offline update requires eq filter') };
      }

      const updatedRecords = [];
      localData = localData.map(row => {
        const matches = eqFilters.every(filter => String(row[filter.column]) === String(filter.value));
        if (matches) {
          const updatedRow = {
            ...row,
            ...this.mutationData,
            updated_at: new Date().toISOString()
          };
          updatedRecords.push(updatedRow);
          return updatedRow;
        }
        return row;
      });

      saveToCache(this.table, localData);

      queueMutation({
        id: `mut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'update',
        table: this.table,
        filters: eqFilters.map(f => ({ column: f.column, value: f.value })),
        data: this.mutationData
      });

      for (const updatedRow of updatedRecords) {
        triggerRealtimeCallbacks(this.table, {
          eventType: 'UPDATE',
          new: updatedRow
        });
      }

      return { data: this.isSingle ? updatedRecords[0] : updatedRecords, error: null };
    }

    if (this.operation === 'delete') {
      const eqFilters = this.filters.filter(f => f.type === 'eq');
      if (eqFilters.length === 0) {
        return { data: null, error: new Error('Offline delete requires eq filter') };
      }

      const deletedRecords = [];
      const newLocalData = localData.filter(row => {
        const matches = eqFilters.every(filter => String(row[filter.column]) === String(filter.value));
        if (matches) {
          deletedRecords.push(row);
          return false;
        }
        return true;
      });

      saveToCache(this.table, newLocalData);

      queueMutation({
        id: `mut-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'delete',
        table: this.table,
        filters: eqFilters.map(f => ({ column: f.column, value: f.value }))
      });

      for (const deletedRow of deletedRecords) {
        triggerRealtimeCallbacks(this.table, {
          eventType: 'DELETE',
          old: deletedRow
        });
      }

      return { data: deletedRecords, error: null };
    }

    return { data: null, error: new Error('Unsupported offline operation') };
  }
}

// Proxied Client Object
export const supabase = new Proxy(realSupabase, {
  get(target, prop) {
    if (prop === 'from') {
      return (table) => {
        const realBuilder = target.from(table);
        return new OfflineQueryChain(table, realBuilder);
      };
    }
    if (prop === 'channel') {
      return (name) => {
        let realChannel = null;
        if (navigator.onLine) {
          try {
            realChannel = target.channel(name);
          } catch (err) {
            console.error('Error creating real channel:', err);
          }
        }
        return new MockChannel(name, realChannel);
      };
    }
    if (prop === 'removeChannel') {
      return (channel) => {
        if (channel && channel.realChannel && navigator.onLine) {
          try {
            target.removeChannel(channel.realChannel);
          } catch (err) {
            console.error('Error removing real channel:', err);
          }
        }
        if (channel) {
          for (let i = realtimeCallbacks.length - 1; i >= 0; i--) {
            if (realtimeCallbacks[i].channel === channel.name) {
              realtimeCallbacks.splice(i, 1);
            }
          }
        }
      };
    }
    
    const value = target[prop];
    if (typeof value === 'function') {
      return value.bind(target);
    }
    return value;
  }
});

// Setup online sync listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('App detected online connection. Triggering synchronization...');
    triggerSync();
  });
  
  // Attempt sync on application startup if already online
  setTimeout(() => {
    if (navigator.onLine) {
      triggerSync();
    }
  }, 1000);
}

export default supabase;
