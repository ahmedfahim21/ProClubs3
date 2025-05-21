import type { Metadata } from "next";
import "./globals.css";
import WalletContextProvider from "../providers/walletcontextprovider";

export const metadata: Metadata = {
  title: "ProClubs3"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
