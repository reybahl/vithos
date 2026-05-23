import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronsUpDown,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@repo/ui/components/sidebar";

import { authClient } from "../lib/auth-client";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase();
  }
  return (name.slice(0, 2) || "?").toUpperCase();
}

function NavMain() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isDashboardActive =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem
          className={`transition-colors hover:bg-sidebar-primary/8 ${
            isDashboardActive ? "bg-sidebar-primary/12" : ""
          }`}
        >
          <SidebarMenuButton
            asChild
            tooltip="Dashboard"
            className="h-9 text-sm"
            isActive={isDashboardActive}
          >
            <Link to="/dashboard">
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem className="transition-colors hover:bg-sidebar-primary/8">
          <SidebarMenuButton
            tooltip="Settings (coming soon)"
            className="h-9 text-sm"
          >
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser({
  user,
  isAuthenticated,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  isAuthenticated: boolean;
}) {
  const { isMobile } = useSidebar();

  async function handleSignOut() {
    await authClient.signOut();
    window.location.assign("/signin");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg">
                  {initialsFromName(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-none"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              {isAuthenticated ? (
                <DropdownMenuItem onClick={() => void handleSignOut()}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => window.location.assign("/signin")}
                >
                  <LogIn />
                  Sign in
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & { children?: React.ReactNode }) {
  const session = authClient.useSession();
  const u = session.data?.user;
  const isAuthenticated = Boolean(u);
  const navUser = {
    name: u?.name ?? "Guest",
    email: u?.email ?? "",
    avatar: typeof u?.image === "string" ? u.image : "",
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="Dashboard">
                <Link to="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <LayoutDashboard className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">vithos</span>
                    <span className="truncate text-xs">Dashboard</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={navUser} isAuthenticated={isAuthenticated} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 md:px-6">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
