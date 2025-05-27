import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { HeaderSeller } from "./components/HeaderSeller"
import { AuthProviderSeller } from "./AuthContext"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <AuthProviderSeller>
      <main className="w-full">
        <div className="relative">
          <HeaderSeller />
          <SidebarTrigger className="absolute top-0"/>
        </div>
        {children}
      </main>
      </AuthProviderSeller>
    </SidebarProvider>
  )
}