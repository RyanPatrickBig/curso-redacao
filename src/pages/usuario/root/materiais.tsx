import LayoutUser from "@/components/LayoutUser";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Tabela from "@/components/Tabela";
import Titulo from "@/components/Titulo";
import ModalExcluir from "@/components/modals/ModalExcluir";
import ModalRootMateriais from "@/components/modals/ModalRootMateriais";
import Material from "@/core/Material";
import { useEffect, useState } from "react";

export default function Aluno() {

    const Materiais = [
        new Material('Material da aula sobre Redação 1', 'Descrição breve desse documento', 'ARQUIVO', 'LINK', 'Redação', 'presencial terça/tarde', 'Abner', new Date(0),'idA' , false),
        new Material('Material da aula sobre Redação 2', 'Descrição breve desse documento', 'ARQUIVO2', 'LINK2', 'Redação', 'presencial terça/manhã', 'João', new Date(0),'idB' , false),
        new Material('Material TESTE', 'Descrição breve desse documento', 'ARQUIVO', 'LINK', 'Linguagem', 'presencial terça/tarde', 'Abner', new Date(0),'idC' , false),
        new Material('Material TESTE 2', 'Descrição breve desse documento', 'ARQUIVO2', 'LINK2', 'Linguagem', 'presencial terça/manhã', 'João', new Date(0),'idD' , false)
    ]
    const dados = ['nome', 'data', 'professor']
    const cabecalho = ['Título', 'Data de publicação', 'Quem publicou', `Ver feedback & Excluir`]
    const select = ['Todos(as)','Redação','Linguagem','Matemática']

    const [material, setMaterial] = useState<Material>(Material.vazio())
    const [openModal, setOpenModal] = useState(false)
    const [tipoModal, setTipoModal] = useState('')
    const [listagem, setListagem] = useState(Materiais)
    const [filtragem, setFiltragem] = useState(listagem)
    const [filtro, setFiltro] = useState('Todos(as)')

    const aoClicar = () => {
        if(filtro == "Todos(as)"){
            setFiltragem(listagem);
        } else {
            const materiaisFiltrados = listagem.filter((material) => material.disciplina === filtro);
            setFiltragem(materiaisFiltrados);
        }
      }
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
    function exclusao(id: any){
        const materiaisFiltrados = listagem.filter((material) => material.id !== id);
        setListagem(materiaisFiltrados);
        setOpenModal(false);
        console.log(materiaisFiltrados);
    }

    useEffect(() => {
        aoClicar();
    }, [filtro, exclusao])

    return (
        <LayoutUser usuario={'root'} className="text-black">
            <div className="flex place-content-between">
                <Titulo>Materiais</Titulo>
            </div>
            <Select seletor={select}
                    titulo="Disciplina"
                    setFiltro={setFiltro}/>
            <Tabela objeto={filtragem} 
                    propriedadesExibidas={dados}
                    cabecalho={cabecalho}
                    objetoSelecionado={materialSelecionado}
                    objetoExcluido={materialExcluido}></Tabela>   
            <Modal isOpen={openModal} isNotOpen={() => setOpenModal(!openModal)} cor='white' titulo={tipoModal == 'selecionado' ? 'Análise de Feedback': 'Tem certeza que deseja excluir:'}
            subtitulo={material.nome}>{tipoModal == 'selecionado' ? <ModalRootMateriais/>:<ModalExcluir objeto={material} exclusao={exclusao}/>}</Modal>         
        </LayoutUser>
    )
}