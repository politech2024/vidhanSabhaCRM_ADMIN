import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Assembly } from '../types/entities';
import { useLanguage } from '../hooks/useLanguage';

export function AssembliesPage() {
  const { t } = useLanguage();
  const { districtId } = useParams<{ districtId: string }>();
  const { items, loading, error, create, update, remove } = useCrud<Assembly>('assemblies', districtId);
  const [editing, setEditing] = useState<Assembly | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Assembly | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fields: FieldConfig<Assembly>[] = [
    { key: 'id', label: t.fieldConstituencyNumber, type: 'number' },
    { key: 'name', label: t.fieldAssemblyName },
    {
      key: 'reservation',
      label: t.fieldReservation,
      type: 'select',
      options: [
        { value: 'GEN', label: t.optionGeneral },
        { value: 'SC', label: 'SC' },
        { value: 'ST', label: 'ST' },
      ],
    },
    { key: 'totalBooths', label: t.fieldTotalBooths, type: 'number' },
  ];

  async function handleDelete() {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      setDeleting(null);
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t.deleteFailed);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-text">{t.assembliesTitle}</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          {t.addAssembly}
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">{t.loading}</p>}
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
            submitLabel={t.create}
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
          { key: 'id', label: t.colNo },
          { key: 'name', label: t.colName },
          { key: 'reservation', label: t.colReservation },
          { key: 'totalBooths', label: t.colBooths },
        ]}
        rows={items}
        onRowClick={(a) => navigate(`/assemblies/${a.id}/blocks`)}
        onEdit={setEditing}
        onDelete={(a) => {
          setDeleting(a);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title={t.deleteAssemblyTitle}
        message={deleting ? t.deleteAssemblyMessage(deleting.name) : ''}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
