import { prisma } from "../config/prismaConfig";
export const getComponentPricesBySlug = async(slug : string | undefined) => {
    try{
        const result = await prisma.pricing.findMany({
            where:{Component:{slug:slug}}
        })
        return result;
    }catch(error) {
        return null
    }
}