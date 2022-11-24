import { CartComponent } from "../types/CartComponent.type";

const calculateTotalPrice = (items : CartComponent[] | undefined) => {
    if(!items) return 0;
    const totalPrice = items.reduce((acc, current) => acc + Number(current.Component.Pricing[0].price) * current.quantity,0);
    return totalPrice;
};
export default calculateTotalPrice;