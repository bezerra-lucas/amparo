import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { AppProviders } from '@/components/common/app-providers/app-providers';

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <html lang="pt-BR">
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            {hasClerkKey ? <ClerkProvider>{children}</ClerkProvider> : children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
