import Material from "@/core/Material";
import {Botao} from "../Botao";
import Estrelas from "../Estrelas";
import Comentario from "@/core/Comentario";
import { useState } from "react";
import Aluno from "@/core/Aluno";

interface ModalAlunoMaterial {
    material: Material
    comentario: Comentario
    aluno?: Aluno | null
    salvarComentario?: (comentario: Comentario) => void
    editarComentario: (comentarioEditado: Comentario) => void;
    excluirComentario: (comentarioExcluido: Comentario) => void
}

export default function ModalAlunoMaterial(props: ModalAlunoMaterial){
    const idMaterial = (props.material.id ?? '')
    const id = props.comentario?.id
    const [texto, setTexto] = useState(props.comentario?.texto ?? '')
    const [estrelas, setEstrelas] = useState(props.comentario?.estrelas ?? '')
    const idUsuario = (props.aluno?.id ?? '')

    const handleTextoChange = (e: any) => {
        setTexto(e.target.value);
      };

      const handleEnviarComentario = () => {
        if (estrelas === 0) {
          alert("Avaliação deve ser maior que 0");
        } else {
          const novoComentario = new Comentario(idMaterial, texto, estrelas, idUsuario, id, false);
          props.salvarComentario?.(novoComentario);
        }
      };

    return(
        <div className="text-black">
            <section className="bg-pink-200 rounded-lg p-3 my-3">      
                <div className="flex items-center mb-3 gap-1">
                    <div className=" flex justify-center items-center
                            rounded-full p-4 ml-4 mr-0 bg-white"/>
                    <h4 className="ml-1">{props.aluno?.nome}</h4>
                </div>     

                <div className="bg-white rounded-lg">
                    <input type="text" className="rounded-md p-3 w-full outline-none" value={texto} onChange={handleTextoChange}
                    placeholder="Insira aqui sua dúvida e/ou comentário"/>
                </div>
            </section>

            <section className="flex place-content-between gap-10">
                <div className="flex justify-center bg-pink-400 rounded-lg p-2 px-3 gap-2 text-white font-bold font-Montserrant">
                    <h3>Avaliação</h3>
                    <Estrelas estrelas={estrelas} setEstrelas={setEstrelas}/>
                </div>
                <Botao className="p-10" onClick={handleEnviarComentario}>
          Enviar
        </Botao>
            </section>
        </div>
    )
}