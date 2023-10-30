import { IconeFechar, IconeVoltar } from '@/components/Icones';
import Image from  'next/image';
import Link from 'next/link';

export default function(){
    return( 
        <div className="flex flex-row justify-center text-black">

            <section className="flex flex-col justify-center bg-blue-400 text-white
                            w-1/2 h-screen p-20">
                    
                    <div className='flex flex-col items-start pb-10'>
                        <Link href="/" className="
                            flex justify-center items-center
                            rounded-full p-1 m-1">
                                {IconeVoltar}
                        </Link>
                    </div>
                    <figure className='flex flex-col items-center'>
                        <h2 className='font-Montserrant text-center text-white'>Juntos, construiremos o seu futuro</h2>
                        <Image src='/images/logoLOGIN.png' width='400' height='400' alt='imagemDoCurso'/>
                    </figure>
            </section>

            <section className="bg-gray-700 w-1/2 p-28 pt-36 flex flex-col justify-center">
                
                <div className="flex flex-col">
                    <label htmlFor="email" className="font-Montserrant text-gray-300"> E-mail </label>
                    <input type='email' id="email" name="email" className={`border-b border-gray-400 focus:outline-none py-2 px-5 mb-7 bg-transparent text-white`}
                        placeholder='Digite seu e-mail'/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="senha" className="font-Montserrant text-gray-300"> Senha </label>
                    <input type='password' id="senha" name="senha" className={`border-b border-gray-400 focus:outline-none py-2 px-5 mb-7 bg-transparent text-white`}
                        placeholder='Digite sua senha'/>
                </div>
                <div className="flex items-center mb-2">
                    <input id="default-checkbox" type="checkbox" value="" 
                    className="w-4 h-4 text-pink-600 bg-gray-100  rounded-xl"/>
                    <label htmlFor="default-checkbox" className="ml-2 text-sm text-black"><a href="" className="hover:underline text-gray-400">Mantenha-me conectado</a></label>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-7 pt-10'>
                        <Link href="/usuario/aluno" className="text-white py-2 rounded-md px-16 bg-blue-300 font-semibold">Login</Link>
                        <button className='text-gray-400 border-b border-blue-400'>Esqueci a senha</button>
                    </div>
                    <hr className='my-1 border-gray-500 w-full'/>
                    <button className='flex w-full bg-white hover:bg-slate-200 text-slate-800 font-semibold rounded-lg px-4 py-3 items-center justify-center gap-5'>
                        <Image src='/images/pesquisa.png' width='23' height='23' alt='imagemDoCurso'></Image>Entrar com Google</button>
                </div>

            </section>

        </div>
    )
}