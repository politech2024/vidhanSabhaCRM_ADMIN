import { useEffect, useState } from 'react';
import { apiFetch, API_BASE } from '../lib/apiClient';
import { useAuth } from './useAuth';

interface FetchState<T> {
  url: string;
  items: T[] | null;
  error: string | null;
}

export function useCrud<T extends { id: number }>(resource: string, parentId?: number | string) {
  const { token } = useAuth();

  const listUrl =
    parentId !== undefined
      ? `${API_BASE}/api/admin/${resource}?parentId=${parentId}`
      : `${API_BASE}/api/admin/${resource}`;

  const [state, setState] = useState<FetchState<T>>({ url: '', items: null, error: null });

  // Reset to a pending state whenever the url changes, without an effect — see
  // useFetch.ts in the citizen app for why.
  if (state.url !== listUrl) {
    setState({ url: listUrl, items: null, error: null });
  }

  useEffect(() => {
    let cancelled = false;
    apiFetch<T[]>(listUrl, { token })
      .then((data) => {
        if (!cancelled) setState({ url: listUrl, items: data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ url: listUrl, items: [], error: err instanceof Error ? err.message : 'Failed to load' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [listUrl, token]);

  const loading = state.url === listUrl && state.items === null;

  // Separate from the effect above (not called from within it), so it stays a
  // plain awaitable function create/update/remove can rely on to finish before
  // resolving, without tripping the "no setState directly inside an effect" rule.
  async function refresh() {
    try {
      const data = await apiFetch<T[]>(listUrl, { token });
      setState({ url: listUrl, items: data, error: null });
    } catch (err) {
      setState({ url: listUrl, items: [], error: err instanceof Error ? err.message : 'Failed to load' });
    }
  }

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

  return { items: state.items ?? [], loading, error: state.error, create, update, remove, refresh };
}
