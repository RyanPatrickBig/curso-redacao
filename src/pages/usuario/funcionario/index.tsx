import {Botao} from "@/components/Botao";
import LayoutUser from "@/components/LayoutUser";
import Image from "next/image"
import Funcionario from "@/core/Funcionario";
import { useState, useEffect } from "react";
import EntradaPerfil from "@/components/EntradaPerfil";
import ImageUploader from "@/components/ImageUploader";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getUserIntoLocalStorage } from "@/utils/authLocalStorage";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {db, storage} from "@/backend/config"
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

interface UserProfile {
    nome: string;
    celular: string;
    cpf: string;
    email: string;
    rg: string;
    senha: string;
    id: string;
    profileImageUrl: string;
}

export default function PerfilFuncionario() {

    const [editar, setEditar] = useState(true)
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [nome, setNome] = useState(userProfile?.nome ?? '')
    const [celular, setCelular] = useState(userProfile?.celular ?? '')
    const [cpf, setCpf] = useState(userProfile?.cpf ?? '')
    const [email, setEmail] = useState(userProfile?.email ?? '')
    const [rg, setRg] = useState(userProfile?.rg ?? '')
    const [id, setId] = useState(userProfile?.id ?? '')
    const [senha, setSenha] = useState(userProfile?.senha ?? '')
    const user = getUserIntoLocalStorage();
    const router = useRouter();

    useEffect(() => {

        if (user) {
          const alunosRef = collection(db, "Funcionario");
          const q = query(alunosRef, where("cpf", "==", user.cpf));
    
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

      const handleImageUpload = async (base64Image: string) => {
    
        if (user) {
          const storageRef = ref(storage, `user-images/${user.uid}/profile-image.png`);
    
          try {
            await uploadString(storageRef, base64Image, "data_url");
    
            const imageUrl = await getDownloadURL(storageRef);
    
            const userDocRef = doc(db, "Funcionario", user.uid);
    
            await setDoc(userDocRef, { fotoPerfil: imageUrl }, { merge: true });
    
            setBase64Image(imageUrl);
            alert("Foto de perfil atualizada com sucesso.");
          } catch (error) {
            console.error("Erro ao atualizar a foto de perfil:", error);
            alert("Erro ao atualizar a foto de perfil.")
          }
        }
      };

        function salvarFuncionario(funcionario: Funcionario){
            setEditar(!editar)
        }

        const handleLogout = async () => {
          try {
            const auth = getAuth();
            await signOut(auth);  
            router.push('/login'); 
          } catch (error) {
            alert("Erro ao fazer logout")
            console.error('Erro ao fazer logout:', error);
          }
        };

    return (
        <LayoutUser usuario={'funcionario'} className="flex flex-col gap-2 text-black" divisoes>
            
            <section className="bg-white rounded-md w-auto h-1/2 m-2 mb-0">
                <div className="bg-gradient-to-r from-pink-500 to-pink-700 h-1/2 rounded-md"></div>
                <div className="flex flex-row">
                <figure className="-mt-16 ml-12 mr-2">
                <ImageUploader readOnly={editar} className="p-20" base64Image={base64Image} onImageUpload={(base64Image) => handleImageUpload(base64Image)} />
                </figure>
                <div className="flex place-content-between justify-between content-between w-full">
                  <h2 className="mt-10 ml-5 w-full overflow-hidden max-h-20">{userProfile?.nome}</h2>
                      <div className="flex">
                        <Botao onClick={() => salvarFuncionario(new Funcionario(nome, cpf, rg, celular, email, senha, id, false))} className="m-10 p-10 bg-blue-400">{editar == true ? 'Alterar':'Salvar'}</Botao>
                        <Botao onClick={handleLogout} className="m-10 ml-3 p-10 bg-slate-400" cor="slate">Sair</Botao>
                      </div>
                    </div>
                </div>
            </section>

            <div className="h-1/2 flex flex-row">

            {userProfile &&(
                <section className="bg-white rounded-md w-1/2 h-auto m-2 mr-1 mt-0 p-6
                                grid grid-cols-2">
                    <EntradaPerfil texto="Nome" valor={userProfile.nome} somenteLeitura={editar} valorMudou={setNome} />
                    <EntradaPerfil texto="Número" valor={userProfile.celular}  somenteLeitura={editar} valorMudou={setCelular} />
                    <EntradaPerfil texto="Email" valor={userProfile.email}  somenteLeitura={editar} valorMudou={setEmail} />
                    <EntradaPerfil texto="CPF" valor={userProfile.cpf}  somenteLeitura={editar} valorMudou={setCpf} />
                </section>
                )}
                <figure className="bg-white rounded-md w-1/2 h-auto m-2 ml-1 mt-0 
                                flex flex-col items-center">
                    <Image src='/images/logoLOGIN.png' width='250' height='250' alt='imagemDoCurso'/>
                </figure>
               
            </div>
        </LayoutUser>
    )
}