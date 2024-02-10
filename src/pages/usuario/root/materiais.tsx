import LayoutUser from "@/components/LayoutUser";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Tabela from "@/components/Tabela";
import Titulo from "@/components/Titulo";
import ModalExcluir from "@/components/modals/ModalExcluir";
import ModalRootMateriais from "@/components/modals/ModalRootMateriais";
import Material from "@/core/Material";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import { db } from '@/backend/config';

export default function RootMateriais() {

    const [comentarios, setComentarios] = useState([]);
    const [alunos, setAlunos] = useState([])
    const dados = ['nome', 'professor', 'turma']
    const cabecalho = ['Título', 'Quem publicou', 'Turma', `Ver feedback & Excluir`]
    const [select, setSelect] = useState<{ value: string; label: string }[]>([]);
    const [material, setMaterial] = useState<Material>(Material.vazio())
    const [openModal, setOpenModal] = useState(false)
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState<Material[]>([]);
    const [filtragem, setFiltragem] = useState<Material[]>([]);
    const [filtro, setFiltro] = useState('Todos(as)')
    const [disciplinas, setDisciplinas] = useState<{ value: string; label: string }[]>([]);

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
                console.log(materials)
            } catch (error) {
                console.error('Erro ao buscar materiais:', error);
            }
        };

        const fetchDisciplinas = async () => {
            try {
                const disciplinasCollection = collection(db, "Disciplina");
                const disciplinaQuery = query(disciplinasCollection);
                const querySnapshot = await getDocs(disciplinaQuery);
                const disciplinasData = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        value: doc.id,
                        label: data && data.nome,
                    };
                });
                setDisciplinas(disciplinasData);

                const seletorDisciplinas = ['Todos(as)', ...disciplinasData.map((disciplina) => disciplina.label)];
                setSelect(seletorDisciplinas);
            } catch (error) {
                console.error('Erro ao buscar disciplinas:', error);
            }
        };

        fetchMaterials();
        fetchDisciplinas();
    }, []);


    const aoClicar = () => {
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

    function materialSelecionado(material: Material){
        setMaterial(material);
        setTipoModal('selecionado')
        setOpenModal(true);
    }
    function materialExcluido(material: Material){
        setMaterial(material);
        setTipoModal('excluir')
        setOpenModal(true)
    }

    const excluirMaterialFirestore = async (materialId: string) => {
        try {
          if (typeof materialId !== 'string' || materialId.trim() === '') {
            console.error('ID do material inválido');
            return;
          }
      
          const materialRef = doc(db, 'Material', materialId);
          await deleteDoc(materialRef);
          alert('Material excluído com sucesso do Firestore');
        } catch (error) {
          console.error('Erro ao excluir material do Firestore:', error);
          alert('Erro ao excluir material do Firestore');
        }
      };
      

      const exclusao = async (id: any) => {
        try {
          await excluirMaterialFirestore(id);
    
          const materiaisFiltrados = listagem.filter((material) => material.id !== id);
          setListagem(materiaisFiltrados);
    
          setOpenModal(false);
        } catch (error) {
          console.error('Erro ao excluir material:', error);
          alert('Erro ao excluir material');
        }
      };

    return (
        <LayoutUser usuario={'root'} className="text-black text-sm md:text-md">
            <div className="flex place-content-between">
                <Titulo>Materiais</Titulo>
            </div>
            <Select
            seletor={select}
            titulo="Disciplina"
            setFiltro={setFiltro}
            />

            <div className="overflow-auto max-h-[73%]">
                <Tabela objeto={filtragem} 
                        propriedadesExibidas={dados}
                        cabecalho={cabecalho}
                        objetoSelecionado={materialSelecionado}
                        objetoExcluido={materialExcluido}>
                </Tabela>   
            </div>
                
            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Análise de Feedback': 'Tem certeza que deseja excluir:'}
            subtitulo={material.nome}>{tipoModal == 'selecionado' ? <ModalRootMateriais comentarios={comentarios} material={material} alunos={alunos} />:<ModalExcluir objeto={material} exclusao={exclusao}/>}</Modal>         
        </LayoutUser>
    )
}