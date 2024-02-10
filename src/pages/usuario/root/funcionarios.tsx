import LayoutUser from "@/components/LayoutUser";
import TabelaRoot from "@/components/TabelaRoot";
import Titulo from "@/components/Titulo";
import { useState, useEffect } from "react";
import Funcionario from "@/core/Funcionario";
import Modal from "@/components/Modal";
import ModalRootFuncionario from '@/components/modals/ModalRootFuncionario'
import ModalExcluir from "@/components/modals/ModalExcluir";
import { getDocs, collection, addDoc, updateDoc, doc, getDoc, deleteDoc, query } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; 
import { db } from '@/backend/config';

export default function RootFuncionarios() {

    const dados = ['nome','cpf', 'email']
    const cabecalho = ['Nome', 'CPF', 'Email', "Ações"]
    const [openModal, setOpenModal] = useState(false)
    const [funcionario, setFuncionario] = useState<Funcionario>(Funcionario.vazio())
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState<Funcionario[]>([]);
    const [recarregar, setRecarregar] = useState(true)
    const auth = getAuth();

    useEffect(() => {
        if(recarregar){
            async function fetchFuncionarios() {
                const funcionariosCollection = collection(db, 'Funcionario');
                const funcionarioQuery = query(funcionariosCollection);
                const funcionariosSnapshot = await getDocs(funcionarioQuery);
                const funcionariosData = funcionariosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Funcionario[];
                setListagem(funcionariosData);
            }
    
            fetchFuncionarios();
            setRecarregar(false)
        }
    }, [recarregar]);

    
    function funcionarioExcluido(funcionario: Funcionario) {  
        setFuncionario(funcionario);
        setTipoModal('excluir');
        setOpenModal(true);
    }   

    function salvarFuncionario(funcionario: Funcionario){
        setFuncionario(funcionario)
        setTipoModal('selecionado')
        setOpenModal(true)
    }
    function editarFuncionario(funcionario: Funcionario) {
        setFuncionario(funcionario);
        setTipoModal('editar'); 
        setOpenModal(true);
    } 
    
    const excluirFuncionarioFirestore = async (funcionarioId: string) => {
        try {
          const funcionarioRef = doc(db, 'Funcionario', funcionarioId);
          await deleteDoc(funcionarioRef);
          alert('Funcionário excluído com sucesso');
          setRecarregar(true)
        } catch (error) {
          console.error('Erro ao excluir funcionário do Firestore:', error);
          alert('Erro ao excluir funcionário');
        }
      };
      
      const exclusaoFuncionario = async (id: any) => {
        try {
          await excluirFuncionarioFirestore(id);
      
          const funcionariosFiltrados = listagem.filter((funcionario) => funcionario.id !== id);
          setListagem(funcionariosFiltrados);
      
          setOpenModal(false);
          setRecarregar(true);
        } catch (error) {
          console.error('Erro ao excluir funcionário:', error);
          alert('Erro ao excluir funcionário');
        }
      };

      async function adicao(funcionarioNovo: Funcionario) {
        if (verificaObjetoInvalido(funcionarioNovo)) {
            try {
                const funcionarioData = {
                    nome: funcionarioNovo.nome,
                    cpf: funcionarioNovo.cpf,
                    rg: funcionarioNovo.rg,
                    celular: funcionarioNovo.celular,
                    email: funcionarioNovo.email,
                    senha: funcionarioNovo.senha,
                };
    
                const userCredential = await createUserWithEmailAndPassword(auth, funcionarioNovo.email, funcionarioNovo.senha);
                const user = userCredential.user;

                const docRef = await addDoc(collection(db, "Funcionario"), funcionarioData);
                console.log("Funcionário adicionado com ID:", docRef.id);
                alert("Funcionário adicionado!");
    
                const funcionarioSnapshot = await getDoc(doc(db, 'Funcionario', docRef.id));
                const novoFuncionario = funcionarioSnapshot.data() as Funcionario;
    
                setListagem([...listagem, novoFuncionario]);
                setOpenModal(false);
            setRecarregar(true)
            } catch (error) {
                console.error("Erro ao adicionar o funcionário ao Firestore", error);
                alert("Erro ao adicionar o funcionário");
            }
        } else {
            alert("Objeto Inválido");
        }
    }
      
    function edicao(funcionarioEditado: Funcionario) {
        const funcionarioId = funcionarioEditado.id;

	        if (!funcionarioId) {
                console.error("ID do funcionário não definido.");
                setOpenModal(false);
                return;
            } 
      
        const atualizarFuncionarioFirestore = async () => {
          try {
            const funcionarioDocRef = doc(db, 'Funcionario', funcionarioId);
             await updateDoc(funcionarioDocRef, {
                nome: funcionarioEditado.nome,
                cpf: funcionarioEditado.cpf,
                rg: funcionarioEditado.rg,
                celular: funcionarioEditado.celular,
                email: funcionarioEditado.email,
                senha: funcionarioEditado.senha,
            });
    
      
            alert('Funcionario atualizado');
          } catch (error) {
            console.error('Erro ao atualizar funcionario no Firestore', error);
            alert('Erro ao atualizar funcionario no Firestore');
          }
        };
      
        atualizarFuncionarioFirestore();

         const indexToEdit = listagem.findIndex((funcionario) => funcionario.id === funcionarioEditado.id);
            if (indexToEdit !== -1) {
                const listaAtualizada = [...listagem];
                listaAtualizada[indexToEdit] = funcionarioEditado;
                setListagem(listaAtualizada);
                setOpenModal(false);
            }
        else {
          setOpenModal(false);
        }
        setRecarregar(true);
      }
    
    function verificaObjetoInvalido(funcionarioNovo: Funcionario) {
        if (
            !funcionarioNovo.nome ||
            !funcionarioNovo.cpf ||
            !funcionarioNovo.rg ||
            !funcionarioNovo.celular ||
            !funcionarioNovo.email ||
            !funcionarioNovo.senha
        ) {
            return false;
        }
        return true;
    }

    return (
        <LayoutUser usuario={'root'} className="text-black">
            <div className="flex place-content-between mb-10">
                <Titulo>Funcionários</Titulo>
            </div>

            <div className="overflow-auto max-h-[86%]">
                <TabelaRoot
                    objeto={listagem}
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={editarFuncionario}
                    objetoExcluido={funcionarioExcluido}
                    salvarFuncionario={salvarFuncionario}
                    funcionario
                />
            </div>

            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Criar novo funcionário': tipoModal=='editar' ? 'Editar Funcionario' : 'Tem certeza que deseja excluir:'}
            subtitulo={tipoModal == 'excluir' && funcionario ? funcionario.nome : ''}
            > {tipoModal == 'selecionado' || tipoModal=='editar' ? 
            <ModalRootFuncionario funcionario={funcionario} setOpenModal={setOpenModal} editar={(funcionario) => edicao(funcionario)} adicao={adicao}/>:<ModalExcluir objeto={funcionario} exclusao={exclusaoFuncionario} />
        } </Modal>

        </LayoutUser>
    )
}