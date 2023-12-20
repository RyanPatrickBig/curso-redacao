import { UserProfile } from "firebase/auth";

export function saveUserIntoLocalStorage(userProfile: UserProfile) {
    localStorage.setItem("user", JSON.stringify(userProfile))
}

export function getUserIntoLocalStorage(){
    const userRepresentation = localStorage.getItem('user')

    try {
        const user = JSON.parse(userRepresentation || '')
        return user ? user : null
    } catch {
        return null
    }
}