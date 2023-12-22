import Link from 'next/link'
import Image from 'next/image'

export default function Layout(props: any) {
    return (
        <div className={`bg-white flex flex-col flex-wrap m-6 rounded-xl text-black`}>
            <header className={`flex mx-24 my-10 justify-between items-center font-semibold`}>
                <figure>
                    <Image src='/images/FELIPEALVESRBG2.png' width='250' height='100' alt='imagemDoCurso' />
                </figure>
                <Link href="/">Cursos</Link>
                <Link href="quemSomos">Quem somos</Link>
                <Link href="https://correcao.cursofelipealves.com.br/student/login">Correção de redação</Link>
                <Link href="/login" className="border-b-2 border-sky-500 px-12 py-1 font-bold">Entrar</Link>
                <Link href="/cadastro" className="text-white bg-sky-500 rounded-lg px-12 py-2 m-0">Cadastrar</Link>
            </header>
            <div className="px-24 py-6 h-fit mb-52">
                {props.children}
            </div>
            <footer style={{ backgroundColor: '#373E48', color: 'white' }}>
                <div className="p-14 px-20">
                    <h1 className="font-Montserrant text-2xl">Curso Felipe Alves</h1>
                    <h4>contato@cursofelipealves.com.br</h4>
                    <div className='flex place-content-between'>
                        <h4>(87) 98164-0749</h4>    
                        <h4>Created by Clara Lacerda, Emily Xavier & Ryan Patrick</h4>
                    </div>
                </div>
            </footer>
        </div>
    )
}