import { useCallback, useEffect, useState } from 'react';
import { apiFetch, API_BASE } from '../lib/apiClient';
import { useAuth } from './useAuth';

export function useCrud<T extends { id: number }>(resource: string, parentId?: number | string) {
  const { token } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listUrl =
    parentId !== undefined
      ? `${API_BASE}/api/admin/${resource}?parentId=${parentId}`
      : `${API_BASE}/api/admin/${resource}`;

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<T[]>(listUrl, { token });
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [listUrl, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(body: Record<string, unknown>) {
    await apiFetch(`${API_BASE}/api/admin/${resource}`, { method: 'POST', token, body });
    await refresh();
  }

  async function update(id: number, body: Record<string, unknown>) {
    await apiFetch(`${API_BASE}/api/admin/${resource}/${id}`, { method: 'PUT', token, body });
    await refresh();
  }

  async function remove(id: number) {
    await apiFetch(`${API_BASE}/api/admin/${resource}/${id}`, { method: 'DELETE', token });
    await refresh();
  }

  return { items, loading, error, create, update, remove, refresh };
}
