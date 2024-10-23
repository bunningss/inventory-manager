"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderItems = [
    {
      image:
        "https://raw.githubusercontent.com/glimmrz/algomart/refs/heads/master/src/assets/banner-images/main-banner-1.png?token=GHSAT0AAAAAACZMAZI54P4Z6CKA7ACSOOSYZYYRKBQ",
      subtitle: "pure cotton",
      text: "explore the all new summer collection",
      buttonLabel: "browse shop",
      buttonIcon: "arrowRight",
    },
    {
      image:
        "https://raw.githubusercontent.com/glimmrz/algomart/refs/heads/master/src/assets/banner-images/main-banner-2.png?token=GHSAT0AAAAAACZMAZI5K4GHDFTRPCFJAZMKZYYRLAA",
      subtitle: "organic vegetables",
      text: "everyday health with organic vegetables.",
      buttonLabel: "shop now",
      buttonIcon: "arrowRight",
    },
  ];

  function nextSlide() {
    setCurrentIndex((prev) => (prev + 1) % sliderItems.length);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="rounded-md bg-accent h-[75vh] lg:h-[70vh] max-h-[700px] lg:max-h-[600px] flex items-center justify-center select-none">
      <>
        <div className="relative h-full max-w-screen-2xl w-full">
          {/* SLider item */}
          {sliderItems.map((item, index) => (
            <div
              className={`absolute top-0 left-0 h-full w-full flex flex-col-reverse gap-2 opacity-0 transition-opacity duration-500 lg:grid lg:grid-cols-2 ${
                currentIndex === index && "!opacity-100 !z-[3]"
              }`}
              key={index}
            >
              <div
                className={`p-2 w-full flex flex-col justify-center items-center gap-2 lg:gap-4 lg:items-start xl:w-[80%] ${
                  currentIndex === index && "lg:animate-slideIn"
                }`}
              >
                <p className="text-xl lg:text-3xl capitalize text-center lg:text-left">
                  <span className="text-theme">100%</span> {item.subtitle}
                </p>
                <h2 className="text-3xl text-center lg:text-left lg:text-5xl xl:text-6xl first-letter:capitalize">
                  {item.text}
                </h2>
                <p className="text-center lg:text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
                  reiciendis beatae consequuntur.
                </p>

                <Link href={item.link ? item.link : "#"}>
                  <Button icon="arrowRight">{item?.buttonLabel}</Button>
                </Link>
              </div>

              <figure className="relative h-full w-full">
                <Image
                  src={item.image}
                  alt={item.text}
                  className="object-cover object-right lg:object-center  xl:object-right"
                  fill
                  sizes="(max-width: 768px) 500px, 50vw"
                  priority
                />
              </figure>
            </div>
          ))}

          {/* Slider dots */}
          <div className="hidden w-fit absolute bottom-2 left-2 gap-2 z-[3] lg:flex">
            {sliderItems?.map((_, i) => (
              <div
                role="button"
                aria-label="slider position indicator"
                className={`h-[15px] w-[15px] skew-x-[320deg] border-2 border-primary cursor-pointer transition-[width,background-color] duration-500 ${
                  currentIndex === i ? "bg-primary w-[30px]" : ""
                }`}
                key={i}
                onClick={() => setCurrentIndex(i)}
              ></div>
            ))}
          </div>
        </div>
      </>
    </div>
  );
}
