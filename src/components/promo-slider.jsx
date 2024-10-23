"use client";
import { PromoCard } from "./promo-card";
import { Section } from "./section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const PromoSlider = () => {
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
          <CarouselItem className="md:basis-1/2">
            <PromoCard />
          </CarouselItem>
          <CarouselItem className="md:basis-1/2">
            <PromoCard />
          </CarouselItem>
          <CarouselItem className="md:basis-1/2">
            <PromoCard />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-1 md:left-4" />
        <CarouselNext className="right-1 md:right-4" />
      </Carousel>
    </Section>
  );
};
