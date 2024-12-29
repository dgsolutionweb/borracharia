import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export function useQuery<T = any>(
  query: string,
  params?: Record<string, any>,
  options?: { enabled?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (options?.enabled === false) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const { data, error } = await supabase.rpc(query, params);
        
        if (error) {
          setError(error);
          return;
        }

        setData(data);
      } catch (err) {
        setError(err as PostgrestError);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query, JSON.stringify(params), options?.enabled]);

  return { data, error, loading };
}