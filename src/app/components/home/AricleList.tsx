"use client"
import { ArticleProps } from "@/app/utils/fetchProduct"
import Image from "next/image";

export const ArticleList = ({article}: {article: ArticleProps| null}) => {
    return (
        <div className=" text-[var(--color-text-root)] ">
        <p className="flex justify-center items-center text-4xl font-medium ">Những câu chuyện làng nghề</p>
        <div className="grid grid-cols-3 gap-4 mt-10 ">
          {article?.data.slice(0, 3).map((value) => {              
            return(
              <div className="p-4 bg-white rounded-sm" key={`article-${value._id}`}>
                  <Image src={'/article/' + value.img[0]} alt={value.title} width={300}
                  height={300}
                  className="object-cover w-full h-1/2 rounded-xs" />
                  <p className="text-sm font-medium mb-4">{value.title}</p>
                  <p className="line-clamp-2 text-neutral-400 text-xs">{value.content}</p>
                  <br />
                  <hr />
                  <div className="text-xs text-neutral-400 flex items-center justify-between">
                  <p>{new Date(value.date_at).toLocaleDateString("vi-VN")}</p>
                  <p>xem thêm</p>
                  </div>
              </div>
            )
          })}
        </div>
    </div>
    )
}