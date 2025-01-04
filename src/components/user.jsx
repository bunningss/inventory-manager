"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "@/utils/auth";
import { Icon } from "./icon";
import { useRouter } from "next/navigation";
import { permissions } from "@/lib/static";

export function User({ userData }) {
  const router = useRouter();

  const isAllowed =
    permissions[userData?.payload?.role]?.can?.includes("view:dashboard") ||
    permissions[userData?.payload?.role]?.can?.includes("manage:all");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src=""
            alt={userData?.payload?.name ? userData.payload?.name : ""}
          />
          <AvatarFallback>IL</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="capitalize">
          {userData?.payload?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userData?.error !== undefined && !userData.error && (
          <>
            <Link passHref href="/user/profile" className="w-full">
              <DropdownMenuItem>
                <span>profile</span>
                <Icon size={22} icon="user" />
              </DropdownMenuItem>
            </Link>
            <Link passHref href="/user/orders" className="w-full">
              <DropdownMenuItem>
                <span>orders</span>
                <Icon size={22} icon="order" />
              </DropdownMenuItem>
            </Link>
          </>
        )}
        {isAllowed && (
          <Link href="/dashboard" passHref prefetch={true}>
            <DropdownMenuItem>
              <span>dashboard</span>
              <Icon size={22} icon="dashboard" />
            </DropdownMenuItem>
          </Link>
        )}
        {userData?.error === undefined ||
          (!userData?.error && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.refresh();
                }}
              >
                <span>logout</span>
                <Icon icon="logout2" size={22} />
              </DropdownMenuItem>
            </>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
