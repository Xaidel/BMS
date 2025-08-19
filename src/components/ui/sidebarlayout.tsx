import AppSidebar from "./appsidebar";
import { SidebarProvider } from "./sidebar";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar onHover={function (): void {
        throw new Error("Function not implemented.");
      } } onOut={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <main>
        {children}
      </main>
    </SidebarProvider>
  )
}
