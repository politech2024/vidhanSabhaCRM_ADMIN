import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { District } from '../types/entities';
import { useLanguage } from '../hooks/useLanguage';

export function DistrictsPage() {
  const { t } = useLanguage();
  const fields: FieldConfig<District>[] = [
    { key: 'name', label: t.fieldDistrictName },
    { key: 'headquarters', label: t.fieldHeadquarters },
    { key: 'division', label: t.fieldDivision },
  ];
  const { items, loading, error, create, update, remove } = useCrud<District>('districts');
  const [editing, setEditing] = useState<District | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<District | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        <h1 className="text-lg font-semibold text-brand-text">{t.districtsTitle}</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          {t.addDistrict}
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">{t.loading}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {creating && (
        <div className="mb-4">
          <EntityForm
            fields={fields}
            onSubmit={async (v) => {
              await create(v);
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
          { key: 'name', label: t.colName },
          { key: 'headquarters', label: t.fieldHeadquarters },
          { key: 'division', label: t.fieldDivision },
        ]}
        rows={items}
        onRowClick={(d) => navigate(`/districts/${d.id}/assemblies`)}
        onEdit={setEditing}
        onDelete={(d) => {
          setDeleting(d);
          setDeleteError(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title={t.deleteDistrictTitle}
        message={deleting ? t.deleteDistrictMessage(deleting.name) : ''}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
