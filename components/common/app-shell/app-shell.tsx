import { AppNav } from '@/components/common/app-nav/app-nav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-brand-100/70 via-brand-50/30 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[-4.5rem] -z-10 h-64 w-64 rounded-full bg-brand-200/35 blur-3xl"
      />

      <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/90 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <AppNav />
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4">{children}</div>
    </div>
  );
}
