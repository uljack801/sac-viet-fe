"use client"
import { CategoryProps } from "@/app/utils/fetchCategory"
import { useRouter } from "next/navigation";
import Image from "next/image";
export const CategoryList = ({listCategory}: {listCategory: CategoryProps | null}) => {
      const route = useRouter();
    return (
        <div className="mt-10 grid grid-cols-6 text-[var(--color-text-root)] max-sm:hidden m-2 max-lg:text-sm">
        {listCategory?.data.map((value, idx) => {
            return (
              <div key={idx} className="flex flex-col justify-center items-center text-sm font-medium bg-white m-1 p-4 rounded-xl shadow hover:scale-[1.03] hover:bg-neutral-100 text-center" onClick={() => route.push(`/${value.slug}`)}>
                  <Image src={`/category/${value.icon}`} alt={value.slug} width={60} height={120} className="w-auto h-1/2 object-cover"/> 
                <p className="h-1/2 " title={value.name}>{value.name}</p>
              </div>
            )
          })}
        </div>
    )
}