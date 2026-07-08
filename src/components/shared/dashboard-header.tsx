import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/shared/user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HeaderSearch } from "@/components/shared/header-search";
import { Bell } from "lucide-react";
import { getNotifications } from "@/lib/actions/notifications";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type DashboardHeaderProps = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export async function DashboardHeader({ email, fullName, avatarUrl }: DashboardHeaderProps) {
  const notifications = await getNotifications();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <HeaderSearch />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
       <DropdownMenu>
  <DropdownMenuTrigger
  className="relative inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
  aria-label="Notifications"
>
  <Bell className="h-5 w-5" />

  {notifications.length > 0 && (
    <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full bg-gold p-0 text-[10px] text-primary-foreground">
      {notifications.length}
    </Badge>
  )}
</DropdownMenuTrigger>

  <DropdownMenuContent align="end" className="w-80">
    <div className="px-3 py-2 font-semibold">
      Notifications
    </div>

    <DropdownMenuSeparator />

    {notifications.length === 0 ? (
      <div className="px-3 py-3 text-sm text-muted-foreground">
        You're all caught up 🎉
      </div>
    ) : (
      notifications.map((notification) => (
        <div
          key={notification.id}
          className="px-3 py-3 border-b last:border-b-0"
        >
          <p className="font-medium">
            {notification.title}
          </p>

          <p className="text-sm text-muted-foreground">
            {notification.description}
          </p>
        </div>
      ))
    )}
  </DropdownMenuContent>
</DropdownMenu>
        <Separator orientation="vertical" className="h-6" />
        <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}