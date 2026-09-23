import { useEffect, useState } from 'react';
import { apiFetch, API_BASE } from '../lib/apiClient';
import { useAuth } from './useAuth';
import type { Submission } from '../types/entities';

const LIST_URL = `${API_BASE}/api/admin/submissions`;

export function useSubmissions() {
  const { token } = useAuth();
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Submission[]>(LIST_URL, { token })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setItems([]);
          setError(err instanceof Error ? err.message : 'Failed to load');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function refresh() {
    const data = await apiFetch<Submission[]>(LIST_URL, { token });
    setItems(data);
    setError(null);
  }

  async function remove(id: number) {
    await apiFetch(`${LIST_URL}/${id}`, { method: 'DELETE', token });
    await refresh();
  }

  return { items: items ?? [], loading: items === null, error, remove };
}
