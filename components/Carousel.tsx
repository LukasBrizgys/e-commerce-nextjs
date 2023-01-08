import { Picture } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
interface ICarousel {
    pictures : Picture[],
    componentName : string,
}
const Carousel = (props : ICarousel) => {
    const [selectedPicture, setSelectedPicture] = useState<string>('');
    
    return(
        
        <div className="flex flex-col">
            <Image src={`/${props.pictures[0].name}`} alt={props.componentName} width={320} height={320}/>
            <div className="flex">
                    {
                        props.pictures.map((picture) => (
                            <Image src={process.env.NODE_ENV === 'development' ? `/${picture.name}` : 'https://njkmajcfosaflafhlphb.supabase.co/storage/v1/object/public/pictures/' + picture.name} alt={props.componentName} width={120} height={120} key={picture.id}/>
                        ))
                    }
            </div>
        </div>
    )
}
export default Carousel;
