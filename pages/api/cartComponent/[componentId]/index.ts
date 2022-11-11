import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getCartId } from "../../../../src/db/queries/cart.queries";
import { deleteCartComponent } from "../../../../src/db/queries/cartComponent.queries";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const supabase = createServerSupabaseClient({req, res});
    const componentId = parseInt(req.query.componentId!.toString());
    let cartId;
    try{
        const user = await supabase.auth.getUser();
        if(user.error) throw new Error(user.error.message);
        cartId = await getCartId(req, res, user);
    }catch(err) {
        cartId = await getCartId(req, res);
    }
    if(!cartId) return res.status(404).send({ status: '404', message: 'Cart not found' });
    if(isNaN(componentId)) return res.status(400).send({ status:'400', message:'Bad component' });
    switch(req.method) {
        case 'DELETE':
            try{
                const deletedComponent = await deleteCartComponent(componentId, cartId.valueOf());
                if(!deletedComponent) throw new Error('Cart component not found');
                return res.status(200).send({ status: '200', message: deletedComponent });
            }catch(error) {
                console.log(error);
                return res.status(400).send({ status:'400', message:'Error deleting the cart component'});
            }
        default:
            return res.status(405).send({status: '405', message: 'Method not allowed'});
    }
    

}