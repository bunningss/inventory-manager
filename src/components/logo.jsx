import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/springbird.svg";

export function Logo() {
  return (
    <Link href="/">
      <figure className="relative h-[50px] w-[150px]">
        <Image
          src={logo}
          alt="springbird logo"
          className="cobject-contain"
          sizes="120px"
          fill
        />
      </figure>
    </Link>
  );
}
