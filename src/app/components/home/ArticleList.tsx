"use client"
import { ArticleProps } from "@/app/utils/fetchProduct"
import Image from "next/image";
import { useRouter } from "next/navigation";

export const ArticleList = ({article}: {article: ArticleProps| undefined}) => {
  const route = useRouter();
    return (
        <div className="text-[var(--color-text-root)] p-4">
        <div className="grid grid-cols-1 gap-4 ">
          {article?.data.slice(0, 3).map((value) => {              
            return(
              <div className="px-8 rounded-sm border py-4 cursor-pointer" key={`article-${value._id}`} onClick={() => route.push(`/conversation/article?article-id=${value._id}`)}>
                  <Image src={'/article/' + value.img[0]} alt={value.title} width={300}
                  height={300}
                  className="object-cover w-full h-1/2 rounded-sm" />
                  <p className="text-sm font-medium mb-4">{value.title}</p>
                  <p className="line-clamp-2 text-neutral-400 text-xs">{value.content}</p>
                  <br />
                  <hr />
                  <div className="text-xs text-neutral-400 flex items-center justify-between">
                  <p>{new Date(value.date_at).toLocaleDateString("vi-VN")}</p>
                  <p onClick={() => route.push(`/conversation/article?article-id=${value._id}`)} className="hover:font-medium cursor-pointer">xem thêm</p>
                  </div>
              </div>
            )
          })}
        </div>
    </div>
    )
}