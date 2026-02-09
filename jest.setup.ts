import '@testing-library/jest-dom';
import type { ReactNode } from 'react';
import React from 'react';

jest.mock('next-intl', () => {
  return {
    __esModule: true,
    useTranslations: (namespace: string) => {
      return (key: string) => `${namespace}.${key}`;
    },
    NextIntlClientProvider: ({ children }: { children: ReactNode }) => children
  };
});

// Minimal Next.js mocks for unit tests
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children }: { href: string; children: ReactNode }) => {
      return React.createElement('a', { href }, children);
    }
  };
});
