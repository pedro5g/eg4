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
import { cn, isJavaVersion } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const NAV_MAIN =
  import.meta.env.VITE_APP_VERSION !== "aula"! && isJavaVersion()
    ? [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboardIcon,
        },
        {
          title: "Registrar cliente",
          url: "/clients",
          icon: UserPlus,
        },
        {
          title: "Clientes",
          url: "/clients/table",
          icon: Users,
        },
        {
          title: "Faturas",
          url: "/invoice",
          icon: ReceiptText,
        },
      ]
    : [
        {
          title: "Registrar cliente",
          url: "/clients",
          icon: UserPlus,
        },
        {
          title: "Clientes",
          url: "/clients/table",
          icon: Users,
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
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: NAV_MAIN.indexOf(item) * 0.1 }}>
                    <SidebarMenuItem className="relative overflow-hidden">
                      <SidebarMenuButton
                        className={cn(
                          "hover:bg-transparent hover:text-blue-500 font-medium relative z-10 transition-colors duration-200",
                          isCurrentPath && "text-blue-500"
                        )}
                        asChild
                        tooltip={item.title}>
                        <Link to={item.url} viewTransition>
                          <motion.div
                            className="flex items-center gap-2 w-full"
                            whileHover={{ x: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            }}>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}>
                              {item.icon && <item.icon />}
                            </motion.div>
                            <span>{item.title}</span>
                          </motion.div>
                        </Link>
                      </SidebarMenuButton>

                      <motion.div
                        className="absolute inset-0 bg-blue-50 rounded-md"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />

                      <AnimatePresence mode="wait">
                        {isCurrentPath && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md"
                            layoutId="activeTabBackground"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        )}
                      </AnimatePresence>
                    </SidebarMenuItem>
                  </motion.div>
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
