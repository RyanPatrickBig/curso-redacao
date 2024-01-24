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
    

    return (
        <div className="flex md:flex-row flex-col justify-center h-screen">
            <div className="flex flex-col justify-center bg-blue-400 text-white
                            md:w-1/2 w-full md:h-screen md:p-20 px-28 pt-10">

                <div className='flex flex-col items-start pb-10'>
                    <Link href="/" className="
                            flex justify-center items-center
                            rounded-full p-1 md:m-1 md:ml-0 -ml-10">
                        {IconeVoltar}
                    </Link>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className='font-Montserrant text-center md:mx-0 -mx-10'>Juntos, construiremos o seu futuro</h2>
                    <Image src='/images/logoLOGIN.png' width='400' height='400' alt='imagemDoCurso' />
                </div>

            </div>
            <div className="bg-gray-700 md:w-1/2 w-full h-full p-28 md:px-28 md:pt-28 pt-20 px-16 flex flex-col justify-center">
                <form>
                    <div className="flex flex-col">

                        <label className="font-Montserrant text-gray-300"> E-mail </label>
                        <input
                            className={`border-b border-gray-400 focus:outline-none py-2 px-5 mb-7 bg-transparent text-white`}
                            placeholder='Digite seu e-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            pattern="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
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
                    
                    <div className='flex items-center gap-7 pt-4'>
                        <button className="text-white py-2 rounded-md px-16 bg-blue-300" onClick={(e) => login(e)}>Entrar</button>
                        <button className='text-gray-400 border-b border-blue-400'>Esqueci a senha</button>
                    </div>
                    <hr className='hidden my-1 border-gray-500 w-full' />

                </form>
            </div>
        </div>
    );
}