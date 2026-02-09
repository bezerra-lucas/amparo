import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common/page-header/page-header';
import { PlaceholderBlock } from '@/components/common/placeholder-block/placeholder-block';

export default async function NotFoundPage() {
  const t = await getTranslations('pages.notFound');
  const p = await getTranslations('placeholders');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <PlaceholderBlock title={p('table')} />
    </main>
  );
}
