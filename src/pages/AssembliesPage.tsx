import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Assembly } from '../types/entities';

export function AssembliesPage() {
  const { districtId } = useParams<{ districtId: string }>();
  const { items, loading, error, create, update, remove } = useCrud<Assembly>('assemblies', districtId);
  const [editing, setEditing] = useState<Assembly | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Assembly | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fields: FieldConfig<Assembly>[] = [
    { key: 'id', label: 'Constituency number', type: 'number' },
    { key: 'name', label: 'Assembly name' },
    {
      key: 'reservation',
      label: 'Reservation',
      type: 'select',
      options: [
        { value: 'GEN', label: 'General' },
        { value: 'SC', label: 'SC' },
        { value: 'ST', label: 'ST' },
      ],
    },
    { key: 'totalBooths', label: 'Total booths', type: 'number' },
  ];

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
        <h1 className="text-lg font-semibold text-brand-text">Assemblies</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          + Add assembly
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {creating && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            initial={{ districtId: Number(districtId) } as Partial<Assembly>}
            onSubmit={async (v) => {
              await create({ ...v, districtId: Number(districtId) });
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
          { key: 'id', label: 'No.' },
          { key: 'name', label: 'Name' },
          { key: 'reservation', label: 'Reservation' },
          { key: 'totalBooths', label: 'Booths' },
        ]}
        rows={items}
        onRowClick={(a) => navigate(`/assemblies/${a.id}/zones`)}
        onEdit={setEditing}
        onDelete={(a) => {
          setDeleting(a);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete assembly?"
        message={`This will fail if ${deleting?.name} still has zones attached — delete those first.`}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
