import Link from "next/link";

const inputClassName =
  "rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

type AuthFieldProps = {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
};

export function AuthField({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  required = true,
  minLength,
}: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className={inputClassName}
      />
    </label>
  );
}

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50/80 to-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-medium uppercase tracking-wider text-primary">
            Travel Plan
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted">{description}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-muted">{footer}</p>
      </div>
    </main>
  );
}

export function AuthMessage({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (success) {
    return <p className="text-sm text-emerald-600">{success}</p>;
  }

  return null;
}

export const authInputClassName = inputClassName;
