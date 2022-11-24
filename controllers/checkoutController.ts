import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { getCartId } from "../src/db/queries/cart.queries";
import { checkUserInDatabase } from "../src/db/queries/user.queries";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import isValidEmail from "../src/utils/validateEmail";
import stripe from '../src/lib/getStripeServerside';
const updateCheckoutEmail = catchAsyncErrors(async (req : NextApiRequest, res : NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    const sessionCookie = getCookie('sessionId', {req, res});
    const user = await supabase.auth.getUser();
    const cartId = await getCartId(sessionCookie?.toString()!, user.data.user);
    if(!cartId) return res.status(400).send({status: '400', message:'Cart not found'});
    const paymentIntentCookie = getCookie('paymentIntentId', {req,res});
            if(!req.body.email || !isValidEmail(req.body.email)){
                res.status(422).send({status: '422', message:'Įveskite tinkamą el. pašo adresą'});
                return;
            }
            const emailInDatabase = await checkUserInDatabase(req.body.email.toLowerCase());
            if(emailInDatabase && user.data.user === null) {
                res.status(422).send({message: 'Šis el.paštas jau egzistuoja. Prisijunkite'});
                return;
            } 
            if(emailInDatabase !== user.data.user?.email){
                res.status(422).send({message: 'Įveskite šios paskyros el. paštą'});
                return;
            }
            if(paymentIntentCookie) {
                await stripe.paymentIntents.update(paymentIntentCookie?.toString(), {
                receipt_email:req.body.email,
                metadata:{
                    email:req.body.email,
                    ...(user.data.user && { userId: user.data.user.id})
                }
            })
            }
            
            return res.status(200).send({status:'200', message:'Email valid'});
})
export default updateCheckoutEmail;
