import {Botao} from "@/components/Botao";
import Checkbox from "@/components/Checkbox";
import DatePicker from "@/components/DatePicker";
import EntradaPerfil from "@/components/EntradaPerfil";
import LayoutUser from "@/components/LayoutUser";
import Titulo from "@/components/Titulo";
import Live from "@/core/Live";
import Turma from "@/core/Turma";
import { useState, useEffect } from "react";
import {db} from "@/backend/config"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { format } from "date-fns";

export default function FuncionarioLive() {

const [lives, setLives] = useState<Live[]>([]);
const [listaTurmas, setListaTurmas] = useState<Turma[]>([]);
const [nome, setNome] = useState('')
const [link, setLink] = useState('')
const [professor, setProfessor] = useState('')
const [data, setData] = useState<Date>(new Date(0))
const [turmas, setTurmas] = useState<string[]>([])
const liveVazia = Live.vazio()
const [live, setLive] = useState<Live>(liveVazia)
const turmasUnicas = listaTurmas.map((turma: { nome: any }) => turma.nome);

useEffect(() => {
    const fetchLives = async () => {
      try {
        const livesSnapshot = await getDocs(collection(db, "Live"));
        const livesData = livesSnapshot.docs.map((doc) => doc.data() as Live);
        setLives(livesData);
      } catch (error) {
        console.error("Erro ao buscar lives no Firestore:", error);
      }
    };

    const fetchTurmas = async () => {
      try {
        const turmasSnapshot = await getDocs(collection(db, "Turmas"));
        const turmasData = turmasSnapshot.docs.map((doc) => doc.data() as Turma);
        setListaTurmas(turmasData);
      } catch (error) {
        console.error("Erro ao buscar turmas no Firestore:", error);
      }
    };

    fetchLives();
    fetchTurmas();
  }, []);

  async function adicao() {
    if (!nome || turmas.length === 0 || !link || data.getTime()==0) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
  
    try {
      if (live.id) {
        await atualizacao();
      } else {
        const novoId = "id" + Math.random();
        for (const turmaSelecionada of turmas) {
          const liveData = {
            nome,
            turma: turmaSelecionada,
            professor,
            data,
            link,
            id: novoId,
            status: false,
          };
  
          await addDoc(collection(db, "Live"), liveData);
  
          setLives((prevLives: Live[]) => [
            ...prevLives,
            new Live(
              nome,
              turmaSelecionada,
              professor,
              data,
              link,
              novoId,
              false
            ),
          ]);
        }
  
        alert("Lives criadas com sucesso!");
  
        setNome('');
        setLink('');
        setProfessor('');
        setData(new Date(0));
      }
    } catch (error) {
      console.error("Erro ao adicionar/atualizar a live:", error);
      alert("Ocorreu um erro ao criar/atualizar a live. Tente novamente mais tarde.");
    }
  }
  
  

function edicao(live: Live){
    setNome(live.nome)
    setLink(live.link)
    setData(live.data)
    setLive(live)
}

async function exclusao(live: Live) {
    try {
        if (!live.id){
            console.error("ID do funcionário não definido.");
            return;
        }

      await deleteDoc(doc(db, "Live", live.id));
  
      const livesFiltrados = lives.filter((liveCopia) => liveCopia.id !== live.id);
      setLives(livesFiltrados);
      setLive(liveVazia);
  
      alert("Live excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir a live:", error);
      alert("Ocorreu um erro ao excluir a live. Tente novamente mais tarde.");
    }
  }

  async function atualizacao() {
    try {
      if (!live.id) {
        console.error("ID da live não definido.");
        return;
      }
  
      await updateDoc(doc(db, "Live", live.id), {
        nome,
        turma: live.turma, 
        professor,
        data,
        link,
      });
  
      const updatedLives = lives.map((liveCopia) => {
        if (liveCopia.id === live.id) {
          return {
            ...liveCopia,
            nome,
            professor,
            data,
            link,
          };
        }
        return liveCopia;
      });
  
      setLive(liveVazia);
  
      alert("Live atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a live:", error);
      alert("Ocorreu um erro ao atualizar a live. Tente novamente mais tarde.");
    }
  }
  

return (
    <LayoutUser usuario={'funcionario'} className="text-black">

        <Titulo>Marcar Live</Titulo>
        <Checkbox titulo="Turma (as)" opcoes={[...turmasUnicas]} setOpcao={setTurmas}/>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-10 w-fit">
            <div>
                <EntradaPerfil texto="Título" placeholder="Digite o título da live" className={'ml-5 md:ml-9 mt-2 w-full'} valor={nome} valorMudou={setNome}/>
                <EntradaPerfil texto="Link" placeholder="Link para acessar a live" className={'ml-5 md:ml-9 mt-2 w-full'} valor={link} valorMudou={setLink}/>
                <DatePicker titulo="Data Selecionada" classname="ml-5 md:ml-9" setData={setData} valor={data} dataMin={new Date()}/>
                <Botao onClick={adicao} className="w-36 bg-blue-400 ml-5 md:ml-9 mt-4" cor={'blue'}>Marcar</Botao>
            </div>
            
            <div>
                <h3 className="font-Montserrant pt-2">Lives Criadas</h3>
                <div className="flex flex-col rounded-md bg-slate-100 p-3 pt-2 m-1 max-h-60 overflow-y-auto">
                    {lives.map((live, index) => (
                        <div key={index} className="bg-white border rounded-md p-3 my-1 pb-4">
                            <div className="flex gap-3 items-center">
                                {//Aqui tem ser colocada a imagem do professor
                                }
                                <img src="/images/IMG_3817.jpg" className="object-cover w-8 h-8 rounded-full"/>
                                <h3 className="font-bold">
                                    {live.professor}
                                </h3>
                            </div>
                            {live.data instanceof Timestamp && (
                            <h4 className="text-gray-600 mt-2 font-semibold">
                            {format(live.data.toDate(), 'dd-MM-yyyy')} {live.nome}
                            </h4>
                            )}
                            <h4 className="text-gray-600 font-semibold">
                                {live.turma} 
                            </h4>
                            {professor === live.professor && 
                            <div className="flex gap-2">
                                <Botao onClick={() => {exclusao(live)}} className="mt-2 p-4 pt-1 pb-1 font-semibold">Excluir</Botao>
                                <Botao onClick={() => {edicao(live)}} className="mt-2 p-4 pt-1 pb-1 font-semibold">Editar</Botao>
                            </div>
                            }
                        </div>
                    ))}
                </div>
            </div>

            </div>

    </LayoutUser>
)
}