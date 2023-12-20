import { UserProfile } from "firebase/auth";

export function saveUserIntoLocalStorage(userProfile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(userProfile));
  }
}

export function getUserIntoLocalStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    const userRepresentation = localStorage.getItem('user');

    try {
      const user = JSON.parse(userRepresentation || '');
      return user || null;
    } catch {
      return null;
    }
  }

  return null;
}
