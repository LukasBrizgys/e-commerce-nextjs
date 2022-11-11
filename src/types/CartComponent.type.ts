import { Prisma } from "@prisma/client";
export type CartComponentBase = Prisma.CartComponentGetPayload<{
    select:{
        componentId:true
        createdAt:true,
        quantity:true,
        updatedAt:true
    }
}>;
export type CartComponent = Prisma.CartComponentGetPayload<{
    select: {
        Component:{
            select:{
                name:true,
                slug:true,
                Category:true,
                Brand:true,
                ComponentPicture:{
                    include:{Picture:true},
                    take:1
                },
                Pricing:true
            },
            
        },
        componentId:true,
        quantity:true,
        createdAt:true
    },
}>