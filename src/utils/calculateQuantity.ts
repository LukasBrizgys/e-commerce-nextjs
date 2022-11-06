/**
 * Function calculates if potential quantity doesn't exceed stock, if it does, add maximum stock amount
 * @param quantityToAdd - quantity to add to cart
 * @param stock - quantity in stock
 * @param quantityInCart - quantity of single component in cart
 * @returns quantity safe to add in cart
 */
 const calculateQuantity = (quantityToAdd : number, stock : number, quantityInCart? : number) : number =>{ //calculate if amount doesn't exceed stock, if it does, add stock amount
    if(!quantityInCart) {
        return quantityToAdd > stock ? stock : quantityToAdd;
    }
    if(quantityInCart && quantityInCart + quantityToAdd > stock){
        return stock - quantityInCart;
    }
    return quantityToAdd;
}
export default calculateQuantity;