import Material from "@/core/Material";
import Avaliacoes from "../Avaliacoes";
import Comentarios from "../Comentarios";
import Comentario from "@/core/Comentario";
import Aluno from "@/core/Aluno";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import {db} from '@/backend/config'

interface ModalAlunoMaterialProps {
    material: Material
    comentarios: Comentario[]
    alunos: Aluno[]
}

export default function ModalAlunoMaterial(props: ModalAlunoMaterialProps){
    const id = props.material.id
    const [modalComments, setModalComments] = useState<Comentario[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([])

    const fetchComments = async () => {
        try {
          const commentsCollection = collection(db, "comentario");
          const q = query(commentsCollection);
          const querySnapshot = await getDocs(q);
          const comments = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as Comentario[];
          const comentarioFiltrado = comments.filter((comentario: any) => comentario.idMaterial === props.material.id);
          setModalComments(comentarioFiltrado)
        } catch (error) {
          console.error("Erro na busca de comentários:", error);
        }
      };
    
      const fetchAlunos = async () => {
        try {
        const alunosRef = collection(db, "Estudante");
        const alunosQuery = query(alunosRef);
        const snapshot = await getDocs(alunosQuery);
        const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Aluno));
        setAlunos(alunos)
        } catch (error) {
          console.error("Erro ao carregar alunos:", error);
        }
      }

      useEffect(() => {
        if (id) {
          console.log(props.material)
          fetchComments();
          fetchAlunos();
        }
      }, [id]);
    
    
      return (
        <div className="text-black">
          <section className="flex gap-3 bg-pink-300 rounded-lg p-3 my-3">
            <div className="bg-white rounded-lg p-4 w-full">
              <Avaliacoes comentarios={modalComments} />
            </div>
    
            <div className="bg-white rounded-lg p-2 w-full">
              <Comentarios comentarios={modalComments} alunos={alunos} />
            </div>
          </section>
        </div>
      );
    }