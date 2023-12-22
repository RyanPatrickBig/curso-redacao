import { useState } from "react";
import Image from "next/image";
import { ref, uploadString, getDownloadURL} from "firebase/storage";
import { doc, setDoc, getFirestore} from "firebase/firestore";
import {  User, getAuth } from "firebase/auth";
import {storage} from "@/backend/config";
import { initializeApp } from "firebase/app";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

interface ImageUploaderProps {
  className: string;
  readOnly: boolean;
  base64Image: string | null;
  onImageUpload: (base64Image: string) => void;
}


export default function ImageUploader(props: ImageUploaderProps) {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const auth = getAuth();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const user = auth.currentUser as User;
    const file = e.target.files?.[0];
  
    if (user && file) {
      const storageRef = ref(storage, `user-images/${user.uid}/profile-image.png`);
  
      try {
        const base64Image = await convertToBase64(file);
  
        if (base64Image) {
          await uploadString(storageRef, base64Image, "data_url");
          const imageUrl = await getDownloadURL(storageRef);
  
          const firestore = getFirestore();
          const userDocRef = doc(firestore, "Estudante", user.uid);
          await setDoc(userDocRef, { fotoPerfil: base64Image });
  
          setBase64Image(base64Image); 
          props.onImageUpload(base64Image);
          console.log("Foto de perfil atualizada com sucesso.");
        } else {
          console.error("Erro ao fazer o upload da imagem: base64 é nulo.");
        }
      } catch (error) {
        console.error("Erro ao atualizar a foto de perfil:", error);
      }
    }
  }

  const convertToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          resolve(null);
        }
      };

      reader.readAsDataURL(file);
    });
  }


  return (
    <div className="flex flex-col justify-end">
      <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative ${props.readOnly == true ? null : "hover:brightness-90"} ${props.className}`}>
        {base64Image && (
          <img
            src={base64Image}
            alt="Uploaded Image"
            className="w-full h-full object-cover absolute top-0 left-0"
          />
        )}
        <input
          disabled={props.readOnly}
          type="file"
          accept="image/*"
          className={`w-full h-full opacity-0 absolute top-0 left-0 ${props.readOnly == false ? "cursor-pointer" : null}`}
          onChange={handleImageUpload}
        />
      </div>
      {props.readOnly == false ?
        <figure className="-m-6 -ml-4">
          <Image src="/images/editar-imagem.png" width={38} height={38} alt="imagemDoCurso"/>
        </figure>
      : null }
    </div>
  );
}