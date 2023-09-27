import Router from 'next/router'
import { useGlobals } from '../utils/globals'
import { hashSha256 } from '../utils/sha256-hash';
import { useEffect } from 'react';

const tokenKey = 'shmguitk'

function useLogin(password: string): void {
  const { apiBase } = useGlobals()
  useEffect(() => {
      async function myFn() {
      const sha256digest = await hashSha256(password)
      const res = await fetch(`${apiBase}/auth/login`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ password: sha256digest }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('Invalid password!');
        }
        throw new Error('Error executing login');
      }
      localStorage.setItem(tokenKey, data.accessToken);
    }
    myFn()
  })
}

function logout(): void {
  localStorage.removeItem(tokenKey)
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(tokenKey)
  },
  get authToken(): string | null {
    return localStorage.getItem(tokenKey)
  },
  useLogin,
  logout,
}
