import { Link } from '@inertiajs/react';
import { Award, BookOpen, Briefcase, Folder, FolderTree, Globe, Home, Image, Layers, LayoutGrid, Mail, MessageSquare, Newspaper, Package } from 'lucide-react';
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
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Divisions',
        href: '/admin/divisions',
        icon: Layers,
    },
    {
        title: 'Catégories',
        href: '/admin/categories',
        icon: FolderTree,
    },
    {
        title: 'Marques',
        href: '/admin/brands',
        icon: Award,
    },
    {
        title: 'Produits',
        href: '/admin/products',
        icon: Package,
    },
    {
        title: 'Messages de contact',
        href: '/admin/contact-messages',
        icon: MessageSquare,
    },
    {
        title: 'Newsletter',
        href: '/admin/newsletter',
        icon: Newspaper,
    },
    {
        title: 'Page d\'accueil',
        href: '/admin/homepage',
        icon: Home,
    },
    {
        title: 'Nos Solutions',
        href: '/admin/solutions',
        icon: Briefcase,
    },
    {
        title: 'Paramètres e-mail',
        href: '/admin/email-settings',
        icon: Mail,
    },
    {
        title: 'Paramètres SEO',
        href: '/admin/seo',
        icon: Globe,
    },
    {
        title: 'Médiathèque',
        href: '/admin/media',
        icon: Image,
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
