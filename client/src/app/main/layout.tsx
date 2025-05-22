import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Navbar from "@/components/navbar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex h-screen bg-gray-900 text-white">
            <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <div className="flex-1 overflow-auto">
                {children}
                </div>
            </div>
            </SidebarProvider>
        </main>
    );
}
