import React, { FormEvent, useEffect, useState } from 'react';
import { PaymentElement, useStripe, useElements, AddressElement } from '@stripe/react-stripe-js';
import axios, { AxiosError } from 'axios';
import Loader from './Loader';
interface ICheckoutForm{
    clientSecret: string
    totalPrice: number
    userEmail?: string
}
const paymentElementOptions : any = {
    layout:'accordion'
}
const CheckoutForm = (props : ICheckoutForm) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null | undefined>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    useEffect(() => {
        if(!stripe) return;
        if(!props.clientSecret) return;

    },[stripe]);
    const handleSubmit = async(e : any) => {
        e.preventDefault();

        if(!stripe || !elements) return;
        setIsLoading(true);
        try{
            await axios.post('/api/checkout/metadata',{ email: e.target.elements.email.value });
        }catch(_error) {
            const error = (_error as AxiosError<{status:string, message:string}>);
            setEmailError(error.response?.data.message!);
            setIsLoading(false);
            return;
        }
        const result = await stripe.confirmPayment({
            elements,
            confirmParams:{
                return_url:'http://localhost:3000/checkout/success',
            }
        });
        if(result.error.type = "card_error" || result.error.type === "validation_error") {
            setMessage(result.error.message);
        }else{
            setMessage("Įvyko nenumatyta klaida");
        }
        setIsLoading(false);
    }
    return (
        <form id="payment-form" className='flex flex-col gap-5 rounded-xl w-full border p-10' onSubmit={(e) => handleSubmit(e)}>
            <AddressElement options={{mode:'billing'}}/>
            <div className="w-full">
                <label htmlFor="email" className="text-gray-500 font-sans antialiased">Elektroninis paštas</label>
                <input name="email" defaultValue={props.userEmail && props.userEmail} className="w-full p-2 border rounded-md focus:ring-2 outline-none ring-blue-500" type="text"></input>
                {emailError && <div className=" text-red-600">{emailError}</div>}
            </div>
            <PaymentElement className="w-full" id="payment-element" options={paymentElementOptions}/>
                <button className={isLoading ? 'bg-white border rounded p-2' : 'bg-teal-700 text-white p-2 border font-medium rounded'} disabled={isLoading || !stripe || !elements} id="submit" type="submit">
                    <span id="button-text text-center flex justify-center">
                        {isLoading ? <Loader/> : `Mokėti ${(props.totalPrice / 100).toFixed(2)}€`}
                    </span>
                </button>
            {message && <div id="payment-message" className="self-start text-red-600">{message}</div>}
        </form>
    )
}
export default CheckoutForm;