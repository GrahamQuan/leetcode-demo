'use client'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/firebase'

export default function Layout({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth)

  useEffect(() => {
    if (user) redirect('/')
  }, [user])

  return <>{children}</>
}
