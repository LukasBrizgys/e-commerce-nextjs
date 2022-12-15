import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { FullComponentWithFeatures } from "../src/types/Component.types";

interface ISection {
    selectedItem : FullComponentWithFeatures | undefined
    heading : string,
    selectionLabel : string,
    categoryId : number,
    openModal : Dispatch<SetStateAction<{
        isOpen: boolean;
        category: number | null;
    }>>
}
const CompatibilityItemSection = (props : ISection) => {
    return(

    
    props.selectedItem ?
    <div className="w-full">
        <h2><strong>{props.heading}</strong></h2>
        <div className="bg-gray-100 border h-24 flex items-center p-2 gap-2">
            <Image src={`https://njkmajcfosaflafhlphb.supabase.co/storage/v1/object/public/pictures/${props.selectedItem.ComponentPicture[0].Picture.name}`} width={75} height={75} alt={props.selectedItem.name}/>
            <div>{props.selectedItem.name}</div>
    
        </div>
    </div>
     : 
    <div className="w-full">
        <h2><strong>{props.heading}</strong></h2>
        {
            
            <div className="bg-gray-100 border h-24 flex items-center p-2">
                
                <button className="ml-auto flex p-2 bg-teal-500 text-white rounded-md" onClick={() => props.openModal({isOpen:true, category:props.categoryId})}>
                    <strong>{props.selectionLabel}</strong>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
            </div>
        }
    
    </div>
)
}
export default CompatibilityItemSection;