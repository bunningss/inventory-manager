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

export function User({ userData }) {
  const router = useRouter();

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
          {userData?.payload?.name ? userData.payload?.name : "My account"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(!userData || userData?.error) && (
          <>
            <Link passHref href="/login" className="w-full">
              <DropdownMenuItem>
                <span>login</span>
                <Icon icon="login2" size={22} />
              </DropdownMenuItem>
            </Link>
            <Link passHref href="/register" className="w-full">
              <DropdownMenuItem>
                <span>sign up</span>
                <Icon icon="register" size={22} />
              </DropdownMenuItem>
            </Link>
          </>
        )}
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
        {userData?.payload?.role === "admin" && (
          <Link href="/dashboard" passHref>
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
