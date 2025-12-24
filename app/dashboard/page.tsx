'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Github, Home } from 'lucide-react'

interface User {
  id: string
  email?: string
  name?: string
  avatar?: string
  provider?: string
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const authenticated = searchParams.get('authenticated')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()

        if (!data.user) {
          router.push('/')
          return
        }

        setUser(data.user)

        if (authenticated) {
          toast({
            title: 'Success',
            description: `Welcome, ${data.user.name}!`,
          })
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, toast, authenticated])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome to your Nano Banana AI Clone dashboard
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="mb-8 p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="h-16 w-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name || 'User'}
                </h2>
                <p className="mt-1 text-gray-600">{user.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Github className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    Authenticated with GitHub
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">User ID:</span>
              <span className="font-mono text-sm text-gray-900">{user.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Email:</span>
              <span className="text-gray-900">{user.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Provider:</span>
              <span className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                GitHub
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Image Generator
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Generate images with AI using Flux 2 Pro model
            </p>
            <Link href="/">
              <Button className="w-full">Start Generating</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              API Documentation
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Learn how to use our APIs and integrate with your app
            </p>
            <a href="https://github.com/Allen-Awesome/nanobanana-ai-clone#api-%E9%85%8D%E7%BD%AE">
              <Button variant="outline" className="w-full">
                View Docs
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
