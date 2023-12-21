import {Botao} from "@/components/Botao";
import Checkbox from "@/components/Checkbox";
import DatePicker from "@/components/DatePicker";
import EntradaPerfil from "@/components/EntradaPerfil";
import FileInput from "@/components/FileInput";
import LayoutUser from "@/components/LayoutUser";
import Titulo from "@/components/Titulo";
import Material from "@/core/Material";
import Turma from "@/core/Turma";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getUserIntoLocalStorage } from "@/utils/authLocalStorage";
import {db, storage} from "@/backend/config"

export default function Materiais() {

    const [materiais, setMateriais] = useState<Material[]>([]);
    const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [link, setLink] = useState('');
    const [professor, setProfessor] = useState('');
    const [data, setData] = useState(new Date(0));
    const [turmas, setTurmas] = useState<string[]>([]);
    const turmasUnicas = listaTurmas.map((turma) => turma.nome);
    const user = getUserIntoLocalStorage();

    useEffect(() => {
      const fetchTurmas = async () => {
        try {
          const turmasSnapshot = await getDocs(collection(db, "Turmas"));
          const turmasData = turmasSnapshot.docs.map((doc) => doc.data() as Turma);
          setListaTurmas(turmasData);
        } catch (error) {
          console.error("Erro ao buscar turmas no Firestore:", error);
        }
      };
  
      fetchTurmas();
    }, []);

    async function enviarArquivo() {
      if(!user){
      if (!arquivo) return null;
    
      const storage = getStorage();
      const storageRef = ref(storage, 'material/');
    
      try {
        const snapshot = await uploadBytes(storageRef, arquivo);
        const url = await getDownloadURL(snapshot.ref);
    
        return {
          url: url,
          caminho: storageRef.fullPath,
        };
      } catch (error) {
        console.error("Erro ao enviar arquivo para o Firebase Storage:", error);
        return null;
      }
      console.error("User not authenticated");
      return;
    }
  }
    

    async function adicao() {
    console.log("Valores:", nome, turmas, arquivo);
    
    if (!nome || turmas.length === 0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const infoArquivo = await enviarArquivo();

    if (!infoArquivo) {
      alert("Erro ao enviar o arquivo. Tente novamente.");
      return;
    }
    
    const novosMateriais = turmas.map((turmaSelecionada) => {
      const disciplinaTurma = listaTurmas.find(
        (turma) => turma.nome === turmaSelecionada
      );
      if (disciplinaTurma) {
        return new Material(
          nome,
          descricao,
          infoArquivo.url,
          link,
          disciplinaTurma.disciplina,
          turmaSelecionada,
          professor,
          data,
          "id" + Math.random(),
          false
        );
      }
      return null;
    });

    const materiaisValidos = novosMateriais.filter(
      (material) => material !== null
    ) as Material[];

    const novaLista = [...materiais, ...materiaisValidos];

    novaLista.forEach(async (material) => {
      const docRef = await addDoc(collection(db, "Material"), {
        nome: material.nome,
        descricao: material.descricao,
        arquivo: material.arquivo,
        link: material.link,
        disciplina: material.disciplina,
        turma: material.turma,
        professor: material.professor,
        data: material.data,
        id: material.id,
      });

      const turmaDoc = await getDocs(collection(db, "Turmas"));
      turmaDoc.forEach(async (doc) => {
        if (material.turma === doc.data().nome) {
          await addDoc(collection(db, "Turmas", doc.id, "Material"), {
            materialId: docRef.id,
          });
        }
      });
    });
  
      setMateriais(novaLista);
      alert("Materiais criados com sucesso!");
  
      setNome("");
      setDescricao("");
      setLink("");
      setProfessor("");
      setArquivo(null);
      setData(new Date(0));
    }
    
    return (
        <LayoutUser usuario={'funcionario'} className="text-black">

            <div className="flex place-content-between">
                <Titulo>Postar Material</Titulo>
                <Link href="/usuario/funcionario/listarMateriais" className="px-10 mx-8 py-2 rounded-md text-white bg-pink-400">Listar Materiais</Link>
            </div>
            <Checkbox titulo="Turma (as)" opcoes={[...turmasUnicas]} setOpcao={setTurmas}/>
            <div className="grid grid-cols-2 w-3/4">
                <EntradaPerfil texto="Título" placeholder="Digite o título da atividade" className={'ml-9 mt-2 w-full'} valor={nome} valorMudou={setNome}/>
                <EntradaPerfil texto="Descrição" placeholder="Digite a descrição da atividade" className={'ml-9 mt-2 w-full'} valor={descricao} valorMudou={setDescricao}/>
                <EntradaPerfil texto="Link" placeholder="Link usado no material (opcional)" className={'ml-9 mt-2 w-full'} valor={link} valorMudou={setLink}/>
                <DatePicker titulo="Data Selecionada" classname="ml-9" setData={setData}/>
                <FileInput setArquivo={setArquivo}/>
                <Botao onClick={adicao} className="w-36 bg-blue-400 ml-9 mt-4 h-10" cor={'blue'}>Enviar</Botao>
            </div>
        </LayoutUser>
    )
}