import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Booth } from '../types/entities';

const fields: FieldConfig<Booth>[] = [
  { key: 'boothNo', label: 'Booth number', type: 'number' },
  { key: 'boothName', label: 'Booth name' },
  { key: 'inchargeName', label: 'In-charge name' },
  { key: 'inchargePhones', label: 'In-charge phone(s)', type: 'csv' },
  { key: 'flags', label: 'Flags', type: 'csv' },
];

export function BoothsPage() {
  const { panchayatId } = useParams<{ panchayatId: string }>();
  const { items, loading, error, create, update, remove } = useCrud<Booth>('booths', panchayatId);
  const [editing, setEditing] = useState<Booth | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Booth | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      setDeleting(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-text">Booths</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          + Add booth
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {creating && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            onSubmit={async (v) => {
              await create({ ...v, panchayatId: Number(panchayatId) });
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
            submitLabel="Create"
          />
        </div>
      )}
      {editing && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            initial={editing}
            onSubmit={async (v) => {
              await update(editing.id, v);
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      <DataTable
        columns={[
          { key: 'boothNo', label: 'No.' },
          { key: 'boothName', label: 'Name' },
          { key: 'inchargeName', label: 'In-charge' },
        ]}
        rows={items}
        onEdit={setEditing}
        onDelete={(b) => {
          setDeleting(b);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete booth?"
        message={`Delete ${deleting?.boothName}? This cannot be undone.`}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
