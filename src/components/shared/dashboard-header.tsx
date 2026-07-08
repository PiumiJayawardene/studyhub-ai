import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/shared/user-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { HeaderSearch } from "@/components/shared/header-search";
import { Bell } from "lucide-react";

type DashboardHeaderProps = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export function DashboardHeader({ email, fullName, avatarUrl }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <HeaderSearch />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
       <Button
  variant="ghost"
  size="icon"
  aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full bg-gold p-0 text-[10px] text-primary-foreground">
            3
          </Badge>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}