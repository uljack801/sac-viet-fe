import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { ArticleProps } from "@/app/utils/fetchProduct";
import { articleProps } from "../article/page";

export const getArticle = async () => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/article`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: ArticleProps = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
};

export const getArticleByID = async (articleID: string) => {
  try {
    const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/article-by-id?article-id=${articleID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: articleProps = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
};
