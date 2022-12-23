import {NextApiRequest, NextApiResponse} from "next";
import catchAsyncErrors from "../src/lib/catchAsyncErrors";
import {deleteCartComponent, findAllCartComponents, findCartComponentsByCartId, getAmountInCart, insertOrUpdateCartItem, updateCartComponentQuantity } from "../src/db/queries/cartComponent.queries";
import {createServerSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {getCookie} from "cookies-next";
import {getCartId} from "../src/db/queries/cart.queries";
import {getComponentStock} from "../src/db/queries/component.queries";
import calculateQuantity from "../src/utils/calculateQuantity";

const getAllCartComponents = catchAsyncErrors(
    async (req : NextApiRequest, res : NextApiResponse) => {
        const cartComponents = await findAllCartComponents();
        return res
            .status(200)
            .send({status: '200', cartComponents})
    }
)
const getAllCartComponentsByCartId = catchAsyncErrors(
    async (req : NextApiRequest, res : NextApiResponse) => {
        const supabase = createServerSupabaseClient({req, res});
        const sessionCookie = getCookie('sessionId', {req, res});
        const user = await supabase
            .auth
            .getUser();
        const cartId = await getCartId(
            sessionCookie
                ?.toString()!,
            user.data.user
        );
        if (!cartId) 
            return res
                .status(400)
                .send({status: '400', message: 'Cart not found'});
        
        const cartComponents = await findCartComponentsByCartId(cartId.valueOf());
        return res
            .status(200)
            .send({status: '200', message: cartComponents})
    }
)
const addCartComponent = catchAsyncErrors(async (req
: NextApiRequest, res
: NextApiResponse) => {
    const supabase = createServerSupabaseClient({req, res});
    const sessionCookie = getCookie('sessionId', {req, res});
    const user = await supabase
        .auth
        .getUser();
    const cartId = await getCartId(
        sessionCookie
            ?.toString()!,
        user.data.user
    );
    if (!cartId) 
        return res
            .status(400)
            .send({status: '400', message: 'Cart not found'});
    const quantityToAdd: number | typeof NaN = parseInt(req.body.quantity, 10);
    const componentId: number | typeof NaN = parseInt(req.body.componentId, 10);
    if (isNaN(quantityToAdd) || quantityToAdd < 1 || isNaN(componentId)) 
        return res
            .status(400)
            .send({status: '400', message: 'Bad request'});
    const stock = await getComponentStock(componentId);
    const amountInCart = await getAmountInCart(componentId, cartId.valueOf());
    const actualAmount = calculateQuantity(quantityToAdd, stock, amountInCart);
    try {
        const addedComponent = await insertOrUpdateCartItem(
            cartId.valueOf(),
            componentId,
            actualAmount,
            amountInCart
        );
        return res
            .status(200)
            .send({status: '200', message: addedComponent});
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .send({status: '400', message: 'Error occurred when adding an item'});
    }
})
const deleteComponentFromCart = catchAsyncErrors(async (
    req :NextApiRequest,
    res : NextApiResponse
) => {
    const supabase = createServerSupabaseClient({ req, res });
    const sessionCookie = getCookie('sessionId', {req, res});
    const user = await supabase.auth.getUser();
    const cartId = await getCartId(sessionCookie?.toString()!, user.data.user);
    if(!cartId) return res.status(400).send({status: '400', message:'Cart not found'});
    const componentId = parseInt(req.query.componentId!.toString());
    if(isNaN(componentId)) return res.status(400).send({ status:'400', message:'Bad component' });
    try{
        const deletedComponent = await deleteCartComponent(componentId, cartId.valueOf());
        if(!deletedComponent) throw new Error('Cart component not found');
        return res.status(200).send({ status: '200', message: deletedComponent });
    }catch(error) {
        console.log(error);
        return res.status(400).send({ status:'400', message:'Error deleting the cart component'});
    }
})
const patchCartComponentQuantity = catchAsyncErrors(async (req
: NextApiRequest, res
: NextApiResponse) => {
    const supabase = createServerSupabaseClient({req, res});
    const sessionCookie = getCookie('sessionId', {req, res});
    const user = await supabase
        .auth
        .getUser();
    const cartId = await getCartId(
        sessionCookie
            ?.toString()!,
        user.data.user
    );
    if (!cartId) 
        return res
            .status(400)
            .send({status: '400', message: 'Cart not found'});
    const componentId = parseInt(req.query.componentId !.toString());
    const quantity = parseInt(req.query.quantity !.toString());
    if ((isNaN(componentId) && isNaN(quantity)) || quantity <= 0) 
        res
            .status(400)
            .send({status: '400', message: 'Bad component or quantity value'});
    const amountInCart = await getAmountInCart(componentId, cartId.valueOf());
    const stock = await getComponentStock(componentId);
    if (!amountInCart || quantity > stock) {
        return res
            .status(409)
            .send({status: '409', message: 'Quantity exceeds stock'});
    }
    const updatedComponent = await updateCartComponentQuantity(
        componentId,
        cartId.valueOf(),
        quantity
    );
    if (!updatedComponent) 
        throw new Error('Update');
    return res
        .status(200)
        .send({status: '200', message: updatedComponent});
})
export {
    getAllCartComponents,
    getAllCartComponentsByCartId,
    addCartComponent,
    patchCartComponentQuantity,
    deleteComponentFromCart
};
