'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Client } from '@/lib/clients'

export function AuthButton() {
  const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [isClientLoading, setIsClientLoading] = useState(false)

  useEffect(() => {
    async function fetchClient() {
      if (isAuthenticated && user?.email) {
        setIsClientLoading(true)
        try {
          const response = await fetch(`/api/client/${encodeURIComponent(user.email)}`)
          if (response.ok) {
            const clientData = await response.json()
            setClient(clientData)
          } else {
            setClient(null)
          }
        } catch (error) {
          console.error('Error fetching client:', error)
          setClient(null)
        }
        setIsClientLoading(false)
      } else {
        setClient(null)
        setIsClientLoading(false)
      }
    }
    fetchClient()
  }, [isAuthenticated, user?.email])

  if (isLoading || isClientLoading) return <p>Carregando...</p>

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {client?.image_url ? (
            <Image
              src={client.image_url}
              alt="User avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <Image
              src="/imgs/roza.webp"
              alt="Default avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <span className="text-sm">{user.name}</span>
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