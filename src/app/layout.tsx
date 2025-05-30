import type { Metadata } from 'next';
import { Montserrat, Crimson_Pro } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
              subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap', // Mejora el rendimiento de carga
});

const crimsonpro = Crimson_Pro({
  variable: '--font-crimson-pro',
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap', // Mejora el rendimiento de carga
});

export const metadata: Metadata = {
  title: 'Frases estoicas',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${crimsonpro.variable}`}>{children}</body>
    </html>
  );
}
