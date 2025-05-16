import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/ui/app-sidebar";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
}
