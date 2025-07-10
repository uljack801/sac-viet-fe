import { NEXT_PUBLIC_LOCAL } from "@/app/helper/constant";
import { ParamValue } from "next/dist/server/request/params";

export const fetchProductsSearch = async (param: ParamValue , paramPage: string ) => {
    try {
         const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/search?search=${param}&page=${paramPage}`, {
                  method: "GET",
                  cache: "no-store",
                });
            return res
    } catch (error) {
        console.log(error);
    }
}