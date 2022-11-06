import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getCartId } from "../../../src/db/queries/cart.queries";
import { getAllCartComponents, getAmountInCart, insertOrUpdateCartItem } from "../../../src/db/queries/cartComponent.queries";
import { getComponentStock } from "../../../src/db/queries/component.queries";
import { CartComponent } from "../../../src/types/CartComponent.type";
import calculateQuantity from "../../../src/utils/calculateQuantity";
export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res });
    const user = await supabase.auth.getUser();
    const cartId = await getCartId(req, res, user);
    if(!cartId) return res.status(404).send({ status: '404', message: 'Krepšelis nerastas' });
    
    
    switch(req.method) {
        case 'POST':
                
                const quantityToAdd : number | typeof NaN = parseInt(req.body.quantity, 10);
                const componentId : number | typeof NaN = parseInt(req.body.componentId, 10);
                if(isNaN(quantityToAdd) || quantityToAdd < 1 || isNaN(componentId)) return res.status(400).send({status:'400', message: 'Bloga užklausa'});
                const stock = await getComponentStock(componentId);
                const amountInCart = await getAmountInCart(componentId, cartId.valueOf());
                const actualAmount = calculateQuantity(quantityToAdd, stock, amountInCart);
                try{
                    const addedComponent = await insertOrUpdateCartItem(cartId.valueOf(), componentId, actualAmount, amountInCart);
                    return res.status(200).send({status:'200', message: addedComponent});
                }catch(error) {
                    console.log(error);
                    return res.status(400).send({status:'400', message:'Nepavyko pridėti'});
                }
        case 'GET':
                try{
                    const allCartComponents : CartComponent[] | undefined = await getAllCartComponents(cartId.valueOf());
                    return res.status(200).send({status:'200', message:allCartComponents});
                }catch(error){
                    return res.status(400).send({status:'400', message:'Nepavyko rasti'});
                }
        default:
            return res.status(405).send({status:'405', message:'Method not allowed'});
    }
}