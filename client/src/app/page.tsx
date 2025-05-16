
export default function Home() {


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold">OnChainFC</h1>
      <div className="flex flex-col gap-4">
        <p className="text-lg">Welcome to OnChainFC!</p>
        <p className="text-lg">Your one-stop solution for on-chain football management.</p>
      </div>
      <footer className="text-sm text-gray-500">
        &copy; 2023 OnChainFC. All rights reserved.
      </footer>
    </div>
  );
}
