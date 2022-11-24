import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import validateRegisterBody from "../src/validation/validateRegisterBody";
import crypto from 'crypto';
interface IUserToRegister {
    name: string,
    surname: string,
    birthDate: Date,
    email: string,
    consent: boolean,
    password: string,
    passwordRepeat: string,
}
const register = catchAsyncErrors(async (req : NextApiRequest, res : NextApiResponse) => {
    const supabase = createServerSupabaseClient({req, res})
    await validateRegisterBody(req, res);
    const userToRegister : IUserToRegister = req.body;
    const { data, error }  = await supabase.auth.signUp({
        email: userToRegister.email,
        password: userToRegister.password,
        options: {
            data:{
                name: userToRegister.name,
                surname: userToRegister.surname,
                birthDate: userToRegister.birthDate,
            }
        }
    })
    
    if(error) {
        if(error.message === 'User already registered') return res.status(409).send({status:'409', message:'Šis vartotojas jau egzistuoja'});
        res.status(400).send({status:'400', message:'Įvyko klaida sukuriant Vartotoją'});
        return;
    }
    console.log('user ID:' + data.user?.id)
    await supabase.from('Cart').insert({
        sessionId: crypto.randomUUID(),
        userId: data.user?.id,
        createdAt: new Date().toUTCString()
    })
    res.status(200).send({status:'200', message: 'Vartotojas pridėtas'});
    return;
})
export default register;