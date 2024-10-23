"use client";
import { CategoryBox } from "./category-box";
import { Section } from "./section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const CategoryView = ({ categories }) => {
  if (!categories || categories?.length <= 0) return null;

  return (
    <Section>
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent>
          {categories?.map((category, index) => (
            <CarouselItem
              key={index}
              className="basis-1/2 md:basis-1/4 lg:basis-1/6 xl:basis-[12.5%]"
            >
              <CategoryBox category={category} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 md:left-4" />
        <CarouselNext className="right-1 md:right-4" />
      </Carousel>
    </Section>
  );
};
