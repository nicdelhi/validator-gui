import Router from 'next/router'
import {useGlobals} from '../utils/globals'
import {useCallback} from "react";

const isLoggedInKey = 'isLoggedIn'

function useLogin() {
  const { apiBase } = useGlobals();

  return useCallback(async (password: string) => {
    const res = await fetch(`${apiBase}/auth/login`, {
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
      body: JSON.stringify({password : password}),
    });
    await res.json();
    if (!res.ok) {
      if (res.status === 403) {
        throw new Error('Invalid password!');
      }
    }
    localStorage.setItem(isLoggedInKey, 'true');
  }, [apiBase]);
}

async function logout(apiBase : string) {
  const res = await fetch(`${apiBase}/auth/logout`, {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
  })
  if (res.status != 200) {
    throw new Error('Error logging out!');
  }
  localStorage.removeItem(isLoggedInKey)
  Router.push('/login')
}

export const authService = {
  get isLogged(): boolean {
    return !!localStorage.getItem(isLoggedInKey)
  },
  useLogin,
  logout,
}
