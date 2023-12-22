import { Botao } from "@/components/Botao";
import LayoutUser from "@/components/LayoutUser";
import { useEffect, useState } from "react";
import { doc, setDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUploader from "@/components/ImageUploader";
import PerfilDados from "@/components/EntradaPerfil";
import { differenceInDays, addMonths } from 'date-fns';
import { getUserIntoLocalStorage } from "@/utils/authLocalStorage";
import {db, storage} from "@/backend/config"

interface UserProfile {
  modalidade: string;
  nome: string;
  celular: string;
  rg: string;
  cpf: string;
  endereco: string;
  profileImageUrl: string;
  turma: string;

}
const mensalidade = 7;

export default function AlunoPage() {
  const [editar, setEditar] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [diasRestantes, setDiasRestantes] = useState<number>(0);
  const [porcentagemPercorrida, setPorcentagemPercorrida] = useState<number>(0);
  const [nomeEditavel, setNomeEditavel] = useState(userProfile?.nome ?? '');
  const [rgEditavel, setRgEditavel] = useState(userProfile?.rg ?? '');
  const [cpfEditavel, setCpfEditavel] = useState(userProfile?.cpf ?? '');
  const [celularEditavel, setCelularEditavel] = useState(userProfile?.celular ?? '');
  const [enderecoEditavel, setEnderecoEditavel] = useState(userProfile?.endereco ?? '');
  const user = getUserIntoLocalStorage()

  useEffect(() => {

    if (user) {

      const alunosRef = collection(db, "Estudante");
      const q = query(alunosRef, where("email", "==", user.email));

      getDocs(q)
        .then(async (querySnapshot) => {
          if (!querySnapshot.empty) {
            const alunoData = querySnapshot.docs[0].data() as UserProfile;
            setUserProfile(alunoData);

            if (alunoData.profileImageUrl) {
              setBase64Image(alunoData.profileImageUrl);
            }

            const turmaIds = alunoData.turma;

            if (turmaIds && turmaIds.length > 0) {
              const turmaId = turmaIds[0];

              const turmaDocRef = doc(db, "Turmas", turmaId);
              console.log("turmaDocRef:", turmaDocRef.path);

              const turmaSnapshot = await getDoc(turmaDocRef);

              if (turmaSnapshot.exists()) {
                const turmaData = turmaSnapshot.data();
                const modalidadeTurma = turmaData?.modalidade;

                if (modalidadeTurma) {
                  setUserProfile((prevData) => ({ ...prevData!, modalidade: modalidadeTurma }));
                } else {
                  console.error("Modalidade da turma não encontrada.");
                }
              } else {
                console.error("O snapshot da turma não existe.");
              }
            } else {
              console.error("turmaId não definido ou vazio.");
            }
          }
        })
        .catch((error) => {
          alert('Ocorreu um erro inesperado, tente novamente mais tarde.')
          console.error("Erro ao buscar informações do Firestore:", error);
        });
    }
  }, []);

  const handleImageUpload = async (base64Image: string) => {
    
    if (user) {
      
      const storageRef = ref(storage, `user-images/${user.uid}/profile-image.png`);

      try {
        await uploadString(storageRef, base64Image, "data_url");

        const imageUrl = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "Estudante", user.uid);

        await setDoc(userDocRef, { fotoPerfil: imageUrl }, { merge: true });

        setBase64Image(imageUrl);
        alert("Foto de perfil atualizada com sucesso.");
      } catch (error) {
        alert("Erro ao atualizar a foto de perfil");
        console.error("Erro ao atualizar a foto de perfil:", error);
      }
    }
  };

  useEffect(() => {
    if (userProfile) {
      const dataAtual = new Date();
      const dataAtualPagamento = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), mensalidade);
      let dataProximoPagamento = addMonths(dataAtualPagamento, 1);

      if (dataAtual.getDate() < mensalidade) {
        dataProximoPagamento = dataAtualPagamento;
      }

      const diasRestantes = differenceInDays(dataProximoPagamento, dataAtual);
      let porcentagem = ((31 - diasRestantes) / 31) * 100;

      if (porcentagem > 100) {
        porcentagem = 100;
      } else if (porcentagem < 0) {
        porcentagem = 0;
      }

      setDiasRestantes(diasRestantes + 1);
      setPorcentagemPercorrida(porcentagem);
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {

      if (user) {

        const userDocRef = doc(db, "Estudante", user.uid);

        const editedFields = {
          nome: nomeEditavel,
          rg: rgEditavel,
          cpf: cpfEditavel,
          celular: celularEditavel,
          endereco: enderecoEditavel,
        };

        await setDoc(userDocRef, editedFields, { merge: true });
        setUserProfile((prevData) => ({ ...prevData!, ...editedFields }));

        alert("Informações do perfil salvas com sucesso.");
      }
    } catch (error) {
      alert("Erro ao salvar informações do perfil")
      console.error("Erro ao salvar informações do perfil:", error);
    }
  };

  return (
    <ProtectedRoute>
      <LayoutUser usuario={'aluno'} className="flex flex-col gap-2" divisoes>
        <div className="bg-white rounded-md w-auto h-1/2 m-2 mb-0">
          <div className="bg-gradient-to-r from-blue-400 to-pink-600 h-1/2 rounded-md"></div>
          <div className="flex flex-row">
            <figure className="-mt-16 ml-12 mr-2">
              <ImageUploader readOnly={editar} className="p-20" base64Image={base64Image} onImageUpload={(base64Image) => handleImageUpload(base64Image)} />
            </figure>
            <div className="flex place-content-between justify-between content-between w-full">
              <h2 className="mt-10 ml-5 w-full overflow-hidden max-h-20">{userProfile?.nome}</h2> 
              <div className="flex">
                <Botao onClick={handleSave} className="m-10 mr-0 p-10 bg-blue-400" cor="blue">{editar ? 'Alterar' : 'Salvar'}</Botao>
                <Botao  className="m-10 ml-3 p-10 bg-slate-400" cor="slate">Sair</Botao>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1/2 flex flex-row">

          {userProfile && (
            <div className="bg-white rounded-md w-1/2 h-auto m-2 mr-1 mt-0 p-6
                                grid grid-cols-2">
              <PerfilDados texto="Modalidade" valor={userProfile.modalidade} somenteLeitura={true} />
              <PerfilDados texto="Nome" valor={userProfile.nome} somenteLeitura={editar} valorMudou={setNomeEditavel} />
              <PerfilDados texto="Número" valor={userProfile.celular} somenteLeitura={editar} valorMudou={setCelularEditavel} />
              <PerfilDados texto="RG" valor={userProfile.rg} somenteLeitura={editar} valorMudou={setRgEditavel} />
              <PerfilDados texto="CPF" valor={userProfile.cpf} somenteLeitura={editar} valorMudou={setCpfEditavel} />
              <PerfilDados texto="Endereço" valor={userProfile.endereco} somenteLeitura={editar} valorMudou={setEnderecoEditavel} />
            </div>
          )}

          <div className="bg-white rounded-md w-1/2 h-auto m-2 ml-1 mt-0 p-6
                                flex flex-col items-center">
            <h1 className="pt-5">{diasRestantes} Dias</h1>
            <h4>Para o próximo pagamento</h4>
            <div className="bg-gray-200 h-6 w-80 mt-8 rounded-xl">
              <div className="h-6 bg-gradient-to-r from-blue-400 to-pink-600 rounded-xl" style={{ width: `${porcentagemPercorrida}%` }}></div>
            </div>
          </div>
        </div>
      </LayoutUser>
    </ProtectedRoute>
  )
}