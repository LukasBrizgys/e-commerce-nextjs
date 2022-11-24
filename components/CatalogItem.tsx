import React, { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import { FullComponent } from "../src/types/Component.types";
import { useAppDispatch } from '../src/hooks/reduxWrapperHooks';
import { addToCart } from '../src/store/cartSlice';
import { showAlert } from '../src/store/alertSlice';
import { AlertType } from '../src/enums/alert.enums';
interface ICatalogItem {
    component : FullComponent
}
const CatalogItem = ({component} : ICatalogItem) => {
    const dispatch = useAppDispatch();
    const [quantity, setQuantity] = useState<number>(1);
    const incrementAmount = (quantity : number) => {
        if(quantity < 9999) setQuantity(quantity + 1);
        
    }
    const decrementAmount = (quantity : number) => {
        if(quantity > 1) setQuantity(quantity - 1);
    }
    const handleAmountChange = (e : any) => {
        const value = parseInt(e.target.value);
        if(value >= 0 && value < 9999) {
            setQuantity(value);
        }
    }
    const addToCartWrapper = () => {
        dispatch(addToCart({componentId:component.id, quantity:quantity})).then((value) => {
            if(value.meta.requestStatus === 'rejected') {
                dispatch(showAlert({message:'Nepavyko pridėti į krepšelį', type: AlertType.failure}));
            }
        })
    }
    return (
        <div className="mt-5 overflow-hidden rounded-xl pt-4 bg-white shadow-md duration-200 hover:scale-105 hover:shadow-xl flex-initial basis-72">
            <div className="p-4">
                <div className="max-w-sm">
                    <Image src={`/${component.ComponentPicture[0].Picture.name}`} alt={component.name} width="320" height="320"></Image>
                </div>
                <div className="h-28">
                    <Link href="#" className="text-justify text-ellipsis hover:underline"><strong>{component.name}</strong></Link>
                </div>
            </div>
            <span className="flex justify-center items-stretch h-9">
                <button onClick={() => decrementAmount(quantity)} className="rounded-l-md border-gray-900 border-solid border w-10 flex justify-center items-center hover:text-white hover:bg-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                </button>

                <input onChange={handleAmountChange} type="text" className="w-10 text-center border-y font-medium border-gray-900" value={quantity}></input>
                
                <button onClick={() => incrementAmount(quantity)}  className="rounded-r-md border-gray-900 border-solid border w-10 flex justify-center items-center hover:text-white hover:bg-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </span>
            <span className="flex justify-center items-center">
                {component.Pricing[0] && component.Pricing[0].originalPrice === component.Pricing[0].price &&
                    <span className='text-lg p-2'><strong>{(Number(component.Pricing[0].price) / 100).toFixed(2)}&euro;</strong></span>
                }

                {component.Pricing[0] && component.Pricing[0].originalPrice !== component.Pricing[0].price &&
                    <span className="">
                        <div className='text-lg p-2 '><strong>{(Number(component.Pricing[0].price) / 100).toFixed(2)}&euro;</strong></div>
                        <div className='text-lg p-2 text-red-800 line-through'><strong>{(Number(component.Pricing[0].originalPrice) / 100).toFixed(2)}&euro;</strong></div>
                    </span>
                }
            </span>
            {
                component.stock > 0 && component.Pricing[0] ? 
                <button onClick={() => addToCartWrapper()} className="w-full self-end border-t-2 p-1 rounded-b-xl border-gray-500 hover:text-white hover:bg-teal-600 hover:border-white"><strong>Į KREPŠELĮ</strong></button>
                :
                <button disabled={true} className="w-full self-end border-t-2 p-1 rounded-b-xl border-gray-500">Nepasiekiama</button>
            }
            
        </div>
    )
}
export default CatalogItem;