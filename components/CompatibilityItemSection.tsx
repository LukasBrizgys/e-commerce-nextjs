import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
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
    const [open, setOpen] = useState<boolean>(false);
    return(

    
    props.selectedItem ?
    <div className="w-full bg-gray-100">
        <h2 className="bg-white"><strong>{props.heading}</strong></h2>
        <div className="bg-gray-100 border flex items-center p-2 gap-2 relative">
            <Image src={`/${props.selectedItem.ComponentPicture[0].Picture.name}`} width={75} height={75} alt={props.selectedItem.name}/>
            <div>
                <div>{props.selectedItem.name}</div>
                <svg onClick={() => setOpen(!open)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 absolute cursor-pointer left-1/2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        
        </div>
        {
            open &&
            <div className="flex w-full border rounded items-stretch justify-center p-2 gap-5">
                {props.selectedItem.ComponentFeature.map((entry) => (
                    <div className="flex flex-col w-full" key={entry.Feature.name}>
                        <div className="w-full text-sm text-center">{entry.Feature.name}</div>
                        <div className="w-14 h-24 text-center text-ellipsis text-sm overflow-hidden">{entry.value}</div>
                    </div>
                ))}
            </div>
        }

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