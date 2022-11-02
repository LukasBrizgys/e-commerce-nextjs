import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie} from 'cookies-next';
import crypto from 'crypto';
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req:req, res:res});
    switch(req.method) {
        case 'POST': 
            const cookie = getCookie('sessionId', {req, res});
            if(!cookie) {
                const sessionId = crypto.randomUUID();
                let expiryDate = new Date();
                const month = (expiryDate.getMonth() + 1) % 12;
                expiryDate.setMonth(month);
                setCookie('sessionId', sessionId, {req, res, httpOnly:true, path:'/', expires: expiryDate});
                await supabase.from('Cart').insert({
                    userId: null,
                    sessionId: sessionId,
                    createdAt: new Date().toUTCString()
                })
            }
            return res.status(200).send({status:'200', message:'Ok'});
        default:
            return res.status(405).send({status:'405', message:'Method not allowed'})
    }
}