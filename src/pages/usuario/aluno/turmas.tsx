import LayoutUser from "@/components/LayoutUser";
import Tabela from "@/components/Tabela";
import Titulo from "@/components/Titulo";
import Turma from "@/core/Turma";
import { getAuth, } from "firebase/auth";
import { db } from '@/backend/config'
import { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, getDoc, documentId } from "firebase/firestore";
import { getUserIntoLocalStorage } from "@/utils/authLocalStorage";

interface TurmaData {
  id: string;
  nome: string;
  dia: string;
  horario: string;
  professor: string;
}

export default function TurmasAluno() {
  const [alunoTurmas, setAlunoTurmas] = useState<TurmaData[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const dados = ['nome', 'dia', 'horario', 'professor']
  const cabecalho = ['Matéria', 'Dia', 'Horário', 'Professor']
  // Obtemos informações do usuário salvas no Localstorage
  const user = getUserIntoLocalStorage();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userEmail = user.email;

        const q = query(collection(db, "Estudante"), where("email", "==", userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setNomeUsuario(userData.nome || "");

          const turmasDoEstudante = userData.turma || [];
          const turmasData: TurmaData[] = [];

          for (const turmaId of turmasDoEstudante) {
            const turmaDocRef = doc(db, "Turmas", turmaId);
            const turmaDocSnap = await getDoc(turmaDocRef);

            if (turmaDocSnap.exists()) {
              const turmaData = turmaDocSnap.data() as TurmaData;
              turmasData.push(turmaData);
            }
          }
          setAlunoTurmas(turmasData);
        }
      }
    };

    fetchData();
  }, [user]);

  return (
    <LayoutUser divisoes usuario={'aluno'} className="text-black">

      <section className="bg-white rounded-md w-auto h-auto m-2 mb-0 p-3">
        <div className="flex place-content-left items-center">
          <div className="
                        flex justify-center items-center
                        rounded-full p-4 ml-4 mr-0 bg-slate-300"/>
          <Titulo className="font-Montserrant">{nomeUsuario}</Titulo>
        </div>
      </section>

      <section className="bg-white rounded-md w-auto h-5/6 m-2 mb-0">
        <div className="flex justify-center p-5 font-semibold">
          <h3>Suas Turmas</h3>
        </div>
        <Tabela objeto={alunoTurmas}
          propriedadesExibidas={dados}
          cabecalho={cabecalho}></Tabela>
      </section>

    </LayoutUser>
  )
}