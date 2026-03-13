import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Analytics Portal',
  description: 'Multi-tenant vendor access to Zoho Analytics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
