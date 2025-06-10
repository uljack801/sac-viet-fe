"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { getArticleByID } from "../components/fetchArticle";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function DetailArticle() {
    const searchParams = useSearchParams()
    const getArticleID = searchParams.get("article-id")
    const [valueArticle, setValueArticle] = useState<articleProps>()
    const route = useRouter()
    const getData = async (getArticleID: string) => {
        const data = await getArticleByID(getArticleID)
        setValueArticle(data)
    }
    useEffect(() => {
        if (!valueArticle) {
            if (getArticleID) {
                getData(getArticleID)
            }
        }
    }, [valueArticle, getArticleID])

    
    return (
        <div className="mt-28  bg-white rounded-2xl mb-10">
            {valueArticle && 
                <div className="px-20 py-10">
                    <div className="flex justify-between">
                    <p className="text-4xl font-medium">{valueArticle.data.title}</p>
                    <Button className="mt-2 bg-neutral-400 hover:bg-neutral-400/60" onClick={() => route.push('/conversation')}>Quay lại trang tin tức</Button>
                    </div>
                    <div className="text-xs font-medium mt-4">
                        <p>Đăng ngày: {(new Date(valueArticle.data.date_at)).toLocaleDateString()}</p>
                        <p>Tác giả: {valueArticle.data.author}</p>
                    </div>
                    <div className="flex justify-center my-10">
                    <Image src={`/article/${valueArticle.data.img[0]}`} alt="ảnh báo " height={600} width={600} className="w-full h-full object-cover rounded-xl"></Image>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: valueArticle.data.content}}></p>

                </div>
            }
        </div>
    )
}


export type articleProps ={
data: {
    _id: string;
    title: string;
    img: string[];
    source: string;
    content: string;
    tags: string[];
    date_at: Date;
    author: string;
    views: number;
    status: string;
}
}