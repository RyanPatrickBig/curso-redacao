import Formulario from "@/components/Formulario";
import { IconeVoltar } from "@/components/Icones";
import Image from  'next/image';
import Link from "next/link";
import Aluno from "@/core/Aluno";

export default function Cadastro(){

    const alunos = [
        Aluno.vazio()
    ]

    return (
        <div className="flex flex-row justify-center text-black">
            <div className="bg-gradient-to-t from-pink-800 to-pink-400 text-white
                            w-5/12 p-20 pt-10 pb-1 h-fit">
                    <div className='flex flex-col items-start pb-6'>
                        <Link href="/" className="
                            flex justify-center items-center
                            rounded-full p-1 m-1">
                                {IconeVoltar}
                        </Link>
                    </div>
                    <h3 className="text-white font-Montserrant">Sua vaga será garantida a partir do preenchimento e do pagamento do boleto, caso você não bolsista.</h3><br />
                    <h3 className="text-white font-Montserrant">Se você ainda não tem 18 anos, é necessário que um responsável preencha o campo "Dados do responsável"</h3>
                    <figure className="flex justify-center">
                        <Image src='/images/logoCADASTRO.png' width='300' height='300' alt='imagemDoCurso'/>
                    </figure>
                </div>
            <div className="bg-white w-5/12 p-16 pt-20 ">
                <Formulario aluno={alunos[0]}/>
            </div>
        </div>
    )
}