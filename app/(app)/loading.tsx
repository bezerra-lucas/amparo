import { getTranslations } from 'next-intl/server';

export default async function AppLoading() {
  const t = await getTranslations('common');

  return (
    <main aria-busy="true" aria-live="polite">
      <section className="mt-0 space-y-4">
        <div className="inline-flex items-center gap-3 rounded-full border border-line bg-canvas px-4 py-2 text-sm text-ink-muted">
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
          />
          <span>{t('loadingPage')}</span>
        </div>
        <p>{t('loadingDescription')}</p>
      </section>

      <section className="grid gap-3">
        {['top', 'middle', 'bottom'].map((block) => (
          <div
            key={block}
            className="h-28 animate-pulse rounded-xl border border-line/80 bg-surface"
          />
        ))}
      </section>
    </main>
  );
}
