import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import validateLoginBody from "../../../src/validation/validateLoginBody";

interface UserToLogin {
    email: string,
    password: string,
}
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req, res})
    switch(req.method) {
        case 'POST':
            await validateLoginBody(req, res);
            const userToLogin : UserToLogin = req.body;
            const { data, error } = await supabase.auth.signInWithPassword({
                email: userToLogin.email,
                password: userToLogin.password
            })
            if(error) {
                return res.status(401).send({ status: '401', message:'Neteisingas vartotojo vardas arba slaptažodis' })
            }
            return res.status(200).send({ status:'200', message: data.user?.email });
        default:
            
            return res.status(405).send({ status:'405', message:'Method not allowed' })
    }
}
