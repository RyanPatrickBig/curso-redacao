import { IconeComentario, IconeDeletar, IconeEnviar } from "./Icones"
import Link from "next/link"
import { Timestamp } from "firebase/firestore"

interface TabelaProps {
    objeto: any
    propriedadesExibidas: any
    cabecalho: string[]
    objetoSelecionado?: (objeto: any) => void
    objetoExcluido?: (objeto: any) => void
    linkDoObjeto?: any 
    children?: never[]
    linkDoMaterial?: (objeto: any) => string;
}

export default function Tabela(props: TabelaProps){

    const exibirAcoes = props.objetoExcluido || props.objetoSelecionado
    function renderizarCabecalho() {
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
                        rounded-full p-2 m-1 bg-slate-300 hover:bg-white">
                            {IconeComentario}
                    </button>
                ) : false}
                {props.objetoExcluido ? (
                    <button onClick={() => props.objetoExcluido?.(objeto)} className="
                        flex justify-center items-center
                        rounded-full p-2 m-1 bg-slate-300 hover:bg-white">
                            {IconeDeletar}
                    </button>
                ) : false}
                {props.linkDoObjeto ? (
                    <Link href={objeto.link} className="
                        flex justify-center items-center
                        rounded-full p-2 m-1 bg-slate-300 hover:bg-white">
                            {IconeEnviar}
                    </Link>
                ) : false}
            </td>
        )
    }

    function renderizarDados() {
        return props.objeto?.map((objeto: any, index: any) => {
          return (
            <tr key={index} className={`${index % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200'}`}>
              {props.propriedadesExibidas.map((propriedade: any, propIndex: any) => (
                <td key={propIndex} className="text-center p-2">
                  {propriedade === 'pagamento'
                    ? objeto[propriedade]
                      ? 'Pago'
                      : 'Não pago'
                    : objeto[propriedade] instanceof Timestamp
                    ? ''
                    : propriedade === 'titulo' && props.linkDoMaterial
                    ? (
                        <a href={props.linkDoMaterial(objeto)} target="_blank" rel="noopener noreferrer">
                          {objeto[propriedade]}
                        </a>
                      )
                    : objeto[propriedade]}
                </td>
              ))}
              {exibirAcoes ? renderizarAcoes(objeto) : false}
            </tr>
          );
        });
      }
      
      

    return (
        <table className="w-full border-separate border-spacing-y-2 text-black">
            <thead>
                {renderizarCabecalho()}
            </thead>
            <tbody>
                {renderizarDados()}
            </tbody>
        </table>
      );
    }