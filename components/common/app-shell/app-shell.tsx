import { AppNav } from '@/components/common/app-nav/app-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200">
        <div className="mx-auto w-full max-w-5xl px-4 py-3">
          <AppNav />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </div>
  );
}
