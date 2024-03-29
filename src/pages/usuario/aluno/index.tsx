import LayoutUser from "@/components/LayoutUser";
import Modal from "@/components/Modal";
import Tabela from "@/components/Tabela";
import ModalAlunoMaterial from "@/components/modals/ModalAlunoMaterial";
import Material from "@/core/Material";
import Comentario from "@/core/Comentario";
import { useEffect, useState } from "react";
import { collection, getDocs, where, getDoc,addDoc, updateDoc, deleteDoc, doc, query } from "firebase/firestore";
import { db } from '@/backend/config';
import Turma from "@/core/Turma";
import { getUserIntoLocalStorage } from "@/utils/authLocalStorage";
import ProtectedRoute from '@/components/ProtectedRoute'


export default function AlunoIndex() {

    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string | null>(null);
    const [materiais, setMateriais] = useState<Material[]>([]);
    const dados = ['nome', 'descricao', 'professor']
    const cabecalho = ['Título', 'Descrição', 'Professor', `Avaliar & Enviar redações`]
    const [comentarios, setComentarios] = useState<Comentario[]>([])
    const [material, setMaterial] = useState<Material>(Material.vazio())
    const [comentario, setComentario] = useState<Comentario>(Comentario.vazio())
    const [openModal, setOpenModal] = useState(false)
    const [turmasDoAluno, setTurmasDoAluno] = useState<Turma[]>([]);
    const [nomeUsuario, setNomeUsuario] = useState<string>("");
    const [materiaisDisciplinaSelecionada, setMateriaisDisciplinaSelecionada] = useState<Material[]>([]);
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
    
            const turmasData: Turma[] = [];
    
            for (const turmaId of turmasDoEstudante) {
              const turmaDocRef = doc(db, "Turmas", turmaId);
              const turmaDocSnap = await getDoc(turmaDocRef);
    
              if (turmaDocSnap.exists()) {
                const turmaData = turmaDocSnap.data() as Turma;
                turmasData.push(turmaData);
              }
            }
    
            setTurmasDoAluno(turmasData);
            if(!disciplinaSelecionada){
              setDisciplinaSelecionada(turmasData[0].disciplina)
            }
          }
        }
      };
    
      fetchData();
    }, [user]);
    
    
    useEffect(() => {
      const fetchMateriais = async () => {
        
        const materiaisData: Material[] = [];
    
        for (const turma of turmasDoAluno) {
          try {
            const qMateriais = query(
              collection(db, "Material"),
              where("disciplina", "==", disciplinaSelecionada),
              where("turma", "==", turma.nome)
            );
            
            const querySnapshotMateriais = await getDocs(qMateriais);
      
            querySnapshotMateriais.forEach((materialDoc) => {
              const materialData = materialDoc.data() as Material;
              materiaisData.push(materialData);
            });
          } catch (error) {
            console.error('Error fetching materials:', error);
          }
        }
    
        setMateriais(materiaisData);
        setMateriaisDisciplinaSelecionada(materiaisData);
      };
    
      if (disciplinaSelecionada && turmasDoAluno.length > 0) {
        fetchMateriais();
      }
      
    }, [disciplinaSelecionada, turmasDoAluno]);
    
    
    
    const aoClicarDisciplina = async (disciplina: string) => {
      if (user) {
        
        if (disciplina !== disciplinaSelecionada) {
          setDisciplinaSelecionada(disciplina);
    
          const materiaisData: Material[] = [];
    
          for (const turma of turmasDoAluno) {
            if (disciplina) {
              console.log("Disciplina Selecionada:", disciplina);
              const qMateriais = query(
                collection(db, "Material"),
                where("disciplina", "==", disciplina),
                where("turma", "==", turma.nome)
              );
    
              try {
                const querySnapshotMateriais = await getDocs(qMateriais);
    
                querySnapshotMateriais.forEach((materialDoc) => {
                  const materialData = materialDoc.data() as Material;
                  materiaisData.push(materialData);
                });
              } catch (error) {
                alert('Ocorreu um erro inesperado, tente novamente mais tarde.')
                console.error('Erro ao buscar materiais:', error);
              }
            }
          }
    
          setMateriaisDisciplinaSelecionada(materiaisData);
        }
      }
    };
 

    function materialSelecionado(material: Material) {
      setMaterial(material);
    
      if (user) {
        const comentariosFiltrados = comentarios.filter(
          (comentario) =>
            comentario.idMaterial === material.id && comentario.idUsuario === user.id
        );
    
        if (comentariosFiltrados.length > 0) {
          setComentario(comentariosFiltrados[0]);
        } else {
          setComentario(Comentario.vazio());
        }
    
        setOpenModal(true);
      } else {
        console.error("Aluno não definido.");
      }
    }    

    async function salvarComentario(comentarioNovo: Comentario) {
      if (!comentarioNovo.texto || !comentarioNovo.estrelas) {
        alert("Preencha todos os campos obrigatórios.");
        return;
      }

      const comentarioData = {
        texto: comentarioNovo.texto,
        idUsuario: comentarioNovo.idUsuario,
        idMaterial: comentarioNovo.idMaterial,
        estrelas: comentarioNovo.estrelas,
      };
    
      try {
      const comentarioRef = await addDoc(collection(db, 'comentario'), comentarioData);
      console.log('Comentário salvo com sucesso. ID:', comentarioRef.id);
      alert('Comentário salvo com sucesso.');
    } catch (error) {
      console.error('Erro ao salvar o comentário:', error);
      alert('Erro ao salvar o comentário. Por favor, tente novamente.');
    }

    setComentarios([...comentarios, comentarioNovo]);

    setOpenModal(false);
  } 
    

    async function editarComentario(comentarioEditado: Comentario) {
      const indexToEdit = comentarios.findIndex((comentario) => comentario.id === comentarioEditado.id);
    
      if (!comentarioEditado.id) {
        console.error("ID do comentário não definido.");
        setOpenModal(false);
        return;
    } 

      if (indexToEdit !== -1) {
        try {
          const comentarioDocRef = doc(db, 'comentario', comentarioEditado.id);
         
          await updateDoc(comentarioDocRef, {
            texto: comentarioEditado.texto,
            estrelas: comentarioEditado.estrelas,
          });
          
          alert('Comentário atualizado com sucesso.');
        } catch (error) {
          console.error('Erro ao atualizar o comentário:', error);
          alert('Erro ao atualizar o comentário. Por favor, tente novamente.');
          return;
        }
    
        const listaAtualizada = [...comentarios];
        listaAtualizada[indexToEdit] = comentarioEditado;
        setComentarios(listaAtualizada);
      } else {
        alert("Comentário não encontrado");
      }
    
      setOpenModal(false);
    }
    
    async function excluirComentario() {
      if (!comentario.id) {
        console.error("ID do comentário não definido.");
        setOpenModal(false);
        return;
      }
    
      try {
        const comentarioDocRef = doc(db, 'comentario', comentario.id);
        await deleteDoc(comentarioDocRef);
        alert('Comentário excluído com sucesso.');
      } catch (error) {
        console.error('Erro ao excluir o comentário:', error);
        alert('Erro ao excluir o comentário. Por favor, tente novamente.');
        return;
      }
    
      const comentariosFiltrados = comentarios.filter((comentarioLista) => comentarioLista.id !== comentario.id);
      setComentarios(comentariosFiltrados);
      setOpenModal(false);
    }
    


    return (
      <ProtectedRoute>
        <LayoutUser divisoes usuario={"aluno"} className="text-black">

            <section className="bg-white rounded-md w-auto h-auto m-2 mb-0 p-3">
                <div className="flex place-content-left items-center">
                    <div className="
                        flex justify-center items-center
                        rounded-full p-4 ml-4 mr-0 bg-slate-300"/>
                    <div className="ml-5 mt-1 font-Montserrant">
                        <h4 className="ml-1">Olá, {nomeUsuario}</h4>
                        <h2>Bem vindo de volta!</h2>
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-md w-auto h-4/5 m-2 ">
                <div className="ml-8 py-4">
                    <h3 className="font-Monteserrant font-semibold">Materiais</h3>
                    {turmasDoAluno.map((turma, index) => (
                    <button
                      key={`${turma.id}_${turma.disciplina}_${index}`}
                      onClick={() => aoClicarDisciplina(turma.disciplina)}
                      className={`border-b-2 hover:border-blue-400 mr-4 ${disciplinaSelecionada === turma.disciplina ? 'border-blue-400' : ''}`}
                      >
                    {turma.disciplina}
                  </button>
                ))}

                </div>
              <div className="overflow-auto max-h-[78%]">
                <Tabela
                  objeto={materiaisDisciplinaSelecionada}
                  propriedadesExibidas={dados}
                  cabecalho={cabecalho}
                  objetoSelecionado={materialSelecionado}
                  linkDoObjeto
                  linkDoMaterial={(material) => material.arquivo}
                />
              </div>
            </section>
            
            <Modal
        isOpen={openModal}
        isNotOpen={() => setOpenModal(!openModal)}
        cor="white"
        titulo="Avalie o material"
        subtitulo={material.nome}
      >
        <ModalAlunoMaterial
          material={material}
          comentario={comentario}
          aluno={user}
          salvarComentario={salvarComentario}
          editarComentario={editarComentario}
          excluirComentario={excluirComentario}
        />
      </Modal>
        </LayoutUser>
        </ProtectedRoute>
    )
}