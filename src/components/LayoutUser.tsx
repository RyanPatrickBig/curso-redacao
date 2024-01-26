import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Live from "@/core/Live";
import Turma from '@/core/Turma';
import { useEffect, useState } from 'react';
import Aluno from '@/core/Aluno';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/backend/config';

interface MenuItem {
  text: string;
  href: string;
}

interface MenuOptions {
  [key: string]: MenuItem[];
}

interface LayoutUserProps { 
  usuario: string;
  children: React.ReactNode;
  className?: string;
  divisoes?: boolean;
}

export default function LayoutUser(props: LayoutUserProps) {
  const router = useRouter();
  //Aluno que seria o aluno logado
  const aluno = new Aluno('Maria Luiza', new Date('2023-11-31'), 'RJ', 'rua testew', '222-111', 'mari@gmail',
  'pedro', 'ana', 'rg2', 'cpf2', 10, ["idTurma1", "idTurma3"],true , 'abc', "idTeste2", false);
  const [lives, setLives] = useState<Live[]>([])
  const [listaTurmas, setListaTurmas] = useState([
        new Turma('Presencial terça/tarde', 'Linguagem', 'Felipe Alves', 'terça-feira', '14h', 'Presencial', 'idTurma1', false),
        new Turma('Online terça/tarde', 'Redação', 'Wellington', 'terça-feira', '14h', 'Online', 'idTurma2', false),
        new Turma('Presencial sábado/tarde', 'Redação', 'Wellington', 'sábado', '14h', 'Presencial', 'idTurma3', false)
      ])
  const [live, setLive] = useState<Live>(Live.vazio())
  const [livesAtuais, setLivesAtuais] = useState<Live[]>([])

  function carregarLive() {
    const dataAtual = new Date();
    const turmasDoAluno = listaTurmas.filter(turma => aluno.turma.includes(turma.id as string));
  
    const livesAtuais = lives.filter(live => {
      const liveData = new Date(live.data);
      const isDataAtual = liveData.toDateString() === dataAtual.toDateString();
      const correspondenteTurma = turmasDoAluno.find(turma => turma.nome === live.turma);
      return isDataAtual && correspondenteTurma;
    });
  
    setLivesAtuais(livesAtuais);
    setLive(livesAtuais[0] ?? Live.vazio());
  }
  
  function liveSelecionada() {
    if (livesAtuais.length > 0) {
      const currentIndex = livesAtuais.findIndex(liveItem => liveItem.id === live.id);
      let nextIndex = currentIndex + 1;
  
      if (nextIndex > livesAtuais.length - 1) {
        nextIndex = 0;
      }
  
      setLive(livesAtuais[nextIndex]);
    }
  }


  function getMenuLinks(userType: string) {
    const menuOptions: MenuOptions = {
        aluno: [
            { text: 'Materiais', href: '/usuario/aluno' },
            { text: 'Turmas', href: '/usuario/aluno/turmas' },
            { text: 'Perfil', href: '/usuario/aluno/perfil' },
          ],
          funcionario: [
            { text: 'Materiais', href: '/usuario/funcionario/materiais' },
            { text: 'Turmas', href: '/usuario/funcionario/turmas' },
            { text: 'Live', href: '/usuario/funcionario/live' },
            { text: 'Listar Materiais', href: '/usuario/funcionario/listarMateriais' },
            { text: 'Perfil', href: '/usuario/funcionario' },
          ],
          root: [
            { text: 'Materiais', href: '/usuario/root/materiais' },
            { text: 'Turmas', href: '/usuario/root/turmas' },
            { text: 'Live', href: '/usuario/root/live' },
            { text: 'Funcionários', href: '/usuario/root/funcionarios' },
            { text: 'Alunos', href: '/usuario/root' },
          ],
    };

    const validUserTypes = Object.keys(menuOptions);

    if (!validUserTypes.includes(userType)) {
      // Se userType não for uma chave válida em menuOptions, você pode lidar com isso aqui
      // Por exemplo, redirecionar para uma página de erro
      return null;
    }

    return menuOptions[userType].map((option, index) => (
      <Link legacyBehavior href={option.href} key={index}>
        <a
          className={`text-black hover:bg-blue-50 zpr-32 zw-full zpy-2 zmr-0 zpl-10 zrounded-none ${
            router.pathname === option.href ? 'bg-blue-100 zborder-l-4 zborder-blue-300' : ''
          }`}
        >
          {option.text}
        </a>
      </Link>
    ));
  }

  function carregarLives(){
    async () => {
      try {
        const livesRef = collection(db, "Lives");
        const livesQuery = query(livesRef);
        const snapshot = await getDocs(livesQuery);
        const lives = snapshot.docs.map((doc) => doc.data() as Live);
        setLives(lives);

      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };
  }

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const turmasRef = collection(db, "Turmas");
        const turmasQuery = query(turmasRef);
        const snapshot = await getDocs(turmasQuery);
        const turmas = snapshot.docs.map((doc) => doc.data() as Turma);
        setListaTurmas(turmas);

      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };

    carregarTurmas();
    carregarLives
  }, []);

  useEffect(() => {
        carregarLive();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center h-screen text-black"> 
      <div className="bg-slate-200 m-8 md:flex-row flex-col rounded-xl w-11/12 md:h-5/6 h-full">
        <div className="flex md:flex-row flex-col w-full h-full">
          <div className="flex flex-col bg-white md:w-72 rounded-md md:place-content-between">

            <section className='flex flex-col md:gap-10 gap-3'>
              <figure className="flex items-center justify-center gap-3 relative my-0 mt-3 md:p-5 pt-3">
                <Link href='/' className='flex gap-2'>
                  <figure className='flex justify-center items-center rounded-full p-0 ml-0 mr-0 bg-slate-900'>
                    <Image src="/images/logoLOGIN.png" width={40} height={40} alt="imagemDoCurso" />
                  </figure>
                  <h2 className='font-bold md:font-normal'>Curso FA.</h2>
                  <div className='flex ml-5 gap-3 md:hidden items-center'>
                    <Link href={"https://www.instagram.com/felipealvesredacao/"}><Image src="/images/instagram.png" width={26} height={25} alt="imagemDoCurso"/></Link>
                    <Link href={"https://api.whatsapp.com/send/?phone=5587981640749&text=matr%C3%ADculas+23&type=phone_number&app_absent=0"}><Image src="/images/whatsapp.png" width={26} height={24} alt="imagemDoCurso"/></Link>
                    <Link href={"https://www.youtube.com/@cursofelipealves29"}><Image src="/images/youtube.png" width={27} height={27} alt="imagemDoCurso"/></Link>
                  </div>
                </Link>
              </figure>
              <nav className="flex md:flex-col items-start md:w-full flex-wrap pl-3 md:pl-0 justify-center">
                {getMenuLinks(props.usuario)}
              </nav>
            </section>
            
            <section>
              <div className='md:flex ml-5 gap-3 hidden'>
                <Link href={"https://www.instagram.com/felipealvesredacao/"}><Image src="/images/instagram.png" width={26} height={25} alt="imagemDoCurso"/></Link>
                <Link href={"https://api.whatsapp.com/send/?phone=5587981640749&text=matr%C3%ADculas+23&type=phone_number&app_absent=0"}><Image src="/images/whatsapp.png" width={26} height={24} alt="imagemDoCurso"/></Link>
                <Link href={"https://www.youtube.com/@cursofelipealves29"}><Image src="/images/youtube.png" width={27} height={27} alt="imagemDoCurso"/></Link>
              </div>
              <div className='flex flex-col bg-blue-300 rounded-lg m-3 p-3 text-white'>
                <div className='flex flex-row items-center pb-1'>
                  <span className="relative flex h-4 w-4 mx-2">
                    {live?.id != Live.vazio().id && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-4 w-4 ${live?.id != Live.vazio().id? "bg-red-600" : "bg-slate-300"}`}></span>
                  </span>
                  <h4 className="font-Montserrant max-w-[150px] truncate overflow-hidden">Live {live?.id != Live.vazio().id && live?.nome}</h4>
                </div>
                <div className='flex justify-center items-center gap-1'>
                  {live?.id != Live.vazio().id? <Link href={live? live?.link : ''} className={`bg-white p-2 rounded-lg text-black font-Montserrant text-center ${ livesAtuais.length>1 ? 'w-36': 'w-44'}`}>Participar</Link> : ''}
                  {live?.id != Live.vazio().id && livesAtuais.length>1 && 
                  <button title='Mudar a live selecionada' onClick={liveSelecionada} className='flex w-8 h-8 rounded-full bg-white items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-black">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>}
                </div>
              </div>
            </section>

          </div>

          {props.divisoes ? (
            <div className={`w-full ${props.className}`}>{props.children}</div>
          ) : (
            <div className={`bg-white rounded-md w-full m-2 p-6 ${props.className}`}>{props.children}</div>
          )}

        </div>
      </div>
    </div>
  );
}