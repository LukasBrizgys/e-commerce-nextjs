import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from 'cookies-next';
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import setSessionCookie from "../../../src/utils/setSessionCookie";
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req:req, res:res});
    switch(req.method) {
        case 'POST': 
            const cookie = getCookie('sessionId', {req, res});
            if(!cookie) {
                const sessionId = await setSessionCookie(req, res);
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