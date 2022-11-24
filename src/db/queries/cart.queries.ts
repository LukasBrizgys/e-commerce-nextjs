import { User } from "@supabase/auth-helpers-react";
import  { prisma } from '../config/prismaConfig';

export const getCartId = async(sessionId : string, user : User | null) : Promise<BigInt | undefined> => {
    
    let cartId : BigInt | undefined;
    if(user) {
        const cart = await prisma.cart.findFirst({
            select:{id:true},
            where:{userId : user.id}
        })
        cartId = cart?.id;
        return cartId;
    }else{
        const guestCart = await prisma.cart.findFirst({
            select: {id: true},
            where:{sessionId: sessionId}
        })
        cartId = guestCart?.id;
        return cartId;
    }
}