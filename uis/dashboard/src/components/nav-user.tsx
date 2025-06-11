import { useAuth } from "@/hooks/useAuth";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOutIcon, Moon, Sun, UserCircleIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { ApiLogout } from "@/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { ProfileModal } from "./modals/profile-modal";
import { useProfileModal } from "@/hooks/use-profile-modal";
import { useTheme } from "@/context/theme-provider";

export const NavUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const { onOpen } = useProfileModal();
  const { setTheme, theme } = useTheme();
  const queryClient = useQueryClient();

  const logOut = useCallback(async () => {
    const { ok } = await ApiLogout();

    if (ok) {
      queryClient.removeQueries();
      navigate("/sign-in", { replace: true });
    }
  }, []);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage
                    src={user?.avatarUrl || ""}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onOpen} className="cursor-pointer">
                  <UserCircleIcon />
                  Conta
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setTheme(theme === "light" ? "dark" : "light");
                  }}
                  className="cursor-pointer">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  Tema
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                <LogOutIcon />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {user && <ProfileModal user={user} />}
    </>
  );
};
