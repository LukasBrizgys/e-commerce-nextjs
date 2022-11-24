import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, PaymentIntent, StripeElementsOptions } from "@stripe/stripe-js";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import CheckoutForm from "../../components/CheckoutForm";
import { getCartId } from "../../src/db/queries/cart.queries";
import { findCartComponentsByCartId } from "../../src/db/queries/cartComponent.queries";
import { CartComponent } from "../../src/types/CartComponent.type";
import calculateTotalPrice from "../../src/utils/calculateTotalPrice";
import stripe from '../../src/lib/getStripeServerside';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
    locale:'lt'
});
export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const sessionCookie = getCookie('sessionId', ctx);
    const paymentIntentCookie = getCookie('paymentIntentId', ctx);
    const user = await supabase.auth.getUser();
    const cartId = await getCartId(sessionCookie?.toString()!, user.data.user);
    let paymentIntent : Stripe.PaymentIntent | undefined;
    let userEmail : string | undefined;
    if(!cartId) return { redirect: { permanent: false, destination: '/'}}
    try{
        const cartComponents : CartComponent[] = await findCartComponentsByCartId(cartId.valueOf());
        
        if(!cartComponents) throw new Error('No components found');
        const componentArray = cartComponents.map((component) => {
            return {componentId : component.componentId, quantity: component.quantity}
        });
        const totalPrice = calculateTotalPrice(cartComponents);
        if(!paymentIntentCookie) {
        paymentIntent = await stripe.paymentIntents.create({
            amount:totalPrice,
            currency:'eur',
            metadata:{
                componentids:JSON.stringify(componentArray),
                cartId:cartId.toString(10)
            }
        })
        setCookie('paymentIntentId', paymentIntent.id, {req:ctx.req, res:ctx.res, path:'/', httpOnly: true, sameSite:'lax', expires:new Date(2147483647 * 1000)})
        }else{
            paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentCookie.toString());
        }
        if(user.data.user) {
            userEmail = user.data.user.email
        }
        return {
            props:{
                cartComponents: JSON.parse(JSON.stringify(cartComponents)),
                totalPrice,
                clientSecret:paymentIntent.client_secret,
                ...(userEmail && { email: userEmail})
            }
        }
    }catch(err) {
        return {
            redirect: { permanent: false, destination:'/'}
        }
    }

}
const Checkout = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const options : StripeElementsOptions = {
        clientSecret: props.clientSecret,
        appearance: {
            theme:'stripe'
        },
    }
    return(
        
        <>
            <Head>
                <title>Užsakymas</title>
                <meta property="og:title" content="Užsakymas" key="title" />
                <meta charSet='UTF-8'/>
                <meta name="description" content="Užsakymas" />
            </Head>

            <div className="flex absolute md:flex-row flex-col gap-5 w-full justify-center md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2">
                <div className="basis-1/2">
                {props.clientSecret &&
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm totalPrice={props.totalPrice} clientSecret={props.clientSecret} userEmail={props.email && props.email}/>
                </Elements>
                }
                </div>
                <div className="rounded-xl border justify-between self-stretch flex flex-col ">
                    <div className="md:w-96 p-3 flex flex-col gap-3 overflow-y-scroll flex-grow basis-40">
                            {
                                props.cartComponents && props.cartComponents.map((component : CartComponent) => (
                                    <div key={component.componentId} className="flex">
                                        <Image src={`/${component.Component.ComponentPicture[0].Picture.name}`} width="100" height="100" alt={component.Component.name}></Image>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-center">{component.Component.name}</div>
                                            <div><strong>{Number(component.Component.Pricing[0].price) / 100}&euro; X {component.quantity} = {Number(component.Component.Pricing[0].price) * component.quantity / 100}&euro;</strong></div>
                                        </div>
                                    </div>
                                ))
                            }
                    </div>        
                        <div className="flex mb-auto md:mb-0 flex-col items-center justify-center gap-5 h-20 bg-gray-100 w-full">
                            <div><strong>Visa suma: {props.totalPrice && props.totalPrice / 100}&euro;</strong></div>
                        </div>
                        
                </div>
            </div>
        </>
    )
}
export default Checkout;