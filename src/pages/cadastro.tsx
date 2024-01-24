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
        <div className="flex flex-col items-center md:items-start md:flex-row justify-center text-black">
            <div className="bg-gradient-to-t w-full from-pink-800 to-pink-400 text-white
                            md:w-5/12 p-20 pt-10 pb-1 h-fit">
                    <div className='flex flex-col items-start pb-6'>
                        <Link href="/" className="
                            flex justify-center items-center
                            rounded-full p-1 m-1">
                                {IconeVoltar}
                        </Link>
                    </div>
                    <h3 className="text-white font-Montserrant md:mx-0 -mx-3">Sua vaga será garantida a partir do preenchimento e do pagamento do boleto, caso você não bolsista.</h3><br />
                    <h3 className="text-white font-Montserrant md:mx-0 -mx-3">Se você ainda não tem 18 anos, é necessário que um responsável preencha o campo "Dados do responsável"</h3>
                    <figure className="flex justify-center md:mx-0 mx-10">
                        <Image src='/images/logoCADASTRO.png' width='300' height='300' alt='imagemDoCurso'/>
                    </figure>
                </div>
            <div className="bg-white md:w-5/12 w-full p-16 pt-20 ">
                <Formulario aluno={alunos[0]}/>
            </div>
        </div>
    )
}