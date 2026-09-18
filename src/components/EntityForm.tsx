import { useState, type FormEvent } from 'react';

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  type?: 'text' | 'number' | 'select' | 'csv';
  options?: { value: string; label: string }[];
}

interface EntityFormProps<T> {
  fields: FieldConfig<T>[];
  initial?: Partial<T>;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export function EntityForm<T extends object>({ fields, initial, onSubmit, onCancel, submitLabel = 'Save' }: EntityFormProps<T>) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = (initial as Record<string, unknown> | undefined)?.[f.key as string];
      base[String(f.key)] = f.type === 'csv' ? (Array.isArray(raw) ? raw.join(', ') : '') : raw ?? '';
    }
    return base;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const raw = values[String(f.key)];
        if (f.type === 'number') payload[String(f.key)] = raw === '' ? null : Number(raw);
        else if (f.type === 'csv') {
          payload[String(f.key)] = String(raw)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else payload[String(f.key)] = raw;
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-brand-border bg-brand-surface p-4">
      {fields.map((f) => (
        <div key={String(f.key)}>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">{f.label}</label>
          {f.type === 'select' ? (
            <select
              value={String(values[String(f.key)] ?? '')}
              onChange={(e) => setValues((v) => ({ ...v, [String(f.key)]: e.target.value }))}
              className="w-full rounded-md border border-brand-border px-3 py-1.5 text-sm"
            >
              <option value="">Select…</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={f.type === 'number' ? 'number' : 'text'}
              value={String(values[String(f.key)] ?? '')}
              onChange={(e) => setValues((v) => ({ ...v, [String(f.key)]: e.target.value }))}
              placeholder={f.type === 'csv' ? 'Comma-separated' : undefined}
              className="w-full rounded-md border border-brand-border px-3 py-1.5 text-sm"
            />
          )}
        </div>
      ))}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-brand-text-secondary hover:bg-brand-bg">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark disabled:opacity-50">
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
