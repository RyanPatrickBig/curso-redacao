import LayoutUser from "@/components/LayoutUser";
import Select from "@/components/Select";
import TabelaRoot from "@/components/TabelaRoot";
import Titulo from "@/components/Titulo";
import { useEffect, useState } from "react";
import Aluno from "@/core/Aluno";
import {Botao} from "@/components/Botao";
import Modal from "@/components/Modal";
import ModalRootTurma from "@/components/modals/ModalRootTurma";
import ModalExcluir from "@/components/modals/ModalExcluir";
import ModalRootALunos from "@/components/modals/ModalRootAlunos";
import Turma from "@/core/Turma";
import { getDocs, query, collection, addDoc, where, updateDoc, doc, getDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/backend/config';

export default function RootTurmas() {

    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const dados = ['natural','nome','cpf','pagamento']
    const cabecalho = ['Estado', 'Nome', 'CPF', 'Pagamento']
    const [select, setSelect] = useState<string[]>([]);
    const [alunos, setSlunos] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const [aluno, setAluno] = useState<Aluno>(Aluno.vazio())
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState<Aluno[]>([]);
    const [filtragem, setFiltragem] = useState(listagem)
    const [filtro, setFiltro] = useState('Todos(as)')
    const [recarregar, setRecarregar] = useState(false)
    

    useEffect(() => {
        const carregarTurmas = async () => {
          try {
            const turmasRef = collection(db, "Turmas");
            const turmasQuery = query(turmasRef);
            const snapshot = await getDocs(turmasQuery);
            const turmas = snapshot.docs.map((doc) => doc.data() as Turma);
            console.log(turmas[0])
            setListaTurmas(turmas);
    
            const seletorAtualizado = ['Todos(as)', ...turmas.map((turma) => turma.nome)];
            setSelect(seletorAtualizado);
          } catch (error) {
            console.error("Erro ao carregar turmas:", error);
          }
        };
    
        carregarTurmas();
      }, []); 

      const aoClicar = async () => {
        try {
          if (filtro === "Todos(as)") {
            const alunosRef = collection(db, "Estudante");
            const alunosQuery = query(alunosRef);
            const snapshot = await getDocs(alunosQuery);
            const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Aluno[];
            setFiltragem(alunos);
          } else {
            const turmaSelecionada = listaTurmas.find((turma) => turma.nome === filtro);
            if (turmaSelecionada) {
              const alunosRef = collection(db, "Estudante");
              const alunosQuery = query(alunosRef, where("turma", "array-contains", turmaSelecionada.id));
              const snapshot = await getDocs(alunosQuery);
              const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Aluno[];
              setFiltragem(alunos);
            } else {
              console.error("Turma não encontrada:", filtro);
            }
          }
      
          setRecarregar(false);
        } catch (error) {
          console.error("Erro ao carregar alunos associados à turma:", error);
        }
      };
    
      useEffect(() => {
        if(filtro || listaTurmas || recarregar){
          aoClicar();
        }
      }, [filtro, listaTurmas, recarregar]);

    
    function alunoSelecionado(aluno: Aluno){
        setAluno(aluno)
        setTipoModal("editar")
        setOpenModal(true)
    }
    function alunoExcluido(aluno: Aluno){
        setAluno(aluno);
        setTipoModal('excluir')
        setOpenModal(true)
    }
    function turmaSelecionada(){
        setTipoModal('selecionado')
        setOpenModal(true)
    }

    const excluirAlunoFirestore = async (alunoId: string) => {
      try {
        const alunoRef = doc(db, 'Estudante', alunoId);
        await deleteDoc(alunoRef);
        console.log('Aluno excluído com sucesso do Firestore');
        setRecarregar(true)
      } catch (error) {
        console.error('Erro ao excluir aluno do Firestore:', error);
      }
    };

    const exclusao = async (id: any) => {
    try {
      await excluirAlunoFirestore(id);

      const alunosFiltrados = listagem.filter((aluno) => aluno.id !== id);
      setListagem(alunosFiltrados);

      setOpenModal(false);
      setRecarregar(true);
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
    }
  };
    
    function edicao(alunoEditado: Aluno) {
        const alunoId = alunoEditado.id;
      
        const atualizarAlunoFirestore = async () => {
          try {
            const alunoDocRef = doc(db, 'Estudante', alunoId);
            await updateDoc(alunoDocRef, {
              nome: alunoEditado.nome,
              data: alunoEditado.data,
              natural: alunoEditado.natural,
              endereco: alunoEditado.endereco,
              celular: alunoEditado.celular,
              email: alunoEditado.email,
              pai: alunoEditado.pai,
              mae: alunoEditado.mae,
              rg: alunoEditado.rg,
              cpf: alunoEditado.cpf,
              mensalidade: alunoEditado.mensalidade,
              turma: alunoEditado.turma,
              pagamento: alunoEditado.pagamento,
              senha: alunoEditado.senha,
            });
      
            console.log('Aluno atualizado no Firestore');
          } catch (error) {
            console.error('Erro ao atualizar aluno no Firestore', error);
          }
        };
      
        atualizarAlunoFirestore();

        const indexToEdit = listagem.findIndex((aluno) => aluno.id === alunoId);
        if (indexToEdit !== -1) {
          const listaAtualizada = [...listagem];
          listaAtualizada[indexToEdit] = alunoEditado;
          setListagem(listaAtualizada);
          setOpenModal(false);
        } else {
          setOpenModal(false);
        }
        setRecarregar(true);
      }

    useEffect(() => {
        const carregarTurmas = async () => {
            try {
                const turmasSnapshot = await getDocs(collection(db, "Turmas"));
                const turmasData = turmasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Turma[];
                
                setListaTurmas(turmasData);
    
                const seletorAtualizado = ['Todos(as)', ...turmasData.map(turma => turma.nome)];
                setSelect(seletorAtualizado);
            } catch (error) {
                console.error("Erro ao carregar turmas do Firestore", error);
            }
        };
    
        carregarTurmas();
    }, []);
    

    return (
        <LayoutUser usuario={'root'} className="text-black">
            <div className="flex place-content-between">
                <Titulo>Turmas</Titulo>
                <Botao onClick={() => turmaSelecionada()} className="mx-8 px-10">Gerenciar Turmas</Botao>
            </div>
            <Select seletor={select} titulo="Turma" setFiltro={setFiltro} />
                    
            <TabelaRoot objeto={filtragem}
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={alunoSelecionado}
                    objetoExcluido={alunoExcluido}
                    turmas
                    />
                    
            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Gerenciar turma': tipoModal == 'excluir' ? 'Tem certeza que deseja excluir:' : "Editar Aluno"}
                subtitulo={tipoModal == 'excluir' ? aluno.nome : ''} >
                {tipoModal == 'selecionado' ? <ModalRootTurma turmas={listaTurmas} setTurmas={setListaTurmas} turmasSeletor={select} turmaSelecionada={turmaSelecionada} setSelect={setSelect}/>: 
                tipoModal == 'excluir' ? <ModalExcluir objeto={aluno} exclusao={exclusao}/> :
                <ModalRootALunos aluno={aluno} novoAluno={alunoSelecionado} listaTurmas={listaTurmas} editar={edicao}/>}</Modal>

        </LayoutUser>
    )
}
