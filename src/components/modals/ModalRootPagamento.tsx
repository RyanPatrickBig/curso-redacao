import {Botao} from "../Botao";
import DatePicker from "../DatePicker";
import EntradaPerfil from "../EntradaPerfil";
import { useEffect, useState } from "react";
import Pagamento from "@/core/Pagamento";
import Aluno from "@/core/Aluno";
import Turma from "@/core/Turma";
import Select from "../Select";
import { addDoc, collection } from 'firebase/firestore';
import { getFirestore} from 'firebase/firestore';

interface ModalRootPagamentoProps {
    aluno: Aluno
    listaTurmas: Turma[]
    pagamentos: Pagamento[]
    setPagamentos: (pagamentos: Pagamento[]) => void
    setRecarregar: (recarregar: boolean) => void
}

export default function ModalRootPagamento(props: ModalRootPagamentoProps){

    const [valor, setValor] = useState(0)
    const [descricao, setDescricao] = useState('')
    const [dataPago, setDataPago] = useState(new Date(0))
    const [prazo, setPrazo] = useState(new Date(0))
    const [id, setId] = useState<string>()
    const [pagamento, setPagamento] = useState(Pagamento.vazio())
    const [idTurma, setIdTurma] = useState<string>('')
    const [datasPagamentosTurma, setDatasPagamentosTurma] = useState<string[]>([]);
    const [excluir, setExcluir] = useState(false)
    const [pago, setPago] = useState(false);
    const [openModal, setOpenModal] = useState(false)

    const turmasDoAluno: string[] = props.listaTurmas
    .filter(turma => turma.id && props.aluno.turma.includes(turma.id))
    .map(turma => turma.nome);

    const [filtro1, setFiltro1] = useState<string>(turmasDoAluno[0])
    const [filtro2, setFiltro2] = useState<string>('')

    const aoClicar = () => {
        const turmaSelecionada = props.listaTurmas.find(turma => turma.nome === filtro1);

        if (turmaSelecionada && turmaSelecionada.id) {
            setIdTurma(turmaSelecionada?.id)
            
            const pagamentosAlunoTurmaSelecionada = props.pagamentos.filter(pagamento =>
                pagamento.idTurma === turmaSelecionada.id && pagamento.idAluno === props.aluno.id
            );
            // Filtrar as datas dos pagamentos e formatá-las como strings
            const datasFormatadas = pagamentosAlunoTurmaSelecionada.map(pagamento => {
                return new Date(pagamento.prazo).toLocaleDateString(); // Ajuste o formato conforme necessário
            });
            setFiltro2(datasFormatadas[0])

            // Armazenar as datas formatadas no estado correspondente
            setDatasPagamentosTurma(datasFormatadas);
            aplicarFiltro2(turmaSelecionada);
        }

    };

    function aplicarFiltro2(turmaSelecionada: Turma){
        const pagamentoEncontrado = props.pagamentos.find(pagamento => pagamento.idTurma === turmaSelecionada?.id && pagamento.idAluno === props.aluno.id && pagamento.prazo.toLocaleDateString() == filtro2
        );
            if (pagamentoEncontrado) {
                setPagamento(pagamentoEncontrado);
            } else {
                setPagamento(Pagamento.vazio());
            }

            setValor(pagamentoEncontrado?.valor || 0);
            setDescricao(pagamentoEncontrado?.descricao || '');
            setDataPago(pagamentoEncontrado?.dataPago || new Date(0));
            setPrazo(pagamentoEncontrado?.prazo || new Date(0))
            setId(pagamentoEncontrado?.id || "");
    }
    
    async function adicao(pagamentoNovo: Pagamento){
        const db = getFirestore();
        const pagamentosCollection = collection(db, 'Pagamento');
        if (!valor || dataPago === new Date(1969, 12, 31) || prazo === new Date(1969, 12, 31)) {
            alert("Preencha todos os campos obrigatórios.");
            return;
          }
          
        if (filtro2 == 'Novo pag.' || filtro2 ==''){
            if ( props.pagamentos.some(
                pagamento => pagamento.idTurma === idTurma && pagamento.idAluno === props.aluno.id && pagamento.prazo === prazo
            ) ) {
                alert("Escolha outro prazo para esse pagamento.");
                return;
            }
        }

        const index = props.pagamentos.findIndex(pagamento => pagamento.id === pagamentoNovo.id);

        if (index === -1) {
          props.setPagamentos([...props.pagamentos, pagamentoNovo]);
        } else {
          const novosPagamentos = [...props.pagamentos];
          novosPagamentos[index] = pagamentoNovo;
          props.setPagamentos(novosPagamentos);
        }

        try {
            const docRef = await addDoc(pagamentosCollection, {
              idAluno: pagamentoNovo.idAluno,
              idTurma: pagamentoNovo.idTurma,
              descricao: pagamentoNovo.descricao,
              valor: pagamentoNovo.valor,
              prazo: pagamentoNovo.prazo,
              dataPago: pagamentoNovo.dataPago,
            });
        
            console.log('Pagamento adicionado com ID: ', docRef.id);
            setOpenModal(false);
          } catch (e) {
            console.error('Erro ao adicionar pagamento: ', e);
            alert('Erro ao salvar o pagamento. Tente novamente mais tarde.');
            return;
          }

        props.setRecarregar(true);
    }

    function exclusao() {
        if (id) {
            console.log("ID do aluno antes da exclusão:", id);
    
            const pagamentosFiltrados = props.pagamentos.filter((pagamento) => pagamento.id !== id);
            if (pagamentosFiltrados.length > 0) {
                props.setPagamentos(pagamentosFiltrados);
            } else {
                alert("Pagamento não encontrado");
            }
    
            setExcluir(false);
            props.setRecarregar(true);
        } else {
            console.error("ID do aluno indefinido.");
        }
    }
    
    useEffect(() => {
        aoClicar();
    }, [filtro1]);
    useEffect(() => {
        aoClicar();
    }, []);
    useEffect(() => {
        const turmaSelecionada = props.listaTurmas.find(turma => turma.nome === filtro1);
        if(turmaSelecionada){
            aplicarFiltro2(turmaSelecionada);
        }
    }, [filtro2]);


    return(
        <div className="text-black">
            {excluir === false ?
                <div>
                    <div className="flex">
                        <Select seletor={turmasDoAluno} setFiltro={setFiltro1} titulo="Turma"/>
                        <Select seletor={[...datasPagamentosTurma, 'Novo pag.']} setFiltro={setFiltro2} titulo="Histórico"/>
                    </div>

                        <section className="bg-blue-200 rounded-lg p-3 mb-3">      
                            <div className="flex items-center gap-3">
                                <DatePicker titulo="Data do pagamento" classname="text-white pl-2" classname2="text-black bg-white outline-none" valor={dataPago} setData={setDataPago}/>
                                <DatePicker titulo="Prazo" classname="text-white" classname2="text-black bg-white outline-none" valor={prazo} setData={setPrazo}/>
                                <EntradaPerfil texto="Valor" className="text-white w-32" className2="bg-white rounded-xl text-black" tipo='number' placeholder="Valor do pagamento" valor={valor} valorMudou={setValor} min={0}/>
                            </div>     

                            <div className="bg-white rounded-lg">
                                <EntradaPerfil className="rounded-md p-3 w-full outline-none" className2={"bg-white focus:bg-white"} placeholder="Descrição do pagamento" valor={descricao} valorMudou={setDescricao}/>
                            </div>
                        </section>

                        <section className="flex place-content-end gap-2">
                            <Botao onClick={()=>{setExcluir(true)}} className="bg-red-600 text-white py-2 px-4 rounded-md font-bold">Deletar</Botao>

                            <Botao className="p-10 bg-blue-500" cor={"blue"}
                                    onClick={() => adicao(new Pagamento(props.aluno.id, idTurma, descricao, valor, prazo, dataPago, id, false))}>
                                {prazo.getTime() !== 0 ? 'Alterar':'Confirmar'}
                            </Botao>
                        </section>

                    </div> :
                <div className="flex flex-col items-center content-center p-4 px-5 gap-3">
                    <h3>Deseja excluir o pagamento de {pagamento.prazo.toLocaleDateString()}?</h3>
                    <button onClick={exclusao} className="p-3 bg-red-600 text-white font-bold rounded-lg">Sim, Excluir</button>
                </div>
            }
        </div>
    )
}