"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/actions/auth";
import { LogOut } from "lucide-react";

type UserMenuProps = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export function UserMenu({
  email,
  fullName,
  avatarUrl,
}: UserMenuProps) {
  const initials = (fullName ?? email).slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full">
  <Avatar className="h-8 w-8">
    <AvatarImage
      src={avatarUrl ?? undefined}
      alt={fullName ?? email}
    />
    <AvatarFallback>{initials}</AvatarFallback>
  </Avatar>
</DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
  <div className="px-2 py-1.5">
    <div className="flex flex-col">
      <span className="font-medium">
        {fullName ?? "Student"}
      </span>
      <span className="text-xs text-muted-foreground">
        {email}
      </span>
    </div>
  </div>

  <DropdownMenuSeparator />

  <DropdownMenuItem>
    <form action={signOut} className="w-full">
      <button
        type="submit"
        className="flex w-full items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  </DropdownMenuItem>
</DropdownMenuContent>
    </DropdownMenu>
  );
}