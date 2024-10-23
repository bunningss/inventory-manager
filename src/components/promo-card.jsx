import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";

export function PromoCard({ card }) {
  return (
    <Card className="shadow-transparent hover:shadow-transparent border-0 relative lg:h-[25vw] 2xl:min-h-[18vw] 2xl:h-[20vw] dark:bg-accent-foreground light:text-accent dark:text-card rounded-md overflow-hidden group">
      {/*  Before Card */}
      <div
        className="w-[400px] h-[900px] absolute right-[-350px] xl:right-[-250px] 2xl:right-[-200px] 3xl:right-[-150px] bottom-[-300px] rotate-[40deg] transition-all duration-300 group-hover:right-[-450px] md:group-hover:right-[-400px] xl:group-hover:right-[-320px] 2xl:group-hover:right-[-250px] 3xl:group-hover:right-[-200px]"
        style={{ backgroundColor: "#E1FCF2" }}
      />
      {/* After Card */}
      <div
        className="w-[400px] h-[900px] absolute left-[-350px] xl:left-[-250px] 2xl:left-[-200px] 3xl:left-[-180px] top-[-300px] rotate-[40deg] transition-all duration-300 group-hover:left-[-450px] md:group-hover:left-[-400px] xl:group-hover:left-[-320px] 2xl:group-hover:left-[-250px] 3xl:group-hover:left-[-250px]"
        style={{ backgroundColor: "#E1FCF2" }}
      />

      <CardContent className="h-full grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="flex flex-col justify-center items-center gap-4 z-[1]">
          <figure className="relative h-[200px] w-full lg:h-full">
            <Image
              src="https://zeris.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffruits.266247d2.png&w=384&q=75"
              alt=" Everyday Fresh & Clean With Our Products"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 350px, 400px"
            />
          </figure>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 z-[1]">
          <CardTitle className="text-center">
            Everyday Fresh & Clean With Our Products
          </CardTitle>
          <p className="text-center capitalize">
            the best electronic products in the market.
          </p>

          <Link href={`/shop`} passHref>
            <Button icon="arrowRight" variant="outline">
              shop now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
