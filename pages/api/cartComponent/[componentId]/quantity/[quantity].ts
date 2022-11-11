import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getCartId } from "../../../../../src/db/queries/cart.queries";
import { getAmountInCart, updateCartComponentQuantity } from "../../../../../src/db/queries/cartComponent.queries";
import { getComponentStock } from "../../../../../src/db/queries/component.queries";
import calculateQuantity from "../../../../../src/utils/calculateQuantity";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req, res});
    const componentId = parseInt(req.query.componentId!.toString());
    const quantity = parseInt(req.query.quantity!.toString());
    if((isNaN(componentId) && isNaN(quantity)) || quantity <= 0) return res.status(400).send({ status:'400', message:'Bad component or quantity value'});
    let cartId;
    try{
        const user = await supabase.auth.getUser();
        if(user.error) throw new Error(user.error.message);
        cartId = await getCartId(req, res, user);
    }catch(err) {
        cartId = await getCartId(req, res);
    }
    if(!cartId) return res.status(404).send({ status: '404', message: 'Cart not found' });
    
    switch(req.method) {
        case 'PATCH':
            try{
                const [amountInCart, stock] = await Promise.all([getAmountInCart(componentId, cartId.valueOf()), getComponentStock(componentId)])
                if(!amountInCart || quantity > stock) {
                    return res.status(409).send({status:'409', message: 'Quantity exceeds stock'});
                }
                const updatedComponent = await updateCartComponentQuantity(componentId, cartId.valueOf(), quantity);
                if(!updatedComponent) throw new Error('Update');
                return res.status(200).send({status: '200', message: updatedComponent});
            }catch(error) {
                console.log(error);
                return res.status(400).send({status: '400', message: 'Error occurred updating the component'});
            }
        default:
            return res.status(405).send({status: '405', message: 'Method not allowed'});
    }
}
