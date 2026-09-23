import { useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';
import { useLanguage } from '../hooks/useLanguage';
import type { Submission, SubmissionStatus } from '../types/entities';

const FILTERS: (SubmissionStatus | 'all')[] = ['pending', 'approved', 'rejected', 'all'];

const TYPE_BADGE: Record<Submission['type'], string> = {
  note: 'bg-brand-blue-tint text-brand-blue',
  issue: 'bg-red-100 text-red-700',
  event: 'bg-brand-green-tint text-brand-green',
};

const STATUS_BADGE: Record<SubmissionStatus, string> = {
  pending: 'bg-brand-amber-tint text-brand-amber',
  approved: 'bg-brand-green-tint text-brand-green',
  rejected: 'bg-red-100 text-red-700',
};

export function SubmissionsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<SubmissionStatus | 'all'>('pending');
  const { items, loading, error, review } = useSubmissions(filter);
  const [actionError, setActionError] = useState<string | null>(null);

  const filterLabel: Record<SubmissionStatus | 'all', string> = {
    pending: t.filterPending,
    approved: t.filterApproved,
    rejected: t.filterRejected,
    all: t.filterAll,
  };
  const typeLabel: Record<Submission['type'], string> = { note: t.typeNote, issue: t.typeIssue, event: t.typeEvent };
  const statusLabel: Record<SubmissionStatus, string> = {
    pending: t.statusPending,
    approved: t.statusApproved,
    rejected: t.statusRejected,
  };

  async function handleReview(id: number, next: 'approved' | 'rejected') {
    setActionError(null);
    try {
      await review(id, next);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t.actionFailed);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-text">{t.submissionsTitle}</h1>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                filter === f ? 'bg-brand-blue text-white' : 'bg-brand-bg text-brand-text-secondary hover:bg-brand-border'
              }`}
            >
              {filterLabel[f]}
            </button>
          ))}
        </div>
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
              <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${STATUS_BADGE[s.status]}`}>
                {statusLabel[s.status]}
              </span>
              <span className="text-[12.5px] text-brand-text-secondary">{s.entityLabel}</span>
            </div>
            <p className="mb-2 text-sm text-brand-text">{s.message}</p>
            <div className="mb-2 text-[12px] text-brand-text-secondary">
              {t.colSubmittedBy}: {s.submitterName ?? t.anonymous}
              {s.submitterPhone ? ` · ${s.submitterPhone}` : ''} · {new Date(s.createdAt).toLocaleString()}
            </div>
            {s.status === 'pending' && (
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleReview(s.id, 'rejected')}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-brand-bg"
                >
                  {t.reject}
                </button>
                <button
                  onClick={() => handleReview(s.id, 'approved')}
                  className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark"
                >
                  {t.approve}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
