import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/shared/user-menu";
import { Bell } from "lucide-react";

type DashboardHeaderProps = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export function DashboardHeader({ email, fullName, avatarUrl }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
        </Button>
        <UserMenu email={email} fullName={fullName} avatarUrl={avatarUrl} />
      </div>
    </header>
  );
}