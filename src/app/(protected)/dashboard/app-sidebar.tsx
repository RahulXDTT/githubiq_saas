"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; 
import Link from "next/link"; // Correct import
import { Bot, CreditCard, LayoutDashboard, Presentation } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "react-day-picker";
import { buttonVariants } from '@/components/ui/button';


const applicationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Q/A", url: "/qa", icon: Bot },  // Still in applicationItems
    { title: "Meetings", url: "/meetings", icon: Presentation },
    { title: "Billing", url: "/billing", icon: CreditCard }
];

const projects=[
    {
        name: 'Project-1'
    },

    {
        name: 'Project-2'
    },

    {
        name: 'Project-3'
    },
]

export function AppSidebar() {
    const pathname = usePathname();
    
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>Logo</SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>  {applicationItems.map((item) => {
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
                        })} </SidebarMenu>
                        
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                       <SidebarMenu>
                       {projects.map(project => {
    return (
        <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
                <div>
                <div className={cn(
                        'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                        {
                            'bg-primary text-white': true
                        }
                    )}>
                        {project.name[0]}
                    </div>
                    <span>{project.name}</span>
                </div>
                    
                
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
})}
<div className="h-2"></div>
<SidebarMenuItem>
<Button variant ={'outline'} className="w-fit"> 

</Button>                                            
</SidebarMenuItem>
                            
                       </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar> 
    );
}
