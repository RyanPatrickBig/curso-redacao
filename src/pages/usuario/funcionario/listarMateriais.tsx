import LayoutUser from "@/components/LayoutUser";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Tabela from "@/components/Tabela";
import Titulo from "@/components/Titulo";
import ModalExcluir from "@/components/modals/ModalExcluir";
import ModalRootMateriais from "@/components/modals/ModalRootMateriais";
import Material from "@/core/Material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import { db } from '@/backend/config';

export default function ListarMateriais() {
    const [comentarios, setComentarios] = useState([]);
    const dados = ['nome', 'descricao', 'turma'];
    const cabecalho = ['Nome', 'Descrição', 'Turma' ,'Opções'];
    const [select, setSelect] = useState<{ value: string; label: string }[]>([]);
    const [alunos, setAlunos] = useState([]);
    const [material, setMaterial] = useState<Material>(Material.vazio());
    const [openModal, setOpenModal] = useState(false);
    const [tipoModal, setTipoModal] = useState('');
    const [listagem, setListagem] = useState<Material[]>([]);
    const [filtragem, setFiltragem] = useState<Material[]>([]);
    const [filtro, setFiltro] = useState('Todos(as)');
    const [disciplinas, setDisciplinas] = useState<{ id: string; nome: string }[]>([]);
    
    useEffect(() => {
        const fetchDisciplinas = async () => {
            try {
                const disciplinasCollection = collection(db, "Disciplina");
                const querySnapshot = await getDocs(disciplinasCollection);
                const disciplinasData = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nome: data && data.nome,
                    };
                });
                setDisciplinas(disciplinasData);

                const seletorDisciplinas = ['Todos(as)', ...disciplinasData.map((disciplina) => disciplina.nome)];
                setSelect(seletorDisciplinas);
            } catch (error) {
                console.error('Erro ao buscar disciplinas:', error);
            }
        };

        fetchDisciplinas();
    }, []);

    const aoClicar = async () => {
        if (filtro === 'Todos(as)') {
            setFiltragem(listagem);
        } else {
            const materiaisFiltrados = listagem.filter((material) => material.disciplina === filtro);
            setFiltragem(materiaisFiltrados);
        }
    };

    useEffect(() => {
        if(filtro || listagem){
            aoClicar();
        }
    }, [filtro, listagem]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialsCollection = collection(db, "Material"); 
                const querySnapshot = await getDocs(materialsCollection);
                const materials = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        ...data,
                        id: doc.id, 
                    } as Material;
                });
                setListagem(materials);
            } catch (error) {
                console.error('Erro ao buscar materiais:', error);
            }
        };
    
        fetchMaterials();
    }, []);

    function materialSelecionado(material: Material) {
        setMaterial(material);
        setTipoModal('selecionado');
        setOpenModal(true);
    }

    function materialExcluido(material: Material) {
        setMaterial(material);
        setTipoModal('excluir');
        setOpenModal(true);
    }


    async function exclusao(id: any) {
        try {
            console.log("Iniciando exclusao");
            const materialRef = doc(db, 'Material', id.toString());
            await deleteDoc(materialRef);
    
            const materiaisFiltrados = listagem.filter((material) => material.id !== id);
            setListagem(materiaisFiltrados);
    
            const materiaisFiltradosAtualizados = filtragem.filter((material) => material.id !== id);
            setFiltragem(materiaisFiltradosAtualizados);
    
            setOpenModal(false);
            alert("Exclusão concluída com sucesso");

            aoClicar();
        } catch (error) {
            console.error('Erro ao excluir material:', error);
            alert("Erro ao excluir material.")
        }
    }
      

    return (
        <LayoutUser usuario={'funcionario'} className="text-black">
            <div className="flex place-content-between">
                <Titulo>Listar Materiais</Titulo>
                <Link href="/usuario/funcionario/materiais" className="hidden md:block px-10 mx-8 py-2 rounded-md text-white bg-pink-400">
                    Postar Material
                </Link>
            </div>
            <Select seletor={select} titulo="Disciplina" setFiltro={setFiltro}/>
            
            <div className="overflow-auto max-h-[72%]">
                <Tabela
                    objeto={filtragem}
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={materialSelecionado}
                    objetoExcluido={materialExcluido}
                />
            </div>

            <Modal
                isOpen={openModal}
                isNotOpen={() => setOpenModal(!openModal)}
                cor="white"
                titulo={tipoModal === 'selecionado' ? 'Análise de Feedback' : 'Tem certeza que deseja excluir:'}
                subtitulo={material.nome}
            >
                {tipoModal === 'selecionado' ? (
                    <ModalRootMateriais comentarios={comentarios} material={material} alunos={alunos} />
                ) : (
                    <ModalExcluir objeto={material} exclusao={exclusao} />
                )}
            </Modal>
        </LayoutUser>
    );
}


