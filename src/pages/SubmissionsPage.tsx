import { useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';
import { useLanguage } from '../hooks/useLanguage';
import type { Submission } from '../types/entities';

const TYPE_BADGE: Record<Submission['type'], string> = {
  note: 'bg-brand-blue-tint text-brand-blue',
  issue: 'bg-red-100 text-red-700',
  event: 'bg-brand-green-tint text-brand-green',
};

export function SubmissionsPage() {
  const { t } = useLanguage();
  const { items, loading, error, remove } = useSubmissions();
  const [actionError, setActionError] = useState<string | null>(null);

  const typeLabel: Record<Submission['type'], string> = { note: t.typeNote, issue: t.typeIssue, event: t.typeEvent };

  async function handleDelete(id: number) {
    setActionError(null);
    try {
      await remove(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t.actionFailed);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-text">{t.submissionsTitle}</h1>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">{t.loading}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {actionError && <p className="mb-2 text-sm text-red-600">{actionError}</p>}

      <div className="space-y-2.5">
        {!loading && items.length === 0 && (
          <div className="rounded-lg border border-brand-border bg-brand-surface px-4 py-8 text-center text-sm text-brand-text-secondary">
            {t.noSubmissions}
          </div>
        )}
        {items.map((s) => (
          <div key={s.id} className="rounded-lg border border-brand-border bg-brand-surface p-4">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${TYPE_BADGE[s.type]}`}>
                {typeLabel[s.type]}
              </span>
              <span className="text-[12.5px] text-brand-text-secondary">{s.entityLabel}</span>
            </div>
            <p className="mb-2 text-sm text-brand-text">{s.message}</p>
            <div className="mb-2 text-[12px] text-brand-text-secondary">
              {s.type === 'event' && s.eventAt ? `${t.colEventAt}: ${new Date(s.eventAt).toLocaleString()} · ` : ''}
              {t.colSubmittedAt}: {new Date(s.createdAt).toLocaleString()}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(s.id)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-brand-bg"
              >
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
