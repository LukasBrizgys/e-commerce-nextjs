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
export type FullComponentWithFeatures = Prisma.ComponentGetPayload<{
    include:{
        Brand:true,
        Category:true,
        Pricing:{
            take:1
            select:{
                price:true,
                originalPrice:true,
            }
        },
        ComponentPicture:{
            take:1
            select:{
                Picture:{
                    select:{ name: true }
                }
            }
        },
        ComponentFeature:{
            select:{
                value:true,
                Feature:{ select: {name:true}}
            }
        }
    }
}>