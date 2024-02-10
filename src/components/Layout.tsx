import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';

export default function Layout(props: any) {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false);

    const toggleMobileNav = () => {
      setMobileNavOpen(!isMobileNavOpen);
    };
    
    return (
        <div className={`bg-white flex flex-col flex-wrap m-6 items-center content-center rounded-xl text-black min-w-[62vh] md:w-fit`}>
            <header className="flex gap-3 flex-col md:flex-row mx-24 md:my-10 mt-8 justify-between items-center font-semibold ">

                <div className='flex'>
                    <figure className="md:h-14 md:w-72 w-[300px] flex justify-center items-center">
                        <Image src='/images/FELIPEALVESRBG2.png' width='275' height='110' alt='imagemDoCurso'/>
                    </figure>
                    <div className="md:hidden flex">
                        <button onClick={toggleMobileNav}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className={`md:flex grid gap-3 md:gap-10 ${isMobileNavOpen ? 'block' : 'hidden'}`}>
                    {/* Links da Navbar */}
                    <Link className='flex justify-center items-center order-4 md:order-1' href="/">Cursos</Link>
                    <Link className='flex justify-center items-center order-3 md:order-2' href="quemSomos">Quem somos</Link>
                    <Link className='flex justify-center items-center order-2 md:order-3' href="https://correcao.cursofelipealves.com.br/student/login">Correção de redação</Link>
                    <div className='flex gap-3 md:m-3 md:gap-10 order-first md:order-last'>
                        <Link href="/login" className="flex justify-center border-b-2 border-sky-500 px-12 py-1 font-bold">Entrar</Link>
                        <Link href="/cadastro" className="flex justify-center text-white bg-sky-500 rounded-lg px-12 py-2 m-0">Cadastrar</Link>
                    </div>
                </nav>

            </header>
            <div className="px-24 py-6 h-fit mb-52">
                {props.children}
            </div>
            <footer style={{ backgroundColor: '#373E48', color: 'white' }} className='w-fit md:w-full'>
                <div className="p-14 px-20 ">
                    <h1 className="font-Montserrant text-2xl">Curso Felipe Alves</h1>
                    <h4>contato@cursofelipealves.com.br</h4>
                    <div className='flex place-content-between flex-wrap md:flex md:mt-0'>
                        <h4>(87) 98164-0749</h4>    
                        <h4>Created by Clara Lacerda, Emily Xavier & Ryan Patrick</h4>
                    </div>
                </div>
            </footer>
        </div>
    )
}