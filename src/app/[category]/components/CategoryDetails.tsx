import { useAuth } from "@/app/AuthContext"
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { FaCaretRight } from "react-icons/fa";


export default function CategoryDetails() {
    const { listCategory } = useAuth();
    const param = useParams();
    const route = useRouter();
    return (
        <div className="text-[var(--color-text-root)]">
            <p className="max-lg:text-lg font-medium mb-4 mt-2">Danh mục sản phẩm</p>
            <div className="bg-white rounded-t-xl rounded-b-xl border xl:mr-2 ">
                {listCategory?.data.map((category, idx) => {
                    const isLast = idx === listCategory.data.length - 1
                    const paramChoise = param.category === category.slug
                    return (
                        <div key={category._id} className={cn("flex items-center cursor-pointer", idx === 0 && "rounded-t-xl", paramChoise && "bg-neutral-100", isLast ? "rounded-b-xl": "border-b")}
                        onClick={()=> route.push(`/${category.slug}`)}
                        >
                            <p className={cn("p-2 text-sm font-normal w-full", paramChoise && "font-medium")}>{category.name}</p>
                            {paramChoise && <FaCaretRight /> }
                        </div>
                    )
                }
                )}
            </div>

        </div>
    )
}