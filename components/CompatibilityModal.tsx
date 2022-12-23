import { Dialog } from "@headlessui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IAttributes, SelectedComponents } from "../pages/suderinamumas";
import axios from 'axios';
import { FullComponentWithFeatures } from "../src/types/Component.types";
import Image from "next/image";
import Loader from "./Loader";
import getNumber from "../src/utils/getNumber";
interface ICompatibilityModal {
    isOpen : boolean
    setIsOpen : Dispatch<SetStateAction<{ isOpen: boolean, category: number | null}>>
    setAttribute: Dispatch<SetStateAction<IAttributes>>
    attributes : IAttributes
    category : number | null
    setSelectedComponent: Dispatch<SetStateAction<SelectedComponents>>
}
const CompatibilityModal = (props: ICompatibilityModal) => {
    const [components, setComponents] = useState<FullComponentWithFeatures[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const newAttributes : {
        cpuSocket? : string,
        ramSlot? : string,
        ramSlotCount? : number,
        moboForm? : string,
        caseForm? :string,
        sata? : string,
        m2? : string,
        x1? : number,
        x4? : number,
        x8? : number,
        x16? : number
    } = {}
    const addAttribute = (attributeArray: {value: string;Feature: {name: string;};}[], component : FullComponentWithFeatures) => {
        switch(props.category) {
            case 1:
                props.setSelectedComponent((prevValue) => ({...prevValue, cpu:component}));
                break;
            case 2: 
                props.setSelectedComponent((prevValue) => ({...prevValue, mobo:component}));
                break;
            case 3:
                props.setSelectedComponent((prevValue) => ({...prevValue, ram:component}));
                break;
            case 4:
                props.setSelectedComponent((prevValue) => ({...prevValue, hdd:component}));
                break;
            case 5:
                props.setSelectedComponent((prevValue) => ({...prevValue, gpu:component}));
                break;
            case 6:
                props.setSelectedComponent((prevValue) => ({...prevValue, psu:component}));
                break;
            case 7:
                props.setSelectedComponent((prevValue) => ({...prevValue, case: component}));
                break;
        }

        attributeArray.forEach((attribute) => {
            switch(attribute.Feature.name) {
                case 'Socket Type':
                    newAttributes.cpuSocket = attribute.value;
                    break;
                case 'Form Factor':
                    if(props.category === 2 || props.category === 6) {
                        newAttributes.moboForm = attribute.value
                    }
                    if(props.category === 7) {
                        newAttributes.caseForm = attribute.value
                    }
                    if(props.category === 4) newAttributes.sata = attribute.value
                    break;
                case 'Memory Type':
                    if(props.category === 3 || props.category === 2) newAttributes.ramSlot = attribute.value;
                    break;
                case 'M.2 Port Type':
                    newAttributes.m2 = attribute.value;
                    break;
                case 'SATA 6Gb/s':
                    newAttributes.sata = 'SATA';
                    break;
                case 'Motherboard Support':
                    newAttributes.moboForm = attribute.value
                    newAttributes.caseForm = attribute.value
                    break;
                case 'PCI Express x1':
                    newAttributes.x1 = getNumber(attribute.value, undefined);
                    break;
                case 'PCI Express x4':
                    newAttributes.x4 = getNumber(attribute.value, undefined);
                    break;
                case 'PCI Express x16':
                    newAttributes.x16 = getNumber(attribute.value, undefined);
                case 'PCI Express 5.0 x16':
                    newAttributes.x16 = getNumber(attribute.value, undefined);
                    break;
                case 'Memory Slots':
                    if(props.category === 2) newAttributes.ramSlotCount = !Number.isNaN(parseInt(attribute.value)) ? parseInt(attribute.value) : undefined;
                    break;
            }
        })
        props.setAttribute({...props.attributes, ...newAttributes})
    }
    useEffect(() => {
        if(props.category) {
            const searchParams = new URLSearchParams();
            const categoryString = props.category.toString();
            searchParams.set('category', categoryString);
            Object.entries(props.attributes).map((entry : any) => {
            
                if(entry[1]){
                    searchParams.append(entry[0], entry[1]);
                }
            
            });
            setLoading(true);
            axios.get(`/api/compatibility?${searchParams.toString()}`)
            .then((response) => {
                setComponents(response.data.components)
                console.log(response);
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setLoading(false)
            })
        }
        
    },[props.category])
    return (
        <Dialog
      open={props.isOpen}
      onClose={() => {props.setIsOpen({isOpen:false, category:null}); setComponents([])}}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div  className="fixed inset-0 overflow-y-scroll">
      <div  className="flex min-h-full items-center justify-center p-4 ">
        <Dialog.Panel className="mx-auto w-3/4 rounded-md bg-white">
          { loading && <Loader/>}
          {
            !loading && components &&
            <div className="">
                {
                    components.map((component) => (
                        <div className="flex gap-5 border p-2" key={component.id}>
                            <div className="flex">
                                <Image src={`/${component.ComponentPicture[0].Picture.name}`} width={150} height={150} alt={component.name}/>
                                <div className="flex justify-center items-center">
                                    <div className="text-center"><strong>{component.name}</strong></div>
                                </div>
                            </div>
                            <button className="mx-auto self-center px-5 py-2 bg-teal-500 text-white rounded-md" onClick={() => addAttribute(component.ComponentFeature, component)}>Pridėti</button>
                        </div>
                    ))
                }
            </div>
          }

        </Dialog.Panel>
      </div>
      </div>
    </Dialog>
    )
}
export default CompatibilityModal;