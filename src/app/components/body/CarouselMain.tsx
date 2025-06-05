"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

export function CarouselMain() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  const dataImg = [
    "/BWeb.png",
  ]
  
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full relative "
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {dataImg?.map((value, index) => (
          <CarouselItem key={index}>
            <div>
              <Card className="p-0 mt-1">
                <CardContent className=" relative h-80 w-full flex items-center justify-center">
                <Image src={value}  alt={`Image ${index}`} fill className="object-cover rounded-sm" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-3 bg-inherit border-0 text-white hover:bg-inherit hover:text-neutral-500"/>
      <CarouselNext className="absolute right-3 bg-inherit border-0 text-white hover:bg-inherit hover:text-neutral-500"/>
    </Carousel>
  )
}
