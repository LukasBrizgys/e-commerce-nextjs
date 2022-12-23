import Image from "next/image";
import React from 'react';
import { AlertType } from "../src/enums/alert.enums";
import { useAppDispatch } from "../src/hooks/reduxWrapperHooks";
import { showAlert } from "../src/store/alertSlice";
import { deleteCartItem, setQuantity } from "../src/store/cartSlice";
import { CartComponent } from "../src/types/CartComponent.type";
interface ICartItem {
    mobile? : boolean;
    component : CartComponent
}
const CartItem = ({ component, mobile } : ICartItem) => {
    const dispatch = useAppDispatch();
    const increment = () => {
        if(component.quantity < 9999){
            const newQuantity = component.quantity + 1;
            dispatch(setQuantity({componentId: component.componentId, quantity:newQuantity})).then((value) => {
                if(value.meta.requestStatus === 'rejected') {
                    if(value.payload === 409) {
                        dispatch(showAlert({message:'Per didelis kiekis', type: AlertType.warning}))
                    }else{
                        dispatch(showAlert({message:'Nepavyko pridėti', type: AlertType.warning}))
                    }
                    
                }
            })
        }
    }

    const decrement = () => {
        if(component.quantity > 1) {
            const newQuantity = component.quantity - 1;
            dispatch(setQuantity({ componentId: component.componentId, quantity: newQuantity})).then((value) => {
                if(value.meta.requestStatus === 'rejected') {
                    dispatch(showAlert({message:'Blogas kiekis', type:AlertType.warning}))
                }
            })
        }
    }
    return (
        <>
        <div className={mobile ? "flex items-center justify-between gap-2 border-y py-4 relative w-full" : "flex items-center justify-between gap-2 h-28 py-4 px-2 border-y relative"}>
            <svg onClick={() => dispatch(deleteCartItem(component.componentId))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={mobile ? "absolute hover:cursor-pointer right-0 top-1 w-6 h-6" : "absolute mt-0 hover:cursor-pointer top-1 left-72 w-6 h-6"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>

            <div className="block">
                <Image  src={`/${component.Component.ComponentPicture[0].Picture.name}`} width="150" height="150" alt={component.Component.name}></Image>
            </div>
            <div className="flex text-justify flex-col font-medium truncate mt-3 gap-3">
                <a href="#" className="truncate hover:underline">{component.Component.name}</a>
                <div className="flex justify-center gap-3 items-center">
                    <div className="flex justify-center">
                        <button onClick={() => decrement()} className="rounded-l-md border-gray-900 border-solid border w-7 flex justify-center items-center hover:text-white hover:bg-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                        </button>

                        <input readOnly type="text" className="w-8 text-center border-y font-medium border-gray-900" value={component.quantity}></input>
                        
                        <button onClick={() => increment()}  className="rounded-r-md border-gray-900 border-solid border w-7 flex justify-center items-center hover:text-white hover:bg-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </button>
                    </div>
                    <div>X</div>
                    <div>
                        {(Number(component.Component.Pricing[0].price) / 100).toFixed(2)}&euro;
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default CartItem;