import { UserResponse } from "@supabase/gotrue-js";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import  { prisma } from '../config/prismaConfig';
export const getCartId = async(req : NextApiRequest, res : NextApiResponse, user? : UserResponse) : Promise<BigInt | undefined> => {
    let cartId : BigInt | undefined;
    if(user?.data.user?.id) {
        const cart = await prisma.cart.findFirst({
            select:{id:true},
            where:{userId : user.data.user.id}
        })
        cartId = cart?.id;
        return cartId;
    }else{
        const sessionCookie = getCookie('sessionId', {req, res});
        const guestCart = await prisma.cart.findFirst({
            select: {id: true},
            where:{sessionId: sessionCookie?.toString()}
        })
        cartId = guestCart?.id;
        return cartId;
    }
}