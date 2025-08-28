
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Goal,
  BarChart,
  PiggyBank,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/expenses', label: 'Expenses', icon: Wallet },
    { href: '/budgets', label: 'Budgets', icon: Goal },
    { href: '/reports', label: 'Reports', icon: BarChart },
    { href: '/investments', label: 'Investments', icon: TrendingUp },
    { href: '/goals', label: 'Goals', icon: Target },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-1">
            <Button variant="ghost" size="icon" className="text-primary hover:bg-accent" asChild>
                <Link href="/">
                    <PiggyBank className="h-6 w-6" />
                </Link>
            </Button>
            <h1 className="text-xl font-semibold text-foreground">SpendWise</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} className="justify-start">
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="p-4 border-b flex items-center sticky top-0 bg-background/80 backdrop-blur-sm z-10">
          <SidebarTrigger className="md:hidden" />
          <h2 className="text-xl font-semibold ml-2">
            {navItems.find((item) => item.href === pathname)?.label ||
              'Dashboard'}
          </h2>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
