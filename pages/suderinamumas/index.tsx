import { Category } from "@prisma/client";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestResponse } from "@supabase/supabase-js";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { GetServerSideProps } from "next";
import { useState } from "react";
import CompatibilityItemSection from "../../components/CompatibilityItemSection";
import CompatibilityModal from "../../components/CompatibilityModal";
import { ComponentToAddOrUpdate } from "../../src/store/cartSlice";
import { FullComponent, FullComponentWithFeatures } from "../../src/types/Component.types";

export const getServerSideProps : GetServerSideProps = async(ctx : GetServerSidePropsContext) => {
    const supabase = createServerSupabaseClient(ctx);
    const { data: categories, error: categoryError } : PostgrestResponse<Category> = await supabase.from('Category').select('*');
    return {
        props:{
            categories
        }
    }
}
export interface SelectedComponents{
    gpu:undefined | FullComponentWithFeatures,
    cpu: undefined | FullComponentWithFeatures,
    psu: undefined| FullComponentWithFeatures,
    mobo: undefined | FullComponentWithFeatures,
    case: undefined | FullComponentWithFeatures,
    hdd: undefined | FullComponentWithFeatures,
    ram: undefined | FullComponentWithFeatures
}
export interface MultipleAdd {
    id: number
}
export interface IAttributes {
    cpuSocket: string | undefined,
    moboForm: string | undefined,
    sata: string | undefined,
    caseForm: string | undefined,
    m2: string | undefined,
    ramSlot:string | undefined
}
const CompatibilityPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({
        gpu:undefined,
        cpu:undefined,
        psu:undefined,
        mobo:undefined,
        case:undefined,
        hdd:undefined,
        ram:undefined
    });
    const [openModal ,setOpenModal] = useState<{ isOpen: boolean, category: number | null}>({
        isOpen: false,
        category: null
    });
    const addSelectedToCart = () => {
        const toAddArray : ComponentToAddOrUpdate[] = [];
        Object.entries(selectedComponents).forEach((entry) => {
            const component : FullComponentWithFeatures = entry[1];
            toAddArray.push({componentId: component.id, quantity:1});
        }) 

    }
    const deleteAll = () => {
        setSelectedAttributes({
            cpuSocket: undefined,
            moboForm: undefined,
            caseForm: undefined,
            sata:undefined,
            m2: undefined,
            ramSlot:undefined,
        })
        setSelectedComponents({
            gpu:undefined,
            cpu:undefined,
            psu:undefined,
            mobo:undefined,
            case:undefined,
            hdd:undefined,
            ram:undefined
        })
    }
    const [attributes, setSelectedAttributes] = useState<IAttributes>({
        cpuSocket: undefined,
        moboForm: undefined,
        caseForm: undefined,
        sata:undefined,
        m2: undefined,
        ramSlot:undefined,

    })
    console.log(attributes)
    return(
    <>
        <div className="flex flex-col border rounded w-4/5 mx-auto white mt-5 p-3">
            <div className="flex gap-5">
                <button className="p-2 bg-teal-500 text-white rounded-md" onClick={() => addSelectedToCart()}><strong>Pridėti visus pasirinktus į krepšelį</strong></button>
                <button className="p-2 bg-teal-500 text-white rounded-md" onClick={deleteAll}><strong>Ištrinti visus</strong></button>
            </div>
            <div className="w-full flex flex-col p-3 gap-5">
                
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.mobo} selectionLabel="Pasirinkite motininę plokštę" heading="Motininė plokštė" categoryId={2}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.gpu} selectionLabel="Pasirinkite vaizdo plokštę" heading="Vaizdo plokštė" categoryId={5}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.cpu} selectionLabel="Pasirinkite procesorių" heading="Procesorius" categoryId={1}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.ram} selectionLabel="Pasirinkite operatyviąją atmintį" heading="Operatyvioji atmintis" categoryId={3}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.case} selectionLabel="Pasirinkite korpusą" heading="Korpusas" categoryId={7}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.hdd} selectionLabel="Pasirinkite kietąjį diską" heading="Kietasis diskas" categoryId={4}/>
                <CompatibilityItemSection openModal={setOpenModal} selectedItem={selectedComponents.psu} selectionLabel="Pasirinkite maitinimo bloką" heading="Maitinimo blokas" categoryId={6}/>
            </div>
        </div>
        <CompatibilityModal setSelectedComponent={setSelectedComponents} attributes={attributes} category={openModal.category} setAttribute={setSelectedAttributes} setIsOpen={setOpenModal} isOpen={openModal.isOpen}/>
    </>   
    )
}
export default CompatibilityPage;