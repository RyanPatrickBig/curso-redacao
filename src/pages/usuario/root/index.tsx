import LayoutUser from "@/components/LayoutUser";
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
import { getDocs, query, collection, addDoc, where, updateDoc, doc, getDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/backend/config';

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
          filtragemResultante = [];
        }
      }
    
      if (pesquisa !== '') {
        filtragemResultante = filtragemResultante.filter((aluno) =>
          aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
        );
    
        if (filtro2 !== "Todos(as)") {
          if (filtro2 === "dia 10" || filtro2 === "dia 15") {
            filtragemResultante = filtragemResultante.filter((aluno) => aluno.mensalidade === parseInt(filtro2) || aluno.mensalidade === parseFloat(filtro2));
          } else {
            console.error("Invalid value for mensalidade");
            filtragemResultante = [];
          }
        }
      }
    
      setFiltragem1(filtragemResultante);
      setFiltragem2(filtragemResultante);
      setRecarregar(false);
      setOpenModal(false);
    };
    
      
    
      useEffect(() => {
        aoClicar();
      }, [filtro1,filtro2, listaTurmas, pesquisa]);
      
      
      useEffect(() => {
        const carregarTurmas = async () => {
          try {
            const turmasRef = collection(db, "Turmas");
            const turmasQuery = query(turmasRef);
            const snapshot = await getDocs(turmasQuery);
            const turmas = snapshot.docs.map((doc) => doc.data() as Turma);
            setListaTurmas(turmas);
    
            const seletorAtualizado = ['Todos(as)', ...turmas.map((turma) => turma.nome)];
            setSelect1(seletorAtualizado);
          } catch (error) {
            console.error("Erro ao carregar turmas:", error);
          }
        };
    
        carregarTurmas();
      }, []); 


    function verificarPrazos() {
        const dataAtual = new Date();
      
        alunos.forEach((aluno) => {
          const turmasAluno = aluno.turma.length; 
      
          const pagamentosAluno = pagamentos.filter(
            (pagamento) => pagamento.idAluno === aluno.id
          );
      
          const turmasPagas = pagamentosAluno.map((pagamento) => pagamento.idTurma);

          const todasTurmasPagas = aluno.turma.every((turma) =>
            turmasPagas.includes(turma)
          );
      
          const prazosOrdenados = pagamentosAluno
            .filter((pagamento) => turmasPagas.includes(pagamento.idTurma)) 
            .sort((a, b) => a.prazo.getTime() - b.prazo.getTime()) 
      
          const prazosMaisFuturos = prazosOrdenados.slice(-turmasAluno); 
      
          const prazoAtualizado =
            turmasAluno > 0 && todasTurmasPagas &&
            prazosMaisFuturos.every((pagamento) => pagamento.prazo >= dataAtual);
      
          const indexAluno = listagem.findIndex((item) => item.id === aluno.id);
          if (indexAluno !== -1) {
            const listaAtualizada = [...listagem];
            listaAtualizada[indexAluno].pagamento = prazoAtualizado;
            setListagem(listaAtualizada);
          }
        });
      }
      
      
      
    
    function alunoSelecionado(aluno: Aluno){
        setAluno(aluno)
        setTipoModal("editar")
        setOpenModal(true)
    }
    function alunoExcluido(aluno: Aluno){
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
        console.log('Aluno excluído com sucesso do Firestore');
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

      

    return (
        <LayoutUser usuario={'root'} className="text-black">
            <div className="flex place-content-between">
                <Titulo>Alunos</Titulo>
            </div>
            <div className="flex flex-row items-center w-full">
                <Select seletor={select1}
                        titulo="Turma"
                        setFiltro={setFiltro1}/>
                <Select seletor={select2}
                        titulo="Mensalidade"
                        setFiltro={setFiltro2}/>
                <Pesquisa setPesquisa={setPesquisa}/>
            </div>
            <TabelaRoot objeto={filtragem1}
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={alunoSelecionado}
                    objetoExcluido={alunoExcluido}
                    abrirPagamento={abrirPagamento}
                    pagamentos={pagamentos}
                    />
            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Pagamento' : tipoModal == 'excluir' ? 'Tem certeza que deseja excluir:': "Editar Aluno"}
            subtitulo={tipoModal == 'excluir' || 'selecionado' ? aluno.nome+' - Mensalidade: dia '+aluno.mensalidade : ''}>
            {tipoModal == 'selecionado' ? <ModalRootPagamento setRecarregar={setRecarregar} aluno={aluno} listaTurmas={listaTurmas} pagamentos={pagamentos} setPagamentos={setPagamentos}/>: tipoModal == 'excluir' ? <ModalExcluir objeto={aluno} exclusao={exclusao} />: 
            <ModalRootALunos listaTurmas={listaTurmas} aluno={aluno} novoAluno={alunoSelecionado} editar={edicao}/>}</Modal>
        </LayoutUser>
    )
}
