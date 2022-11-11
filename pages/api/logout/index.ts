import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req, res});
    switch(req.method) {
        case "POST":
                await supabase.auth.signOut();
                return res.status(200).send({status:'200', message:'Logged out'});
        default:
            return res.status(405).send({status:'405', message:'Method not allowed'});
    }
}