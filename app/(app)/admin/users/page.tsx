import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/common/page-header/page-header';
import { FormField } from '@/components/common/form-field/form-field';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Select } from '@/components/ui/select/select';

export default async function AdminUsersPage() {
  const t = await getTranslations('pages.adminUsers');
  const s = await getTranslations('pages.adminUsers.sections');
  const uiButtons = await getTranslations('ui.buttons');
  const uiOptions = await getTranslations('ui.options');
  const samples = await getTranslations('ui.samples');
  const bp = await getTranslations('blueprints.admin.users');

  return (
    <main>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section>
        <h2>{s('list')}</h2>
        <div className="grid gap-3">
          <Card className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <strong>{bp('listTitle')}</strong>
              <Badge variant="muted">{bp('active')}</Badge>
            </div>
            <div className="grid gap-1 text-sm text-ink-muted">
              <div>
                <strong>{bp('email')}:</strong> {samples('user1')}
              </div>
              <div>
                <strong>{bp('role')}:</strong> {uiOptions('roleAdmin')}
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section>
        <h2>{s('roles')}</h2>
        <Card className="grid gap-4 sm:grid-cols-2">
          <FormField id="user-email" label={bp('email')}>
            <Input id="user-email" defaultValue={samples('user1')} />
          </FormField>
          <FormField id="user-role" label={bp('role')}>
            <Select id="user-role" defaultValue="admin">
              <option value="admin">{uiOptions('roleAdmin')}</option>
              <option value="nurse">{uiOptions('roleNurse')}</option>
              <option value="caregiver">{uiOptions('roleCaregiver')}</option>
              <option value="collaborator">
                {uiOptions('roleCollaborator')}
              </option>
            </Select>
          </FormField>
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <Button type="button">{uiButtons('save')}</Button>
            <Button type="button">{uiButtons('cancel')}</Button>
          </div>
        </Card>
      </section>
      <section>
        <h2>{s('invite')}</h2>
        <div className="flex flex-wrap gap-2">
          <Button type="button">{uiButtons('new')}</Button>
        </div>
      </section>
    </main>
  );
}
