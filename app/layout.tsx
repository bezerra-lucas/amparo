import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Source_Sans_3, Spectral } from 'next/font/google';

import { AppProviders } from '@/components/common/app-providers/app-providers';

export const dynamic = 'force-dynamic';

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

const headingFont = Spectral({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '600', '700']
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${headingFont.variable}`}
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            {hasClerkKey ? <ClerkProvider>{children}</ClerkProvider> : children}
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
