"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Icon } from "../icon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const sidebarItems = [
  {
    label: "profile",
    link: "profile",
    icon: "user",
  },
  {
    label: "orders",
    link: "orders",
    icon: "order",
  },
];

export function ProfileSidebar({ userData }) {
  return (
    <aside className="hidden lg:block w-[300px] h-fit bg-accent rounded-md shadow-regular overflow-hidden transition-all duration-300 min-w-[300px] lg:sticky lg:top-[calc(theme(height.16)+theme(height.14)+theme(gap.2))]">
      <header className="relative">
        <figure className="relative h-[100px]">
          <Image
            src="https://zeris.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcover.7c22d4c7.png&w=640&q=75"
            alt={`${userData?.name}'s cover photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 350px"
          />

          <div className="absolute w-fit -bottom-5 left-0 right-0 m-auto">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/93987679?s=48&v=4"
                alt={userData?.name}
              />
              <AvatarFallback>IL</AvatarFallback>
            </Avatar>
          </div>
        </figure>

        <div className="mt-6 text-center border-b-[1px] border-muted pt-2 pb-2">
          <CardTitle>{userData?.name}</CardTitle>
          <p className="text-base opacity-70">{userData?.email}</p>
        </div>
      </header>

      <div className="flex flex-col gap-2 p-2">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))}
      </div>
    </aside>
  );
}

function SidebarItem({ item }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      variant="outline"
      className={`border-0 shadow-regular w-full justify-start text-base text-inherit hover:bg-accent transition-all duration-300 ${
        pathname?.split("/")[2] === item?.link &&
        "bg-accent shadow-active border-l-[5px] border-primary text-primary"
      }`}
      onClick={() => router.push(`/user/${item?.link}`)}
    >
      <Icon icon={item.icon} size={24} />
      <span>{item.label}</span>
    </Button>
  );
}
