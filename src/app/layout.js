import { Outfit } from "next/font/google";
import "../styles/globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { ToastProvider } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Dai Clothing",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" suppressHydrationWarning={true}>
        <body className={`${outfit.className} antialiased text-gray-700`} suppressHydrationWarning={true}>
          <ErrorBoundary>
            <ToastProvider>
              <AppContextProvider>
                {children}
              </AppContextProvider>
            </ToastProvider>
          </ErrorBoundary>
        </body>
      </html>
  );
}
