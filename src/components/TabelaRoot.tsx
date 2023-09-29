import { format } from "date-fns"
import { IconeFeedback, IconeDeletar } from "./Icones"
import Funcionario from "@/core/Funcionario"

interface TabelaProps {
    objeto: any
    propriedadesExibidas: any
    cabecalho: string[]
    objetoSelecionado?: (objeto: any) => void
    pagamento?: (objeto: any) => void
    salvarFuncionario?: (objeto: any) => void
    objetoExcluido?: (objeto: any) => void
    turmas?: boolean
}

export default function Tabela(props: TabelaProps){

    const exibirAcoes = props.objetoExcluido || props.objetoSelecionado

    function renderizarCabecalho(){
        return (
            <tr>
                {props.cabecalho.map((coluna: any, index: any) => (
                <th key={index}>{coluna}</th>
                ))}
            </tr>
        )
    }

    function renderizarAcoes(objeto: any){
        return (
            <td className="flex justify-center gap-2">
                {props.objetoSelecionado ? (
                    <button onClick={() => props.objetoSelecionado?.(objeto)} className="
                        flex justify-center items-center
                        rounded-full p-2 px-8 m-1 bg-slate-300 hover:bg-blue-300
                        font-semibold">
                            Editar
                    </button>
                ) : false}
                {props.objetoExcluido ? (
                    <button onClick={() => props.objetoExcluido?.(objeto)} className="
                        flex justify-center items-center
                        rounded-full p-2 m-1 bg-slate-300 hover:bg-red-300"
                        title="Remover">
                            {IconeDeletar}
                    </button>
                ) : false}
            </td>
        )
    }

    function renderizarPagamento(objeto: any, propriedade: any){
        return (
            <div className="flex justify-center">
                {
                objeto[propriedade] ?
                    <button onClick={() => props.pagamento?.(objeto)} className="
                        flex rounded-full p-2 px-4 -my-1 bg-blue-400 hover:bg-blue-300 text-white font-semibold">
                            Confirmar pagamento
                    </button> :
                    <div className="bg-white rounded-full p-0 -my-1 flex flex-row items-center gap-12">
                        <h4 className="ml-6 font-semibold">PAGO</h4>
                        <button onClick={() => props.pagamento?.(objeto)} className="
                            flex rounded-full px-4 py-2 bg-blue-400 hover:bg-blue-300 text-white font-semibold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                Ver
                        </button>
                    </div>
                }
            </div>
        )
    }

    function renderizarDados(){
        return (
            <>
                {props.objeto?.map((objeto: any, index: any) => {
                    return (
                        <tr key={objeto.id}
                            className={`${index % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200'}`}>
                            {props.propriedadesExibidas.map((propriedade: any, propIndex: any) => (
                                <td key={propIndex} className="text-center p-2">
                                    {propriedade === 'pagamento'
                                        ? props.turmas ?
                                        objeto[propriedade]?
                                        'Pago' : 'Não pago'
                                        : renderizarPagamento(objeto, propriedade)
                                        : objeto[propriedade] instanceof Date ?
                                        format(objeto[propriedade], 'dd-MM-yyyy')
                                        : (
                                        objeto[propriedade]
                                    )}
                                </td>
                            ))}
                            {exibirAcoes ? renderizarAcoes(objeto): false}
                        </tr>
                    )
                })}
                
            </>
        )
    }

    function renderizarFuncionario(objeto: any){
        return(
            <>
                {props.objeto[props.objeto.length - 1] instanceof Funcionario && (
                    <tr>
                        <td colSpan={props.propriedadesExibidas.length} className="text-right p-1 pr-6">
                            <button onClick={() => props.salvarFuncionario?.(objeto)} className="px-10 py-1 bg-blue-400 text-white 
                            font-semibold rounded-full"
                            >Criar novo funcionário</button>    
                        </td>
                    </tr>
                )}
            </>
        )
    }

    //{objeto.constructor.name === 'Funcionario' ? index === props.objeto.length-1 ? 'a' : false : false}

    return (
        <table className="w-full border-separate border-spacing-y-2 text-black">
            <thead>
                {renderizarCabecalho()}
            </thead>
            <tbody>
                {renderizarDados()}
                {renderizarFuncionario(props.objeto)}
            </tbody>
        </table>
    )
}