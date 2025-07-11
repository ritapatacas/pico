'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Carregando...</p>

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">{session.user?.name}</span>
        </div>
        <Button
          onClick={() => signOut()}
          variant="ghost"
          size="sm"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => signIn()} variant="default">
      Entrar
    </Button>
  )
}