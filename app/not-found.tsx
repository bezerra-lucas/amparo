import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { EmptyState } from '@/components/common/empty-state/empty-state';
import { PageHeader } from '@/components/common/page-header/page-header';
import { Button } from '@/components/ui/button/button';

export default async function NotFoundPage() {
  const t = await getTranslations('pages.notFound');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <EmptyState
          title={t('emptyState.title')}
          description={t('emptyState.description')}
          action={
            <Link href="/dashboard">
              <Button type="button">{t('emptyState.openDashboard')}</Button>
            </Link>
          }
        />
      </section>
    </main>
  );
}
