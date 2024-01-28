import Aluno from "@/core/Aluno";
import EntradaPerfil from "../EntradaPerfil";
import { useState } from "react";
import {Botao} from "../Botao";
import DatePicker from "../DatePicker";
import Turma from "@/core/Turma";


interface ModalRootALunosProps {
    aluno: Aluno
    novoAluno?: (aluno: Aluno) => void
    editar?: (aluno: Aluno) => void
    setOpenModal?: (open: boolean) => void
    listaTurmas: Turma[]
}

export default function ModalRootALunos(props: ModalRootALunosProps){

    const id = props.aluno?.id
    const [nome, setNome] = useState(props.aluno?.nome ?? '')
    const [data, setData] = useState(props.aluno?.data ?? '')
    const [natural, setNatural] = useState(props.aluno?.natural ?? '')
    const [endereco, setEndereco] = useState(props.aluno?.endereco ?? '')
    const [celular, setCelular] = useState(props.aluno?.celular ?? '')
    const [email, setEmail] = useState(props.aluno?.email ?? '')
    const [pai, setPai] = useState(props.aluno?.pai ?? '')
    const [mae, setMae] = useState(props.aluno?.mae ?? '')
    const [rg, setRg] = useState(props.aluno?.rg ?? '')
    const [cpf, setCpf] = useState(props.aluno?.cpf ?? '')
    const [mensalidade, setMensalidade] = useState(props.aluno?.mensalidade ?? '')
    const [turma, setTurma] = useState(props.aluno?.turma ?? props.listaTurmas.map(turma => turma.id));
    const [pagamento, setPagamento] = useState(props.aluno?.pagamento ?? '')
    const [senha, setSenha] = useState(props.aluno?.senha ?? '')

    const handleCheckboxChange = (turmaId: any) => {
        const isTurmaSelected = turma.includes(turmaId);
    
        if (isTurmaSelected) {
            setTurma(updatedTurmasSelecionadas => updatedTurmasSelecionadas.filter(id => id !== turmaId));
        } else {
            setTurma(updatedTurmasSelecionadas => [...updatedTurmasSelecionadas, turmaId]);
        }
    };
    

    return(
        <div>
            <div className="grid grid-rows-4 grid-flow-col overflow-auto max-w-xs md:max-w-none bg-blue-200 rounded-lg p-3 pl-5 pr-0 my-3 h-80">
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Nome" valor={nome} valorMudou={setNome}/>
                <DatePicker titulo="Data de Nascimento" setData={setData} classname2="bg-white text-black" classname="text-white" valor={data}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Naturalidade ( Cidade/Estado )" valor={natural} valorMudou={setNatural}/>

                <div>
                    <h4 className="font-Montserrant text-white">Turmas</h4>
                    <div className="flex flex-col overflow-y-auto w-min bg-white rounded-lg max-h-10 hover:max-h-40 transition-all duration-300 ease-in-out">
                        {props.listaTurmas.map((turmaItem, index) => {
                            return (
                                <div key={index} className="border rounded-md p-2 px-7 pb-4">
                                    <div className="flex gap-3 items-center">
                                        {turmaItem.nome} 
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                value=""
                                                className="sr-only peer"
                                                checked={turma.includes(turmaItem.id || '')}
                                                onChange={() => handleCheckboxChange(turmaItem.id)}
                                            />
                                            <div className={`w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 ${turma.includes(turmaItem.id || '') ? 'peer-checked:bg-blue-600' : ''}`}></div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Endereço ( Rua, Nº, Bairro)" valor={endereco} valorMudou={setEndereco}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Celular (com DDD)" valor={celular} valorMudou={setCelular}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="E-mail" valor={email} valorMudou={setEmail}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Nome do Pai" valor={pai} valorMudou={setPai}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Nome da Mãe" valor={mae} valorMudou={setMae}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="RG" valor={rg} valorMudou={setRg} />
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="CPF" valor={cpf} valorMudou={setCpf}/>
                <div>
                    <label className="text-white font-Montserrant">Data para pagamento</label>
                    <div className="flex flex-row items-center gap-3 ">
                        <div className="flex items-center">
                            <input onChange={() => setMensalidade(10)}id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-pink-600 bg-gray-100" 
                            checked={mensalidade==10}/>
                            <label htmlFor="default-radio-1" className="ml-2 text-sm font-medium text-gray-900 ">Dia 10 </label>
                        </div>
                        <div className="flex items-center">
                            <input onChange={() => setMensalidade(15)}id="default-radio-2" type="radio" value="" name="default-radio" className="w-4 h-4 text-pink-600 bg-gray-100" 
                            checked={mensalidade==15}/>
                            <label htmlFor="default-radio-2" className="ml-2 text-sm font-medium text-gray-900 ">Dia 15</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex place-content-end ">
            <Botao className="p-10 bg-blue-400" cor="blue"
                    onClick={() => {
                        if (id) {
                            props.editar?.(new Aluno(nome, data, natural, endereco, celular, email, pai, mae, rg, cpf, mensalidade, turma, pagamento, senha, id, false));
                            console.log("funcionou")
                            props.setOpenModal?.(false);
                          } else {
                            props.novoAluno?.(new Aluno(nome, data, natural, endereco, celular, email, pai, mae, rg, cpf, mensalidade, turma, pagamento, senha, id, false));
                            props.setOpenModal?.(false);
                          }
                    } }>
                {id ? 'Alterar':'Criar funcionário'}</Botao>
            </div>
        </div>
    )
}