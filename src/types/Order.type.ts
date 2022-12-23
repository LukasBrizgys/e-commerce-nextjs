import { Prisma } from "@prisma/client";

export type OrderWithStatus = Prisma.OrderGetPayload<{
    include:{
        Status:true
    }
}>