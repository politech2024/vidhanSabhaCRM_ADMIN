import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/districts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-brand-surface p-6 shadow">
        <h1 className="mb-4 text-lg font-semibold text-brand-text">Vidhan Sabha CRM — Admin</h1>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-3 w-full rounded-md border border-brand-border px-3 py-1.5 text-sm"
        />
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-3 w-full rounded-md border border-brand-border px-3 py-1.5 text-sm"
        />
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <button type="submit" disabled={submitting} className="w-full rounded-md bg-brand-blue px-3 py-2 text-sm font-medium text-white hover:bg-brand-blue-dark disabled:opacity-50">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
