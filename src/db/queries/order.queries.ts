import { prisma } from "../config/prismaConfig";
export const createOrder = async() => {
    try{
        
    }catch(error) {
        return null;
    }
}
export const getUserOrders = (userId : string) => {
    try{
        const result = prisma.order.findMany({
            include:{
                Status:true,

            },
            where:{userId: userId}
        })
        return result;
    }catch(err) {
        console.log(err);
        return null;
    }
}