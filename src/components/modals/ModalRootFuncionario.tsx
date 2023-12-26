import Funcionario from "@/core/Funcionario";
import EntradaPerfil from "../EntradaPerfil";
import { useState } from "react";
import {Botao} from "../Botao";


interface ModalRootFuncionarioProps {
    funcionario: Funcionario;
    adicao?: (funcionario: Funcionario) => void
    editar?: (funcionario: Funcionario) => void
    setOpenModal?: (open: boolean) => void
}
    
  export default function ModalRootFuncionario(props: ModalRootFuncionarioProps){
    const id = props.funcionario?.id
    const [nome, setNome] = useState(props.funcionario?.nome ?? '')
    const [cpf, setCpf] = useState(props.funcionario?.cpf ?? '')
    const [rg, setRg] = useState(props.funcionario?.rg ?? '')
    const [celular, setCelular] = useState(props.funcionario?.celular ?? '')
    const [email, setEmail] = useState(props.funcionario?.email ?? '')
    const [senha, setSenha] = useState(props.funcionario?.senha ?? '')
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const cpfRegex = /^(\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;

    return(
        <div>
            <div className="grid grid-rows-2 grid-flow-col bg-blue-200 rounded-lg p-3 my-3">
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Nome" valor={nome} valorMudou={(valor) => setNome(valor)}/>
                <EntradaPerfil
                    className="text-white"
                    className2="bg-white rounded-xl text-black"
                    texto="CPF"
                    valor={cpf}
                    valorMudou={(valor) => setCpf(valor)}
                    pattern={cpfRegex}
                />
                {cpf && !cpfRegex.test(cpf) && (<small className="text-red-500">CPF inválido.</small> )}                
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="RG" valor={rg} valorMudou={(valor) => setRg(valor)}/>
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Celular" valor={celular} valorMudou={(valor) => setCelular(valor)}/>
                <EntradaPerfil
                    className="text-white"
                    className2="bg-white rounded-xl text-black"
                    texto="Email"
                    valor={email}
                    valorMudou={(valor) => setEmail(valor)}
                    pattern={emailRegex}
                />
                {email && !emailRegex.test(email) && (<small className="text-red-500">E-mail inválido.</small>)}                
                <EntradaPerfil className="text-white" className2="bg-white rounded-xl text-black" texto="Senha" valor={senha} valorMudou={(valor) => setSenha(valor)}/>
            </div>
            <div className="flex place-content-end">
                <Botao className="p-10 bg-blue-400" cor="blue"
                    onClick={() => {
                      if (props.funcionario.id) {
                          props.editar?.(new Funcionario(nome, cpf, rg, celular, email, senha, id, false));
                          console.log("funcionou")
                          props.setOpenModal?.(false);
                      } else {
                          props.adicao?.(new Funcionario(nome, cpf, rg, celular, email, senha, undefined, false));
                          props.setOpenModal?.(false);
                      }
                  }}>
                {id ? 'Alterar':'Criar funcionário'}  </Botao>
            </div>
        </div>
    )
}