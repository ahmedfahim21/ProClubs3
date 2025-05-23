
"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // @ts-expect-error handled
  return <WalletProvider>{children}</WalletProvider>;
}