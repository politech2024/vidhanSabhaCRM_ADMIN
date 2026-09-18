import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Panchayat } from '../types/entities';

const fields: FieldConfig<Panchayat>[] = [{ key: 'name', label: 'Gram panchayat name' }];

export function PanchayatsPage() {
  const { mandalId } = useParams<{ mandalId: string }>();
  const { items, loading, error, create, update, remove } = useCrud<Panchayat>('panchayats', mandalId);
  const [editing, setEditing] = useState<Panchayat | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Panchayat | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        <h1 className="text-lg font-semibold text-brand-text">Gram Panchayats</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          + Add panchayat
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {creating && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            onSubmit={async (v) => {
              await create({ ...v, mandalId: Number(mandalId) });
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
        columns={[{ key: 'name', label: 'Name' }]}
        rows={items}
        onRowClick={(p) => navigate(`/panchayats/${p.id}/booths`)}
        onEdit={setEditing}
        onDelete={(p) => {
          setDeleting(p);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete panchayat?"
        message="This will fail if it still has booths attached — delete those first."
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
