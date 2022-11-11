import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import validateRegisterBody from "../../../src/validation/validateRegisterBody";
import setSessionCookie from "../../../src/utils/setSessionCookie";
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
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req, res})
    switch(req.method) {
        
        case 'POST':
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
                return res.status(400).send({status:'400', message:'Įvyko klaida sukuriant Vartotoją'})
            }
            console.log('user ID:' + data.user?.id)
            await supabase.from('Cart').insert({
                sessionId: crypto.randomUUID(),
                userId: data.user?.id,
                createdAt: new Date().toUTCString()
            })
            return res.status(200).send({status:'200', message: 'Vartotojas pridėtas'});
        default:
            res.status(405).json({status: '405', message: 'Neleistinas metodas'});
    }

}