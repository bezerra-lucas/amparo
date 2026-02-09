import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { PageHeader } from '@/components/common/page-header/page-header';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';

export default async function AccessPendingPage() {
  const t = await getTranslations('pages.accessPending');
  const s = await getTranslations('pages.accessPending.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const bp = await getTranslations('blueprints.accessPending');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <h2>{s('status')}</h2>
        <Card className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <strong>{bp('status.title')}</strong>
            <Badge variant="warning">{t('title')}</Badge>
          </div>
          <p>{bp('status.body')}</p>
        </Card>
      </section>
      <section>
        <h2>{s('instructions')}</h2>
        <Card className="space-y-2">
          <strong>{bp('instructions.title')}</strong>
          <p>{bp('instructions.body')}</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard">
              <Button type="button">{uiButtons('open')}</Button>
            </Link>
          </div>
        </Card>
      </section>
    </main>
  );
}
