import Entrada from "./Entrada";
import { useState } from "react";
import Aluno from "@/core/Aluno";
import { Botao } from "./Botao";
import DatePicker from "./DatePicker"; 
import {db} from '../backend/config'
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; 


interface FormularioProps{
    aluno: Aluno
}

 export default function Formulario(props: FormularioProps){
    const initialData = props.aluno?.data ? new Date(props.aluno.data) : new Date();

    const id = props.aluno?.id
    const [nome, setNome] = useState(props.aluno?.nome ?? '')
    const [data, setData] = useState(initialData);
    const [natural, setNatural] = useState(props.aluno?.natural ?? '')
    const [endereco, setEndereco] = useState(props.aluno?.endereco ?? '')
    const [celular, setCelular] = useState(props.aluno?.celular ?? '')
    const [email, setEmail] = useState(props.aluno?.email ?? '')
    const [pai, setPai] = useState(props.aluno?.pai ?? '')
    const [mae, setMae] = useState(props.aluno?.mae ?? '')
    const [rg, setRg] = useState(props.aluno?.rg ?? '')
    const [cpf, setCpf] = useState(props.aluno?.cpf ?? '')
    const [senha, setSenha] = useState(props.aluno?.senha ?? '')
    const [mensalidade, setMensalidade] = useState(props.aluno?.mensalidade ?? '')
    const [termosDeUso, setTermosDeUso] = useState(false);
    const [confirmarSenha, setConfirmarSenha] = useState('');


    const auth = getAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termosDeUso) {
            console.error("Você deve aceitar os termos de uso para continuar.");
            return;
        }

        if (senha.length < 6) {
            console.error("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            console.error("As senhas não coincidem.");
            return;
          }
    
        const formData = {
          nome, data, natural, endereco, celular,
          email, pai, mae, rg, cpf,
          senha, mensalidade,
        };
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

          const docRef = await addDoc(collection(db, "alunos"), formData);
    
          console.log("Dados do aluno salvos com ID:", docRef.id);
    
          setNome("");
          setData(initialData);
          setNatural("");
          setEndereco("");
          setCelular("");
          setEmail("");
          setPai("");
          setMae("");
          setRg("");
          setCpf("");
          setEmail("");
          setConfirmarSenha('');
          setMensalidade(0);
          setTermosDeUso(false);

          
        } catch (error) {
          console.error("Erro ao salvar os dados no Firestore", error);
        }
      };
      
      const handleTermosDeUsoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTermosDeUso(e.target.checked);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <Entrada texto="Nome" valor={nome} valorMudou={(e) => setNome(e.target.value)} placeholder="Digite seu nome COMPLETO" />
            <DatePicker classname="text-black" titulo="Data de Nascimento" dataMax={new Date()}/>
            <Entrada texto="Naturalidade ( Cidade/Estado )" valor={natural} valorMudou={(e) => setNatural(e.target.value)} />
            <Entrada texto="Endereço ( Rua, Nº, Bairro)" valor={endereco} valorMudou={(e) => setEndereco(e.target.value)} />
            <Entrada texto="Número de celular (com DDD)" valor={celular} valorMudou={(e) => setCelular(e.target.value)} placeholder="(**)****-****" />
            <Entrada texto="E-mail" valor={email} valorMudou={(e) => setEmail(e.target.value)} />
            <Entrada texto="Nome do Pai" valor={pai} valorMudou={(e) => setPai(e.target.value)} />
            <Entrada texto="Nome da Mãe" valor={mae} valorMudou={(e) => setMae(e.target.value)} />
            <Entrada texto="Senha" valor={senha} valorMudou={(e) => setSenha(e.target.value)} tipo="password"/>
            {senha.length < 6 && (
                <small className="text-red-500">
                    A senha deve conter pelo menos 6 caracteres.
                </small>
            )}
            <Entrada texto="Confirmar Senha" valor={confirmarSenha} valorMudou={(e) => setConfirmarSenha(e.target.value)} tipo="password" />
            {senha.length >= 6 && senha !== confirmarSenha && (
                <small className="text-red-500">
                    As senhas não coincidem.
                </small>
            )}
            <h2 className="font-Montserrant">Documentação</h2><br />
            <Entrada texto="RG" valor={rg} valorMudou={(e) => setRg(e.target.value)} />
            <Entrada texto="CPF" valor={cpf} valorMudou={(e) => setCpf(e.target.value)} />
            
            <label className="font-Montserrant">Data de preferência para pagamento</label>
            <div className="flex flex-row items-center gap-6 pt-4">
                <div className="flex items-center">
                    <input onChange={() => setMensalidade(10)}id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-pink-600 bg-gray-100
                            dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Dia 10</label>
                </div>
                <div className="flex items-center">
                    <input onChange={() => setMensalidade(15)}checked id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-pink-600 bg-gray-100
                            dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Dia 15</label>
                </div>
            </div>

            <div className="pt-28 flex-col">
                <div className="flex items-center mb-6">
                    <input id="default-checkbox" type="checkbox" value="" checked={termosDeUso} onChange={handleTermosDeUsoChange}
                    className="w-4 h-4 text-pink-600 bg-gray-100  rounded-xl
                            dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"/>
                    <label htmlFor="default-checkbox" className="ml-2 text-sm text-gray-900 dark:text-gray-300"><a href="" className="hover:underline">Termos de uso</a></label>
                </div>
                <Botao type="submit" className="px-12">
                 Próximo
                </Botao>
                
            </div>
            </form>
        </div>  
    )
    } 