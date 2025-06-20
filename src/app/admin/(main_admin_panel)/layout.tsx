
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import Logo from '@/components/icons/Logo';
import { LayoutDashboard, Package, PlusCircle, LogOut, Settings } from 'lucide-react';
import { handleLogout } from '@/app/admin/login/actions'; // Corrected import path

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
        <SidebarHeader className="items-center">
          <Link href="/admin" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="h-8 w-auto group-data-[collapsible=icon]:h-7 group-data-[collapsible=icon]:w-7" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </Link>
           <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Products">
                <Link href="/admin/products">
                  <Package />
                  <span>Products</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Add Product">
                <Link href="/admin/products/add">
                  <PlusCircle />
                  <span>Add Product</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Account Settings">
                <Link href="/admin/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto p-2 group-data-[collapsible=icon]:p-0">
            <form action={handleLogout} className="w-full">
              <SidebarMenuButton 
                type="submit" 
                className="w-full justify-start group-data-[collapsible=icon]:justify-center"
                tooltip="Logout"
                variant="ghost"
              >
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <main className="p-4 md:p-6 lg:p-8">
         {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
