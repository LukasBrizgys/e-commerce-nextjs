import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const logout = (async (req : NextApiRequest, res : NextApiResponse) => {
    const supabase = createServerSupabaseClient({req, res});
    await supabase.auth.signOut();
    res.status(200).send({status:'200', message:'Logged out'});
    return;
})
export default logout;