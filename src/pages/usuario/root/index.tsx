import LayoutUser from "@/components/LayoutUser";
import { Botao } from "@/components/Botao";
import Select from "@/components/Select";
import TabelaRoot from "@/components/TabelaRoot";
import Titulo from "@/components/Titulo";
import { useEffect, useState } from "react";
import Aluno from "@/core/Aluno";
import Pesquisa from "@/components/Pesquisa";
import Modal from "@/components/Modal";
import ModalRootPagamento from "@/components/modals/ModalRootPagamento";
import ModalExcluir from "@/components/modals/ModalExcluir";
import ModalRootALunos from "@/components/modals/ModalRootAlunos";
import Turma from "@/core/Turma";
import Pagamento from "@/core/Pagamento";
import { getDocs, query, collection, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/backend/config';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function RootAlunos() {

    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
    const dados = ['natural','nome','cpf','pagamento']
    const cabecalho = ['Estado', 'Nome', 'CPF', 'Pagamento', 'Ações']
    const [select1, setSelect1] = useState<string[]>([])
    const [select2, setSelect2] = useState<string[]>(['Todos(as)', 'dia 10', 'dia 15']);
    const [aluno, setAluno] = useState<Aluno>(Aluno.vazio())
    const [openModal, setOpenModal] = useState(false)
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState(alunos)
    const [filtragem1, setFiltragem1] = useState<Aluno[]>([]);
    const [filtragem2, setFiltragem2] = useState<Aluno[]>([]);
    const [filtro1, setFiltro1] = useState('Todos(as)')
    const [filtro2, setFiltro2] = useState('Todos(as)')
    const [recarregar, setRecarregar] = useState(false)
    const [pesquisa, setPesquisa] = useState('')
    const router = useRouter();

    const aoClicar = async () => {
      let filtragemResultante = listagem;
    
      if (filtro1 === "Todos(as)") {
        const alunosRef = collection(db, "Estudante");
        const alunosQuery = query(alunosRef);
        const snapshot = await getDocs(alunosQuery);
        const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Aluno[];
        filtragemResultante = alunos;
      } else {
        const turmaSelecionada = listaTurmas.find((turma) => turma.nome === filtro1);
    
        console.log("filtro1:", filtro1);
        console.log("turmaSelecionada:", turmaSelecionada);
    
        if (turmaSelecionada) {
          const alunosRef = collection(db, "Estudante");
          const alunosQuery = query(alunosRef, where("turma", "array-contains", turmaSelecionada.id));
          const snapshot = await getDocs(alunosQuery);
          const alunos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Aluno[];
          filtragemResultante = alunos;
        } else {
          console.error("Turma não encontrada");
          alert("Turma não encontrada");
          filtragemResultante = [];
        }
      }
    
      if (pesquisa !== '') {
        filtragemResultante = filtragemResultante.filter((aluno) =>
          aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
        );
    
        if (filtro2 !== "Todos(as)") {
          if(filtro2 === "dia 10"){
            filtragemResultante = filtragemResultante.filter((aluno) => aluno.mensalidade === 10);
          }
          else if(filtro2 === "dia 15"){
            filtragemResultante = filtragemResultante.filter((aluno) => aluno.mensalidade === 15);
          }
        }
      }
    
      setFiltragem1(filtragemResultante);
      setFiltragem2(filtragemResultante);
      setRecarregar(false);
      setOpenModal(false);
    };      
    
      useEffect(() => {
        if(filtro1 || filtro2 || listaTurmas|| pesquisa || recarregar){
          aoClicar();
        }
      }, [filtro1, filtro2, listaTurmas, pesquisa, recarregar]);
      
      
      useEffect(() => {
        const carregarTurmas = async () => {
          try {
            const turmasRef = collection(db, "Turmas");
            const turmasQuery = query(turmasRef);
            const snapshot = await getDocs(turmasQuery);
            const turmas = snapshot.docs.map((doc) => doc.data() as Turma);
            setListaTurmas(turmas);
            console.log(turmas[0])
            const seletorAtualizado = ['Todos(as)', ...turmas.map((turma) => turma.nome)];
            setSelect1(seletorAtualizado);
          } catch (error) {
            console.error("Erro ao carregar turmas:", error);
          }
        };
    
        carregarTurmas();
      }, []); 
        
    function alunoSelecionado(aluno: Aluno){
        setAluno(aluno)
        setTipoModal("editar")
        setOpenModal(true)
    }
    function alunoExcluido(aluno: Aluno){
        console.log(aluno.id)
        setAluno(aluno)
        setTipoModal('excluir');
        setOpenModal(true)
    }
    function abrirPagamento(aluno: Aluno){
        setAluno(aluno)
        setTipoModal('selecionado')
        setOpenModal(true)
    }

    const excluirAlunoFirestore = async (alunoId: string) => {
      try {
        const alunoRef = doc(db, 'Estudante', alunoId);
        await deleteDoc(alunoRef);
        alert('Aluno excluído com sucesso');
        setRecarregar(true);
      } catch (error) {
        console.error('Erro ao excluir aluno do Firestore:', error);
        alert('Erro ao excluir aluno');
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
      alert('Erro ao excluir aluno');
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
  
        alert('Aluno atualizado');
      } catch (error) {
        console.error('Erro ao atualizar aluno no Firestore', error);
        alert('Erro ao atualizar aluno no Firestore');
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

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);  
      router.push('/login'); 
    } catch (error) {
      alert("Erro ao fazer logout")
      console.error('Erro ao fazer logout:', error);
    }
  };

    return (
        <LayoutUser usuario={'root'} className="text-black">
                <Titulo>Alunos</Titulo>
            <div className="flex flex-row items-center w-full">
                <Select seletor={select1}
                        titulo="Turma"
                        setFiltro={setFiltro1}/>
                <Select seletor={select2}
                        titulo="Mensalidade"
                        setFiltro={setFiltro2}/>
                <Pesquisa setPesquisa={setPesquisa}/>
                <Botao onClick={handleLogout} className="m-0 ml-3 p-10 bg-slate-400" cor="slate">Sair</Botao>
                
            </div>
            <TabelaRoot objeto={filtragem1}
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={alunoSelecionado}
                    objetoExcluido={alunoExcluido}
                    abrirPagamento={abrirPagamento}
                    pagamentos={pagamentos}
                    />
            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Pagamento' : tipoModal == 'excluir' ? 'Tem certeza que deseja excluir:': "Editar Aluno"}>
            {tipoModal == 'selecionado' ? <ModalRootPagamento setRecarregar={setRecarregar} aluno={aluno} listaTurmas={listaTurmas} pagamentos={pagamentos} setPagamentos={setPagamentos}/>: tipoModal == 'excluir' ? <ModalExcluir objeto={aluno} exclusao={exclusao} />: 
            <ModalRootALunos listaTurmas={listaTurmas} aluno={aluno} novoAluno={alunoSelecionado} editar={edicao}/>}</Modal>
        </LayoutUser>
    )
}
