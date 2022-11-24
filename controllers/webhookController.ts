import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import stripe from "../src/lib/getStripeServerside";
import { prisma } from '../src/db/config/prismaConfig';
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export const config = {
    api: {
        bodyParser: false,
    },
};
export interface IPaymentIntentMetadata {
    cartId: number,
    componentids: number[],
    email: string,
    userId: string
}
const captureCharge = catchAsyncErrors(async (req: NextApiRequest, res : NextApiResponse) => {
            const buf = await buffer(req);
            const sig = req.headers['stripe-signature'];
            if(!sig) return res.status(401).send({status:'401', message:'Bad signature'});

            let event;
            try{
                event = await stripe.webhooks.constructEventAsync(buf, sig, webhookSecret);
            }catch(error : any) {
                console.log(error);
                return res.status(400).send(`Webhook Error: ${error.message}`);
            }
            if(event.type === "payment_intent.succeeded") {
                const data = event.data;
                const paymentIntent : any = data.object
                const componentArray : {componentId : number, quantity: number}[] = JSON.parse(paymentIntent.metadata.componentids);
                const createdOrder = await prisma.order.create({
                    data:{
                        userId:paymentIntent.metadata.userId,
                        paymentIntentId:paymentIntent.id,
                        email: paymentIntent.metadata.email,
                        totalPrice:paymentIntent.amount,
                        statusId:1
                    }
                })
                const orderComponentArray : {orderId: number, componentId : number, quantity: number}[] = componentArray.map((component) => {
                    return {orderId: Number(createdOrder.id), componentId: component.componentId, quantity: component.quantity}
                })
                
                await prisma.orderComponent.createMany({
                    data:orderComponentArray
                    
                })
                await prisma.cartComponent.deleteMany({
                    where:{cartId:Number(paymentIntent.metadata.cartId)}
                })
                return res.status(200).send({status:'200', message:'Payment intent created'});
            }
            if(event.type === "charge.succeeded") {

                const chargeObject : any = event.data.object;
                const paymentIntentId = chargeObject.payment_intent;
                console.log(event.data);
                await prisma.order.upsert({
                    where:{
                        paymentIntentId: paymentIntentId
                    },
                    update:{
                        billingName: chargeObject.billing_details.name,
                        city: chargeObject.billing_details.address.city,
                        addressLineOne: chargeObject.billing_details.address.line1,
                        addressLineTwo: chargeObject.billing_details.address.line2,
                        postalCode: chargeObject.billing_details.address.postal_code,
                        statusId:2,
                        updatedAt: new Date()
                    },
                    create:{
                        billingName: chargeObject.billing_details.name,
                        city: chargeObject.billing_details.address.city,
                        paymentIntentId: paymentIntentId,
                        userId: chargeObject.metadata.userId,
                        email:chargeObject.billing_details.email,
                        totalPrice: chargeObject.amount,
                        addressLineOne: chargeObject.billing_details.address.line1,
                        addressLineTwo: chargeObject.billing_details.address.line2,
                        postalCode: chargeObject.billing_details.address.postal_code,
                        statusId: 2
                    }
                })

                return res.status(200).send({status:'200', message:'Charge successful'});
            }
            return res.status(200).send({status:'200', message:'Checkout completed'});
})
export default captureCharge;