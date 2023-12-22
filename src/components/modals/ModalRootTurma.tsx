import Turma from "@/core/Turma";
import Select from "../Select";
import { useState } from "react";
import ModalTurma from "./ModalTurma";
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/backend/config';

interface ModalRootTurmaProps {
    turmas: Turma[]
    setTurmas: (turmas: Turma[]) => void
    turmasSeletor: any
    turmaSelecionada?: (turma: Turma) => void
    setSelect?:(select: string[]) => void
}

export default function ModalRootTurma(props: ModalRootTurmaProps){
    
    const [filtro, setFiltro] = useState('Todos(as)')
    const [selecionou, setSelecionou] = useState<Boolean>(false)
    const [excluir, setExcluir] = useState<Boolean>(false)
    const [turma, setTurma] = useState<Turma>(Turma.vazio())
    const [seletor, setSeletor] = useState(props.turmasSeletor) 
    const [modoEdicao, setModoEdicao] = useState(false);


    function selecionarTurma(){
        const turmaSelecionada = props.turmas.find((turma) => turma.nome === filtro);

        if (turmaSelecionada) {
            setTurma(turmaSelecionada);
        } else {
            setTurma(Turma.vazio());
        }
        setSelecionou(true)
    }

    async function excluirTurma(id: any) {
        try {
          console.log('ID da Turma a ser excluída:', id);
          const turmaRef = doc(db, 'Turmas', id.toString());
          await deleteDoc(turmaRef);
          console.log(`Turma excluída do Firebase.`);
        } catch (error) {
          console.error('Erro ao excluir a turma no Firebase:', error);
        }
        setExcluir(true);
      }
      

      async function exclusao() {
        try {
            const turmaSelecionada = props.turmas.find((turma) => turma.nome === filtro);
    
            if (turmaSelecionada) {
                await excluirTurma(turmaSelecionada.id);
                const turmaFiltrada = props.turmas.filter((turma) => turma.id !== turmaSelecionada.id);
                props.setTurmas(turmaFiltrada);
    
                const turmaSeletorAtualizado = seletor.filter((nome: any) => nome !== filtro);
                setSeletor(turmaSeletorAtualizado);
                props.setSelect?.(turmaSeletorAtualizado);
                setExcluir(false);
                setSelecionou(false);
            } else {
                alert("Turma não encontrada");
            }
        } catch (error) {
            console.error('Erro ao excluir a turma no Firebase:', error);
        }
    }
    
    async function edicao(turmaEditada: Turma) {
        try {
            console.log('Iniciando edição da turma. ID:', turmaEditada.id);
            if (turmaEditada.id) {
                if (modoEdicao) {
                    const turmaRef = doc(db, 'Turmas', turmaEditada.id.toString());
                    console.log('Antes de updateDoc');
                    const turmaEditadaData = { ...turmaEditada } as { [key: string]: any };

                    await updateDoc(turmaRef, turmaEditadaData);
                    console.log('Turma atualizada no Firebase.');

                    const turmasAtualizadas = props.turmas.map((turma) =>
                        turma.id === turmaEditada.id ? turmaEditada : turma
                    );
                    props.setTurmas(turmasAtualizadas);

                    setModoEdicao(false);
                    setSelecionou(false);
                } else {
                    setModoEdicao(true);
                }
            }
        } catch (error) {
            console.error('Erro ao editar a turma no Firebase:', error);
        }
    }        
    

    async function adicao(turmaNova: Turma) {
        if (!turmaNova.nome || !turmaNova.disciplina || !turmaNova.dia || !turmaNova.horario) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }
    
        if (props.turmas.some(turma => turma.nome === turmaNova.nome)) {
            alert("Já existe uma turma com esse nome.");
            return;
        }
    
        try {
            const docRef = await addDoc(collection(db, 'Turmas'), turmaNova);
            console.log('Turma adicionada com o ID:', docRef.id);
    
            const disciplinaDocRef = await addDoc(collection(db, 'Disciplina'), {
                nome: turmaNova.disciplina,
                turmaId: docRef.id,
            });
    
            console.log('Disciplina adicionada com o ID:', disciplinaDocRef.id);
    
            props.setTurmas([...props.turmas, turmaNova]);
            setSeletor([...seletor, turmaNova.nome]);
            props.setSelect?.([...seletor, turmaNova.nome]);
        } catch (error) {
            console.error('Erro ao adicionar a turma no Firebase:', error);
        }
    }
    


    return (
        <div className="flex text-black gap-3 -ml-3 -mt-2">
            {selecionou === true ? 
                <ModalTurma setSelecionou={setSelecionou} turma={turma} editar={edicao} adicao={adicao}/>
            :
            excluir === false?
            <>
                <div>
                    <Select titulo="Turma:" seletor={seletor} classname="bg-pink-500 text-white" setFiltro={setFiltro}></Select>
                    <button onClick={()=>{setTurma(Turma.vazio()); setSelecionou(true)}} className="bg-pink-500 text-white py-2 px-4 rounded-full ml-6">Criar nova turma</button>
                </div>
                <div className="flex flex-col items-end gap-2 mt-12">
                    {filtro !== 'Todos(as)' ? (
                    <>
                        <button onClick={excluirTurma} className="bg-pink-500 text-white py-2 px-4 rounded-md font-bold">Deletar</button>
                        <button onClick={selecionarTurma} className="bg-pink-500 text-white py-2 px-4 rounded-md font-bold">Editar</button>
                    </>
                    ) : null}
                </div>
            </>
            :
            <div className="flex flex-col items-center content-center p-4 px-5 gap-3">
                <h3>Deseja excluir a turma {filtro}?</h3>
                <button onClick={exclusao} className="p-3 bg-red-600 text-white font-bold rounded-lg">Sim, Excluir</button>
            </div>
            }
        </div>
    )
}