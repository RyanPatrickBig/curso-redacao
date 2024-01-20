import Image from "next/image"

interface InitialSectionProps{
    titulo: string
    img: string
    children: any
    ordem: boolean
    className?:any
}

export default function InitialSection(props: InitialSectionProps){
    return (
        <div className="pb-20 text-black">
            <section className={`grid md:flex md:gap-20 gap-8 items-center pt-10 md:${props.ordem == false ? ' flex-row-reverse ' : 'flex-row'}`}>
                <figure className="flex items-center justify-center">
                    <div className="rounded-full h-60 w-60 md:h-72 md:w-72">
                    <Image src={props.img} width='288' height='288' alt="imagem do curso" className="rounded-full"/>
                    </div>
                </figure>
                <div>
                    <h1 className={`text-3xl md:text-6xl md:text-left text-center font-LeagueSpartan ${props.className}`}>{props.titulo}</h1>
                    <h3 className="text-xl md:text-left text-center">{props.children}</h3>
                </div>
            </section>
        </div>
    )
}