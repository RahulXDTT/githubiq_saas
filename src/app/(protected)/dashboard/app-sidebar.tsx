"use client";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils"; 
import Link from "next/link"; // Correct import
import { Bot, CreditCard, LayoutDashboard, Plus, Presentation } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from '@/components/ui/button'; // Import your custom Button component
import { buttonVariants } from '@/components/ui/button';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Image from "next/image";
import useProject from "@/hooks/use-project";

const applicationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Q/A", url: "/qa", icon: Bot },  // Still in applicationItems
    { title: "Meetings", url: "/meetings", icon: Presentation },
    { title: "Billing", url: "/billing", icon: CreditCard }
];



export function AppSidebar() {
    const pathname = usePathname();
    const {projects, projectId, setProjectId} = useProject();
    
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Image src='/logo.png' alt="logo" width={200} height={180}/>

                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map(project => {
                                return (
                                    <SidebarMenuItem key={project.name}>
                                        <SidebarMenuButton asChild>
                                            <div onClick={()=>{
                                                setProjectId(project.id)
                                            }}>
                                                <div className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                    {
                                                        'bg-primary text-white' : project.id === projectId

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
                                <Link href="/create">
                                    <Button size = 'sm' variant="outline" className="w-fit">
                                        <Plus/>
                                        Create
                                    </Button>
                                </Link>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
