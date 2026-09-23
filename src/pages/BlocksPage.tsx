import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCrud } from '../hooks/useCrud';
import { DataTable } from '../components/DataTable';
import { EntityForm, type FieldConfig } from '../components/EntityForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Block } from '../types/entities';
import { useLanguage } from '../hooks/useLanguage';

export function BlocksPage() {
  const { t } = useLanguage();
  const fields: FieldConfig<Block>[] = [
    { key: 'name', label: t.fieldBlockName },
    { key: 'inchargeName', label: t.fieldBlockPresidentName },
    { key: 'inchargePhones', label: t.fieldBlockPresidentPhones, type: 'csv' },
  ];
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
      setDeleteError(err instanceof Error ? err.message : t.deleteFailed);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-brand-text">{t.blocksTitle}</h1>
        <button onClick={() => setCreating(true)} className="rounded-md bg-brand-blue px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-blue-dark">
          {t.addBlock}
        </button>
      </div>

      {loading && <p className="text-sm text-brand-text-secondary">{t.loading}</p>}
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
          { key: 'inchargeName', label: t.colBlockPresident },
        ]}
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
        title={t.deleteBlockTitle}
        message={deleting ? t.deleteBlockMessage(deleting.name) : ''}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
