import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Block } from '../types/entities';

const fields: FieldConfig<Block>[] = [{ key: 'name', label: 'Block name' }];

export function BlocksPage() {
  const { assemblyNumber } = useParams<{ assemblyNumber: string }>();
  const { items, loading, error, create, update, remove } = useCrud<Block>('blocks', assemblyNumber);
  const [editing, setEditing] = useState<Block | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Block | null>(null);
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
        <h1 className="text-lg font-semibold text-brand-text">Blocks</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          + Add block
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {creating && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            onSubmit={async (v) => {
              await create({ ...v, assemblyNumber: Number(assemblyNumber) });
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
        onRowClick={(b) => navigate(`/blocks/${b.id}/zones`)}
        onEdit={setEditing}
        onDelete={(b) => {
          setDeleting(b);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete block?"
        message={`This will fail if ${deleting?.name} still has zones attached — delete those first.`}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
