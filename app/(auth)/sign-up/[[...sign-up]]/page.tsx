'use client';

import { SignUp } from '@clerk/nextjs';
import { useTranslations } from 'next-intl';

import { PageHeader } from '@/components/common/page-header/page-header';
import { PlaceholderBlock } from '@/components/common/placeholder-block/placeholder-block';

export default function SignUpPage() {
  const t = useTranslations('pages.auth');
  const p = useTranslations('placeholders');
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <main>
      <PageHeader title={t('signUpTitle')} />
      {hasClerkKey ? <SignUp /> : <PlaceholderBlock title={p('table')} />}
    </main>
  );
}
