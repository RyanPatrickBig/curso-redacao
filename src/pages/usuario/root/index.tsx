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

export default function RootAlunos() {

    const alunos = [
        new Aluno('Joao Carlos', new Date('2023-11-31'), 'PE', 'rua teste', '111-111', 'jasha@gmail',
    'jose', 'carla', 'rgrgrg', 'cpfcpf', 15, ['idTurma2'],false , '123', "idTeste", false),
        new Aluno('teste 1', new Date('2023-11-31'), 'PE', 'rua teste', '111-111', 'jasha@gmail',
    'jose', 'carla', 'rgrgrg', 'cpfcpf', 10, ['idTurma3'],false , '123', "idTeste1", false),
        new Aluno('Maria Luiza', new Date('2023-11-31'), 'RJ', 'rua testew', '222-111', 'mari@gmail',
    'pedro', 'ana', 'rg2', 'cpf2', 10, ['idTurma1','idTurma3'],true , 'abc', "idTeste2", false),
        new Aluno('teste 2', new Date('2023-11-31'), 'RJ', 'rua testew', '222-111', 'mari@gmail',
    'pedro', 'ana', 'rg2', 'cpf2', 15, ['idTurma1'],true , 'abc', "idTeste3", false),
    ]

    const [listaTurmas, setListaTurmas] = useState([
        new Turma('Presencial terça/tarde', 'Linguagem', 'Felipe Alves', 'terça-feira', '14h', 'Presencial', 'idTurma1', false),
        new Turma('Online terça/tarde', 'Redação', 'Wellington', 'terça-feira', '14h', 'Online', 'idTurma2', false),
        new Turma('Presencial sábado/tarde', 'Redação', 'Wellington', 'sábado', '14h', 'Presencial', 'idTurma3', false)
      ])

    const [pagamentos, setPagamentos] = useState([
        new Pagamento("idTeste",'idTurma2', "Online terça", 80, new Date('2023-11-31'), new Date('2023-8-31'), "IdPagamento", false),
        new Pagamento("idTeste1",'idTurma3', "Presencial sábado", 25, new Date('2023-12-31'), new Date('2022-11-20'), "IdPagamento1", false),
        new Pagamento("idTeste2",'idTurma3', "Presencial sábado", 25, new Date('2023-12-31'), new Date('2022-11-20'), "IdPagamento2", false),
        new Pagamento("idTeste2",'idTurma1', "Presencial terça", 20, new Date('2023-12-31'), new Date('2023-09-09'), "IdPagamento3", false),
        new Pagamento("idTeste3",'idTurma1', "Presencial terça", 100, new Date('2023-12-31'), new Date('2022-09-09'), "IdPagamento3=4", false)
        //Ele quer um select da turma a pagar e que a verificação de pago ou não seja feita de acordo com a lista total de pagamentos "anotação da reuniao"
    ])
    
    const dados = ['natural','nome','cpf','pagamento']
    const cabecalho = ['Estado', 'Nome', 'CPF', 'Pagamento', 'Ações']
    //aqui o seletor vai mostrar apenas as alunos que existem no BD
    const [select1, setSelect1] = useState<string[]>([])
    const [select2, setSelect2] = useState<string[]>([])

    const [aluno, setAluno] = useState<Aluno>(Aluno.vazio())
    const [openModal, setOpenModal] = useState(false)
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState(alunos)
    const [filtragem, setFiltragem] = useState(listagem)
    const [filtro1, setFiltro1] = useState('Todos(as)')
    const [filtro2, setFiltro2] = useState('Todos(as)')
    const [recarregar, setRecarregar] = useState(false)
    const [pesquisa, setPesquisa] = useState('')
    
    const aoClicar = () => {
        let filtragemResultante = listagem;  
        if (pesquisa !== ''){
            filtragemResultante = filtragemResultante.filter((aluno) =>
                aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
            );
        }

        if (filtro1 !== "Todos(as)") {
            filtragemResultante = filtragemResultante.filter((aluno) =>
                aluno.turma.some((turmaId) =>
                    listaTurmas.find((turma) => turma.id === turmaId && turma.nome === filtro1)
                )
            );
        }
        if (filtro2 !== "Todos(as)") {
            const numero = parseInt(filtro2.split(" ").pop() || "0");
            filtragemResultante = filtragemResultante.filter(aluno => aluno.mensalidade === numero);
            } 
        setFiltragem(filtragemResultante);
        setRecarregar(false)
        setOpenModal(false);
    }

    function verificarPrazos() {
        const dataAtual = new Date();
      
        alunos.forEach((aluno) => {
          const turmasAluno = aluno.turma.length; // Número de turmas do aluno
      
          const pagamentosAluno = pagamentos.filter(
            (pagamento) => pagamento.idAluno === aluno.id
          );
      
          const turmasPagas = pagamentosAluno.map((pagamento) => pagamento.idTurma);

          const todasTurmasPagas = aluno.turma.every((turma) =>
            turmasPagas.includes(turma)
          );
      
          const prazosOrdenados = pagamentosAluno
            .filter((pagamento) => turmasPagas.includes(pagamento.idTurma)) // Filtrando apenas os pagamentos das turmas do aluno
            .sort((a, b) => a.prazo.getTime() - b.prazo.getTime()) // Ordenando os pagamentos pela data de prazo (do mais antigo ao mais recente)
      
          const prazosMaisFuturos = prazosOrdenados.slice(-turmasAluno); // Selecionando os X prazos mais futuros, onde X é o número de turmas
      
          const prazoAtualizado =
            turmasAluno > 0 && todasTurmasPagas &&
            prazosMaisFuturos.every((pagamento) => pagamento.prazo >= dataAtual);
      
          // Atualizando o status de pagamento do aluno
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
    function exclusao(id: any){
        const materiaisFiltrados = listagem.filter((aluno) => aluno.id !== id);
        setListagem(materiaisFiltrados);
        setOpenModal(false);
        setRecarregar(true);
    }
    function edicao(alunoEditado: Aluno){
        const indexToEdit = listagem.findIndex((funcionario) => funcionario.id === alunoEditado.id);
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
        if (recarregar || filtro1 || filtro2 || pesquisa) {
            aoClicar();
            verificarPrazos();
        }
    }, [recarregar, filtro1, filtro2, pesquisa]);

    useEffect(() => {
        verificarPrazos();
        setListaTurmas([...listaTurmas]
          //Pode apagar o [] 
          //Obter lista de alunos do banco( )
        )
          setSelect1(['Todos(as)', ...listaTurmas.map((turma: { nome: any }) => turma.nome)])
          const mensalidadeUnicas = [...new Set(alunos.map((aluno: {mensalidade: any})=> aluno.mensalidade))];
          setSelect2(['Todos(as)', ...mensalidadeUnicas.map(mensalidade => `pagamentos dia  ${mensalidade}`)])
    }, []);

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
            <TabelaRoot objeto={filtragem}
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
