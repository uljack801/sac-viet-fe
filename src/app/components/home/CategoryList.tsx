"use client"
import { CategoryProps } from "@/app/utils/fetchCategory"
import { useRouter } from "next/navigation";

export const CategoryList = ({listCategory}: {listCategory: CategoryProps | null}) => {
      const route = useRouter();
    return (
        <div className="mt-10 grid grid-cols-6 text-[var(--color-text-root)]">
        {listCategory?.data.map((value, idx) => {
            return (
              <div key={idx} className="m-1" onClick={() => route.push(`/${value.slug}`)}>
                <p className="bg-white h-20 flex justify-center items-center text-center hover:bg-neutral-50 font-medium p-2 shadow cursor-pointer rounded-sm xl:text-sm" title={value.name}>{value.name}</p>
              </div>
            )
          })}
        </div>
    )
}