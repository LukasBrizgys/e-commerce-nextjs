import { Prisma } from "@prisma/client";

export type FullComponent = Prisma.ComponentGetPayload<{
    include: {Pricing: {
        select:{
            price:true,
            originalPrice:true
        }
    }, ComponentPicture: {
        select:{
            Picture:{
                select:{name:true}
            }
        }
    }, Brand:true, Category:true}
}>