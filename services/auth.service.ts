import Router from 'next/router'
import { useGlobals } from '../utils/globals'
import { hashSha256, getHashSalt } from '../utils/sha256-hash';

const tokenKey = 'shmguitk'
let isLoggedIn = false

async function useLogin(password: string): Promise<void> {
  const { apiBase } = useGlobals()
  const sha256digest = await hashSha256(password + getHashSalt())
  return fetch(`${apiBase}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ password: sha256digest }),
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Invalid password!')
      }
      throw new Error('Error executing login')
    }

    isLoggedIn = true
  })
}

function logout(): void {
  localStorage.removeItem(tokenKey)
  isLoggedIn = false
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return isLoggedIn
  },
  useLogin,
  logout,
}
