"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenuItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; 
import Link from "next/link"; // Correct import
import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
import { usePathname } from "next/navigation";

const applicationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Q/A", url: "/qa", icon: Bot },  // Still in applicationItems
    { title: "Meetings", url: "/meetings", icon: Presentation },
    { title: "Billing", url: "/billing", icon: CreditCard }
];

export function AppSidebar() {
    const pathname = usePathname();
    
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>Logo</SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {applicationItems.map((item) => {
                            const Icon = item.icon; // Fix dynamic JSX component
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuSubButton asChild>
                                        <Link 
                                            href={item.url} 
                                            className={cn({ "!bg-primary !text-white": pathname === item.url }, "flex items-center gap-2 p-2 rounded-md")}
                                        >
                                            <Icon className="w-5 h-5" /> 
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar> 
    );
}
