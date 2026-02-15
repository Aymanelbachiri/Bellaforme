import { Link } from '@inertiajs/react';
import { Award, BookOpen, Folder, FolderTree, Globe, Home, Layers, LayoutGrid, Mail, MessageSquare, Package } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Divisions',
        href: '/admin/divisions',
        icon: Layers,
    },
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Brands',
        href: '/admin/brands',
        icon: Award,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Contact Messages',
        href: '/admin/contact-messages',
        icon: MessageSquare,
    },
    {
        title: 'Homepage Settings',
        href: '/admin/homepage',
        icon: Home,
    },
    {
        title: 'Email Settings',
        href: '/admin/email-settings',
        icon: Mail,
    },
    {
        title: 'SEO Settings',
        href: '/admin/seo',
        icon: Globe,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
