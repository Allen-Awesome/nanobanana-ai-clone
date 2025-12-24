'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GitHubLoginButton } from './github-login-button'
import { LogOut, Github } from 'lucide-react'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  provider?: string
}

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        setUser(data.user || null)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        setUser(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
  }

  if (!user) {
    return <GitHubLoginButton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name || 'User'} />
            <AvatarFallback>
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm">
          <p className="font-semibold">{user.name || 'User'}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <DropdownMenuItem asChild>
          <a
            href={`https://github.com/${user.name?.split(' ')[0] || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub Profile
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
