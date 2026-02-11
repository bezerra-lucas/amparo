import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';

export default async function AdminAuditPage() {
  const t = await getTranslations('pages.adminAudit');
  const s = await getTranslations('pages.adminAudit.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const uiOptions = await getTranslations('ui.options');
  const uiFields = await getTranslations('ui.fields');
  const samples = await getTranslations('ui.samples');
  const uiTables = await getTranslations('ui.tables');
  const bp = await getTranslations('blueprints.admin.audit');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <h2>{s('filters')}</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <FormField id="audit-from" label={uiFields('date')}>
            <Input id="audit-from" type="date" />
          </FormField>
          <FormField id="audit-to" label={uiFields('date')}>
            <Input id="audit-to" type="date" />
          </FormField>
          <FormField id="audit-user" label={bp('actor')}>
            <Input id="audit-user" defaultValue={samples('user1')} />
          </FormField>
          <FormField id="audit-action" label={bp('action')}>
            <Select id="audit-action" defaultValue="update">
              <option value="insert">{uiOptions('auditInsert')}</option>
              <option value="update">{uiOptions('auditUpdate')}</option>
              <option value="soft_delete">
                {uiOptions('auditSoftDelete')}
              </option>
            </Select>
          </FormField>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="button">{uiButtons('open')}</Button>
            <Button type="button">{uiButtons('cancel')}</Button>
          </div>
        </Card>
      </section>
      <section>
        <h2>{s('timeline')}</h2>
        <div className="grid gap-3">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bp('event')}</strong>
              <Badge variant="muted">{uiOptions('auditUpdate')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-ink-muted">
              <div>
                <strong>{bp('actor')}:</strong> {samples('user1')}
              </div>
              <div>
                <strong>{bp('table')}:</strong> {uiTables('residents')}
              </div>
              <div>
                <strong>{bp('action')}:</strong> {uiOptions('auditUpdate')}
              </div>
            </div>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bp('event')}</strong>
              <Badge variant="muted">{uiOptions('auditInsert')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-ink-muted">
              <div>
                <strong>{bp('actor')}:</strong> {samples('user1')}
              </div>
              <div>
                <strong>{bp('table')}:</strong> {uiTables('nursingReports')}
              </div>
              <div>
                <strong>{bp('action')}:</strong> {uiOptions('auditInsert')}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
