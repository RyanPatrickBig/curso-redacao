import { Botao } from "@/components/Botao";
import LayoutUser from "@/components/LayoutUser";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUploader from "@/components/ImageUploader";
import PerfilDados from "@/components/EntradaPerfil";
import { differenceInDays, addMonths } from 'date-fns'; // Biblioteca para manipulação de datas

interface UserProfile {
    modalidade: string;
    nome: string;
    numero: string;
    rg: string;
    cpf: string;
    endereco: string;
    profileImageUrl: string;

}
const mensalidade = 7;

export default function AlunoPage() {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [diasRestantes, setDiasRestantes] = useState<number>(0);
  const [porcentagemPercorrida, setPorcentagemPercorrida] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const firestore = getFirestore();
      const alunosRef = collection(firestore, "alunos");
      const q = query(alunosRef, where("email", "==", user.email));

      getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const alunoData = querySnapshot.docs[0].data() as UserProfile;
            setUserProfile(alunoData);

            if (alunoData.profileImageUrl) {
              setBase64Image(alunoData.profileImageUrl);
            }
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar informações do Firestore:", error);
        });
    }
  }, []);

  const [editar, setEditar] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleImageUpload = async (base64Image: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const storage = getStorage();
      const storageRef = ref(storage, `user-images/${user.uid}/profile-image.png`);

      try {
        await uploadString(storageRef, base64Image, "data_url");

        const imageUrl = await getDownloadURL(storageRef);

        const firestore = getFirestore();
        const userDocRef = doc(firestore, "Estudante", user.uid);

        await setDoc(userDocRef, { profileImageUrl: imageUrl }, { merge: true });

        setBase64Image(imageUrl);
        console.log("Foto de perfil atualizada com sucesso.");
      } catch (error) {
        console.error("Erro ao atualizar a foto de perfil:", error);
      }
    }
  };
  
  useEffect(() => {
    if (userProfile) {
      const dataAtual = new Date(); // Data atual
      const dataAtualPagamento = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), mensalidade); // Data do pagamento deste mês
      let dataProximoPagamento = addMonths(dataAtualPagamento, 1); // Data do próximo pagamento
  
      if (dataAtual.getDate() < mensalidade) { // Se o dia atual for menor ou igual ao dia de pagamento deste mês, o próximo pagamento será neste mês
        dataProximoPagamento = dataAtualPagamento;
      }
  
      const diasRestantes = differenceInDays(dataProximoPagamento, dataAtual);
      let porcentagem = ((31 - diasRestantes) / 31) * 100; // Calcula a porcentagem inversamente proporcional aos dias restantes
  
      if (porcentagem > 100) {
        porcentagem = 100;
      } else if (porcentagem < 0) {
        porcentagem = 0;
      }
  
      setDiasRestantes(diasRestantes+1);
      setPorcentagemPercorrida(porcentagem);
    }
  }, [userProfile]);
  

    return (
      <ProtectedRoute>
        <LayoutUser usuario={'aluno'} className="flex flex-col gap-2" divisoes>
            <div className="bg-white rounded-md w-auto h-1/2 m-2 mb-0">
                <div className="bg-gradient-to-r from-blue-400 to-pink-600 h-1/2 rounded-md"></div>
                <div className="flex flex-row">
                    <figure className="-mt-16 ml-12 mr-2">
                      <ImageUploader readOnly={editar} className="p-20" base64Image={base64Image} onImageUpload={(base64Image) => handleImageUpload(base64Image)}/>
                    </figure>
                    <h2 className="mt-10 ml-5 ">{userProfile?.nome}</h2>
                    <div className="flex place-content-between">
                      <Botao onClick={() => setEditar(!editar)} className="m-10 p-10 bg-blue-400" cor="blue">{editar == true ? 'Alterar':'Salvar'}</Botao>
                      <Botao  className="m-10 p-10 bg-blue-400" cor="blue">Sair</Botao>
                    </div>
                </div>
            </div>
            <div className="h-1/2 flex flex-row">

                {userProfile &&(
                <div className="bg-white rounded-md w-1/2 h-auto m-2 mr-1 mt-0 p-6
                                grid grid-cols-2">
                    <PerfilDados texto="Modalidade" valor='' somenteLeitura={true} />
                    <PerfilDados texto="Nome" valor={userProfile.nome} somenteLeitura={editar} />
                    <PerfilDados texto="Número" valor={userProfile.numero} somenteLeitura={editar} />
                    <PerfilDados texto="RG" valor={userProfile.rg} somenteLeitura={editar} />
                    <PerfilDados texto="CPF" valor={userProfile.cpf} somenteLeitura={editar} />
                    <PerfilDados texto="Endereço" valor={userProfile.endereco} somenteLeitura={editar} />

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