import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
} from "./ui/sidebar";
import { Logo } from "./logo";
import { Link, useLocation } from "react-router";
import { NavUser } from "./nav-user";
import {
  LayoutDashboardIcon,
  ReceiptText,
  UserPlus,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Clientes",
    url: "/clients/table",
    icon: Users,
  },
  {
    title: "Registrar cliente",
    url: "/clients",
    icon: UserPlus,
  },
  {
    title: "Faturas",
    url: "/invoice",
    icon: ReceiptText,
  },
];

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link to="/dashboard">
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {NAV_MAIN.map((item) => {
                const isCurrentPath = pathname.endsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={cn(
                        "hover:bg-blue-100 hover:text-blue-500 transition-all ease-in duration-100 font-medium",
                        isCurrentPath && "text-blue-500  bg-blue-100"
                      )}
                      asChild
                      tooltip={item.title}>
                      <Link to={item.url} viewTransition>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};
