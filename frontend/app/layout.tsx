import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 dark:bg-black">
        <Providers>
          {children}

          {/* ✅ Toast container */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </Providers>
      </body>
    </html>
  );
}