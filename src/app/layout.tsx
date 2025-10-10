import { Providers } from "./providers";
import "../index.css";
import BetaFeedbackButton from "@/components/beta/BetaFeedbackButton";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <BetaFeedbackButton />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}