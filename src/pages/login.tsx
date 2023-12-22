import { IconeVoltar } from '@/components/Icones';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { db } from "@/backend/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import router from 'next/router';
import { saveUserIntoLocalStorage } from '@/utils/authLocalStorage';

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [userProfile, setUserProfile] = useState({});

    async function login(e: any) {
        try {
            e.preventDefault()

            const alunosRef = collection(db, "Estudante");
            const alunosQuery = query(alunosRef, where("email", "==", email));
            const alunosSnapshot = await getDocs(alunosQuery);

            if (!alunosSnapshot.empty) {
                const alunoData = alunosSnapshot.docs[0].data();
                saveUserIntoLocalStorage(alunoData)
                setUserProfile(alunoData);
                router.push("/usuario/aluno/perfil");
                return;
            }

            const funcionariosRef = collection(db, "Funcionario");
            const funcionariosQuery = query(funcionariosRef, where("email", "==", email));
            const funcionariosSnapshot = await getDocs(funcionariosQuery);

            if (!funcionariosSnapshot.empty) {
                const funcionarioData = funcionariosSnapshot.docs[0].data();
                saveUserIntoLocalStorage(funcionarioData)
                setUserProfile(funcionarioData);
                router.push("/usuario/funcionario");
                return;
            }

            const rootRef = collection(db, "Root");
            const rootQuery = query(rootRef, where("email", "==", email));
            const rootSnapshot = await getDocs(rootQuery)

            if(!rootSnapshot.empty){
                const rootData = rootSnapshot.docs[0].data();
                saveUserIntoLocalStorage(rootData)
                router.push("/usuario/root");
                return;
            }

            console.error("Nenhum usuário encontrado com este email.");
            alert("Senha ou usuário incorretos, tente novamente.")
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Senha ou usuário incorretos, tente novamente mais tarde.")
        }
    }

    async function loginComGoogle() {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);

            router.push('/usuario/aluno/perfil');
        } catch (error) {
            console.error('Erro durante o login com o Google:', error);
            alert('Houve um erro com o Google Serviços, tente novamente mais tarde.')
        }
    }

    return (
        <div className="flex flex-row justify-center">
            <div className="flex flex-col justify-center bg-blue-400 text-white
                            w-1/2 h-screen p-20">

                <div className='flex flex-col items-start pb-10'>
                    <Link href="/" className="
                            flex justify-center items-center
                            rounded-full p-1 m-1">
                        {IconeVoltar}
                    </Link>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className='font-Montserrant text-center'>Juntos, construiremos o seu futuro</h2>
                    <Image src='/images/logoLOGIN.png' width='400' height='400' alt='imagemDoCurso' />
                </div>

            </div>
            <div className="bg-gray-700 w-1/2 p-28 flex flex-col justify-center">
                <form>
                    <div className="flex flex-col">

                        <label className="font-Montserrant text-gray-300"> E-mail </label>
                        <input className={`border-b border-gray-400 focus:outline-none py-2 px-5 mb-7 bg-transparent text-white`}
                            placeholder='Digite seu e-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            pattern={"/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/"}
                        />   
                        {email && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email) && (<small className="text-white -mt-6 mb-3">E-mail inválido.</small>)}
                        

                    </div>
                    <div className="flex flex-col">
                        <label className="font-Montserrant text-gray-300"> Senha </label>
                        <input className={`border-b border-gray-400 focus:outline-none py-2 px-5 mb-7 bg-transparent text-white`}
                            placeholder='Digite sua senha'
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                    <div className="flex items-center mb-6">
                        <input id="default-checkbox" type="checkbox" value=""
                            className="w-4 h-4 text-pink-600 bg-gray-100  rounded-xl
                            dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="default-checkbox" className="ml-2 text-sm text-gray-900 dark:text-gray-300"><a href="" className="hover:underline text-gray-400">Mantenha-me conectado</a></label>
                    </div>
                    <div className='flex items-center gap-7 pt-10'>
                        <button className="text-white py-2 rounded-md px-16 bg-blue-300" onClick={(e) => login(e)}>Entrar</button>
                        <button className='text-gray-400 border-b border-blue-400'>Esqueci a senha</button>
                    </div>
                    <hr className='my-1 border-gray-500 w-full' />

                    <button
                        className='flex w-full bg-white hover:bg-slate-200 text-slate-800 font-semibold rounded-lg px-4 py-3 items-center justify-center gap-5'
                        onClick={loginComGoogle}
                    >
                        <Image src='/images/pesquisa.png' width='23' height='23' alt='imagemDoCurso'></Image>Entrar com Google
                    </button>
                </form>
            </div>
        </div>
    );
}