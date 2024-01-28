import Aluno from "@/core/Aluno"
import Comentario from "@/core/Comentario"

    interface propsComentarios{
        comentarios: Comentario[]
        alunos: Aluno[]
    }

    export default function Comentarios(props: propsComentarios){
        
        return (
            <div className="md:w-96 w-64 mx-3 text-black">
                <h3 className="font-bold pt-2  text-gray-600">Comentários</h3>
                <form>
                    <div className="flex flex-col pr-3 max-h-60 overflow-y-auto">
                        
                        {props.comentarios.map((comentario, index) => (
                            <div key={index} className="border rounded-md p-3 my-3 pb-4">
                            <div className="flex gap-3 items-center">
                                <div className=" bg-slate-400 object-cover w-8 h-8 rounded-full"/>
                                <h3 className="font-bold">
                                    {props.alunos.find(aluno => aluno.id === comentario.idUsuario)?.nome || "Aluno não encontrado"}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <p className="font-bold text-pink-500 ">{comentario.estrelas}</p>
                                    <svg className="w-4 h-4 text-pink-300 mr-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="text-gray-600 flex flex-wrap mt-2 font-semibold">
                                {comentario.texto}
                            </h4>
                        </div>
                        ))}

                    </div>
                    
                </form>
            </div>
        )
    }