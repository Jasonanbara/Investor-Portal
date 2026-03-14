import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first, then Accept-Language header, default to 'en'
  const cookieStore = await cookies();
  const headerStore = await headers();

  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  if (!locale) {
    const acceptLanguage = headerStore.get('accept-language') || '';
    if (acceptLanguage.includes('fr')) {
      locale = 'fr';
    }
  }

  // Validate locale
  if (!locale || !['en', 'fr'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
