"use client"
import { CarouselMain } from "../body/CarouselMain"
import Image from "next/image";

export const CarouselHome = () => {
    return(
        <div className="flex">
        <div className="w-2/3">
          <CarouselMain />
        </div>
        <div className="w-1/3 m-1">
          <div className="h-1/2 relative mb-1 border">
            <Image src={"/do-tho/dia-ngoc.webp"} alt="1231232" fill className="object-cover" />
          </div>
          <div className="h-1/2 relative border">
            <Image src={"/do-tho/bo-bat-dia.webp"} alt="1231232" fill className="object-cover" />
          </div>
        </div>
      </div>
    )
}