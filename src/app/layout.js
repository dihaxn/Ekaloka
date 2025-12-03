import { Outfit } from 'next/font/google';

import '../styles/globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ToastProvider } from '@/components/Toast';
import { AppContextProvider } from '@/context/AppContext';

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'DF Dai Fashion - Premium Fashion Collection',
  description:
    'Discover your style with our exclusive fashion collection. Premium clothing, accessories, and lifestyle pieces for the modern fashionista.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning={true}
      data-scroll-behavior='smooth'
    >
      <body
        className={`${outfit.className} antialiased text-gray-700`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <ToastProvider>
            <AppContextProvider>{children}</AppContextProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
