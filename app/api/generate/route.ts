import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, prompt } = await request.json()

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: '缺少图片或提示词' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('API KEY 未配置')
    }

    console.log('调用 Flux 2 Pro 生成图片')

    // 使用 Flux 2 Pro 生成图片
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_SITE_NAME || 'Nano Banana',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux.2-pro',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    })

    const responseText = await response.text()
    console.log('API 响应状态:', response.status)

    if (!response.ok) {
      console.error('API 错误:', responseText)
      return NextResponse.json(
        { error: `API 返回错误: ${response.status}`, details: responseText },
        { status: response.status }
      )
    }

    const data = JSON.parse(responseText)
    const message = data.choices?.[0]?.message

    if (!message) {
      console.error('未获取到消息内容')
      return NextResponse.json(
        { error: 'API 未返回内容' },
        { status: 500 }
      )
    }

    // 检查是否有生成的图片
    let imageResultUrl = null
    if (message.images && message.images.length > 0) {
      imageResultUrl = message.images[0].image_url.url
      console.log('成功生成图片，长度:', imageResultUrl.length)
    } else if (message.content) {
      // 如果没有图片，返回文本内容
      console.log('返回文本内容:', message.content.substring(0, 50))
      imageResultUrl = message.content
    } else {
      console.error('消息中既没有图片也没有文本内容')
      return NextResponse.json(
        { error: 'API 未返回图片或文本内容' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageResultUrl,
    })
  } catch (error) {
    console.error('API 错误:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
