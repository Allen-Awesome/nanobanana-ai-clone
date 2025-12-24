import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/error?message=No code provided', request.url)
    )
  }

  try {
    const supabase = await createClient()

    // 使用 code 和 state 交换会话
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('GitHub auth error:', error)
      return NextResponse.redirect(
        new URL(`/auth/error?message=${error.message}`, request.url)
      )
    }

    if (!data.session) {
      return NextResponse.redirect(
        new URL('/auth/error?message=No session created', request.url)
      )
    }

    // 成功登录，重定向到首页
    return NextResponse.redirect(
      new URL('/dashboard?authenticated=true', request.url)
    )
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${error instanceof Error ? error.message : 'Unknown error'}`,
        request.url
      )
    )
  }
}
