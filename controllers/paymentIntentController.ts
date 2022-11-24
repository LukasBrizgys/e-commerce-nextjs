import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getCookie, setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import { getCartId } from "../src/db/queries/cart.queries";
import { findCartComponentsByCartId } from "../src/db/queries/cartComponent.queries";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import calculateTotalPrice from "../src/utils/calculateTotalPrice";
import stripe from '../src/lib/getStripeServerside';
import Stripe from 'stripe';
const createPaymentIntent = catchAsyncErrors( async (req : NextApiRequest, res : NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res });
    const sessionCookie = getCookie('sessionId', { req, res });
    const user = await supabase.auth.getUser();
    const cartId = await getCartId(sessionCookie?.toString()!, user.data.user);
    if(!cartId) return res.status(400).send({status: '400', message:'Cart not found'});
            const paymentIntentCookie = getCookie('paymentIntentId', {req , res});
            let paymentIntent : Stripe.PaymentIntent | undefined;
            const cartComponents = await findCartComponentsByCartId(cartId.valueOf());
            const totalPrice = calculateTotalPrice(cartComponents);
            try{
                if(!paymentIntentCookie) {
                    paymentIntent = await stripe.paymentIntents.create({
                        amount: totalPrice,
                        currency: 'eur',
                        automatic_payment_methods:{
                            enabled: true,
                        }
                    })
                    setCookie('paymentIntentId', paymentIntent.id, {req, res, path:'/', httpOnly: true, sameSite:'lax', expires:new Date(2147483647 * 1000)})
                }else {
                    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentCookie.toString());
                }
            }catch(error) {
                console.log(error);
                return res.status(400).send({status:'400', message: 'Bad request'});
            }
            return res.status(200).send({status:'200', paymentIntent});
})
export default createPaymentIntent;