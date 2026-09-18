interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, error, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-lg bg-brand-surface p-5 shadow-xl">
        <h3 className="text-base font-semibold text-brand-text">{title}</h3>
        <p className="mt-1.5 text-sm text-brand-text-secondary">{message}</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-brand-text-secondary hover:bg-brand-bg">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
