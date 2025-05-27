import { NEXT_PUBLIC_LOCAL } from "../helper/constant";


export const getNewAccessToken = async () => {
    try {
       const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/get/refresh-token`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await res.json();
        return {data , status : res.status}
    } catch (error) {
        console.error("Failed to refresh access token", error);
        return null;
    }
}