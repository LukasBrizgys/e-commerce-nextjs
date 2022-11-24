import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import validateLoginBody from "../src/validation/validateLoginBody";
interface UserToLogin {
    email: string,
    password: string,
}
const login = catchAsyncErrors( async( req : NextApiRequest, res : NextApiResponse) => {
    const supabase = createServerSupabaseClient({req, res})

            await validateLoginBody(req, res);
            const userToLogin : UserToLogin = req.body;
            const { data, error } = await supabase.auth.signInWithPassword({
                email: userToLogin.email,
                password: userToLogin.password
            })
            if(error) {
                console.log(error);
                return res.status(401).send({ status: '401', message:'Neteisingas vartotojo vardas arba slaptažodis' })
            }
            return res.status(200).send({ status:'200', message: data.user?.email });
})
export default login;