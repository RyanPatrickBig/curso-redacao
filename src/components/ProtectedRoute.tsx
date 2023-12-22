import { useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { initializeApp } from "firebase/app";
import { getUserIntoLocalStorage } from '@/utils/authLocalStorage';

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});


type ProtectedRouteProps = {
  children: ReactElement;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement => {
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUserIntoLocalStorage()
    console.log("Current user", currentUser)
    if (!currentUser) {
      router.push('/login');
      return
    }

  }, [router]);

  return children;
};

export default ProtectedRoute;




