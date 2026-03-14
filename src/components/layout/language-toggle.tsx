'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function getLocaleFromCookie(): string {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  return match ? match[1] : 'en';
}

function setLocaleCookie(locale: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    setLocale(getLocaleFromCookie());
  }, []);

  const handleToggle = () => {
    const newLocale = locale === 'en' ? 'fr' : 'en';
    setLocale(newLocale);
    setLocaleCookie(newLocale);
    // Refresh the page to apply the new locale via next-intl
    router.refresh();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1.5 rounded-lg border border-[#3a3c4e] bg-[#2E3040] px-2.5 py-1.5 text-sm font-medium text-[#CFD2E5] transition-colors hover:bg-[#353748] hover:border-[#C6AB4E]/50"
      title={locale === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <Globe className="h-4 w-4 text-[#8b8fa3]" />
      <span className="uppercase">{locale}</span>
    </button>
  );
}
