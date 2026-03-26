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
      <body className="min-h-screen gradient-bg text-white relative overflow-x-hidden">

        <div className="glow top-[-100px] left-1/2 -translate-x-1/2" />
        <div className="glow bottom-[-150px] right-[-100px]" />

        <Providers>
          <div className="relative z-10">
            {children}
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(255,255,255,0.85)",
                color: "#0f172a",
                border: "1px solid rgba(0,0,0,0.08)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              },
              success: {
                style: {
                  background: "rgba(236,253,245,0.95)",
                  color: "#065f46",
                },
              },
              error: {
                style: {
                  background: "rgba(254,242,242,0.95)",
                  color: "#7f1d1d",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}