import { useEffect, useState } from 'react';
import { apiFetch, API_BASE } from '../lib/apiClient';
import { useAuth } from './useAuth';
import type { Submission, SubmissionStatus } from '../types/entities';

export function useSubmissions(status: SubmissionStatus | 'all') {
  const { token } = useAuth();
  const url = `${API_BASE}/api/admin/submissions${status === 'all' ? '' : `?status=${status}`}`;

  const [state, setState] = useState<{ url: string; items: Submission[] | null; error: string | null }>({
    url: '',
    items: null,
    error: null,
  });

  if (state.url !== url) {
    setState({ url, items: null, error: null });
  }

  useEffect(() => {
    let cancelled = false;
    apiFetch<Submission[]>(url, { token })
      .then((data) => {
        if (!cancelled) setState({ url, items: data, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ url, items: [], error: err instanceof Error ? err.message : 'Failed to load' });
      });
    return () => {
      cancelled = true;
    };
  }, [url, token]);

  async function refresh() {
    const data = await apiFetch<Submission[]>(url, { token });
    setState({ url, items: data, error: null });
  }

  async function review(id: number, next: 'approved' | 'rejected') {
    await apiFetch(`${API_BASE}/api/admin/submissions/${id}`, { method: 'PATCH', token, body: { status: next } });
    await refresh();
  }

  return { items: state.items ?? [], loading: state.url === url && state.items === null, error: state.error, review };
}
