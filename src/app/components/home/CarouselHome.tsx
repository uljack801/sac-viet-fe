"use client"
import { CarouselMain } from "../body/CarouselMain"
import Image from "next/image";

export const CarouselHome = () => {
  return (
    <div className="flex ">
      <div className="w-2/3 max-sm:w-full">
        <CarouselMain />
      </div>
      <div className="w-1/3 m-1  max-sm:hidden">
        <div className="h-1/2 relative mb-1 border rounded-xl">
          <Image src={"/Web1.jpeg"} alt="1231232" fill className="object-cover rounded-xl" />
        </div>
        <div className="h-1/2 relative border rounded-xl">
          <Image src={"/Web2.jpeg"} alt="1231232" fill className="object-cover rounded-xl" />
        </div>
      </div>
    </div>
  )
}