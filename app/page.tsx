"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Sparkles, Zap, Users, ImageIcon, Layers } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 检查文件大小（10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "文件过大",
          description: "请选择小于 10MB 的图片",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "错误",
        description: "请先上传图片",
        variant: "destructive",
      })
      return
    }

    if (!prompt.trim()) {
      toast({
        title: "错误",
        description: "请输入提示词",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          prompt: prompt,
        }),
      })

      if (!response.ok) {
        throw new Error("API 请求失败")
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "成功",
          description: "图片生成完成！",
        })
        
        if (data.imageUrl) {
          setGeneratedImage(data.imageUrl)
        } else {
          throw new Error('未获取到图片')
        }
      } else {
        throw new Error(data.error || "未知错误")
      }
    } catch (error) {
      console.error("生成失败:", error)
      toast({
        title: "错误",
        description: error instanceof Error ? error.message : "生成失败，请重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍌</span>
              <span className="text-xl font-bold">Nano Banana</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Generator
              </a>
              <a href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Showcase
              </a>
              <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <Button size="sm">Start Editing</Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-accent/50 border border-border">
          <span className="text-sm text-banana">🍌 The AI model that outperforms competitors</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">Nano Banana</h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance">
          Transform any image with simple text prompts. Advanced AI delivers consistent character editing and scene
          preservation. Experience the future of AI image editing.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          <Button size="lg" className="gap-2">
            <Sparkles className="h-5 w-5" />
            Start Editing
          </Button>
          <Button size="lg" variant="outline">
            View Examples
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-banana" />
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-banana" />
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-banana" />
            <span>Natural language</span>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get Started</h2>
          <p className="text-xl text-muted-foreground">
            Experience the power of nano-banana's natural language image editing
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Upload Section */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-semibold mb-4">Transform your image with AI-powered editing</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Reference Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-banana transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {uploadedImage ? (
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Add Image</p>
                          <p className="text-xs text-muted-foreground">Max 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Main Prompt</label>
                <Textarea
                  placeholder="Describe your desired edits..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button className="w-full gap-2" size="lg" onClick={handleGenerateImage} disabled={loading}>
                <Sparkles className="h-5 w-5" />
                {loading ? "生成中..." : "Generate Now"}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6 bg-card border-border">
            <h3 className="text-xl font-semibold mb-4">Output Gallery</h3>
            <div className="flex items-center justify-center h-[400px] border border-dashed border-border rounded-lg overflow-hidden bg-muted/50">
              {generatedImage ? (
                generatedImage.startsWith("data:text") ? (
                  <div className="text-center p-4">
                    <p className="text-sm font-medium mb-4">API 响应：</p>
                    <p className="text-xs text-muted-foreground line-clamp-5">
                      {decodeURIComponent(atob(generatedImage.split(",")[1]))}
                    </p>
                  </div>
                ) : (
                  <img src={generatedImage} alt="Generated" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-1">Ready for instant generation</p>
                  <p className="text-xs text-muted-foreground">Enter your prompt and unleash the power</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-xl text-muted-foreground">Why Choose Nano Banana?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: "Natural Language Editing",
              description:
                "Edit images using simple text prompts. Nano-banana AI understands complex instructions like GPT for images",
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Character Consistency",
              description:
                "Maintain perfect character details across edits. This model excels at preserving faces and identities",
            },
            {
              icon: <Layers className="h-8 w-8" />,
              title: "Scene Preservation",
              description:
                "Seamlessly blend edits with original backgrounds. Superior scene fusion compared to competitors",
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "One-Shot Editing",
              description:
                "Perfect results in a single attempt. Nano-banana solves one-shot image editing challenges effortlessly",
            },
            {
              icon: <ImageIcon className="h-8 w-8" />,
              title: "Multi-Image Context",
              description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
            },
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: "AI UGC Creation",
              description:
                "Create consistent AI influencers and UGC content. Perfect for social media and marketing campaigns",
            },
          ].map((feature, idx) => (
            <Card key={idx} className="p-6 bg-card border-border hover:border-banana transition-colors">
              <div className="text-banana mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Showcase</h2>
          <p className="text-xl text-muted-foreground">Lightning-Fast AI Creations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
          {[
            {
              title: "Ultra-Fast Mountain Generation",
              speed: "0.8 seconds",
              query: "majestic snow-capped mountain peak at sunset",
            },
            {
              title: "Instant Garden Creation",
              speed: "0.9 seconds",
              query: "zen garden with cherry blossoms and koi pond",
            },
            {
              title: "Real-time Beach Synthesis",
              speed: "0.7 seconds",
              query: "tropical beach with turquoise water and palm trees",
            },
            { title: "Rapid Aurora Generation", speed: "0.8 seconds", query: "northern lights over snowy landscape" },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="overflow-hidden bg-card border-border group hover:border-banana transition-colors"
            >
              <div className="aspect-square relative bg-muted">
                <img
                  src={`/api/placeholder?height=400&width=400&query=${encodeURIComponent(item.query)}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-banana/90 text-background px-2 py-1 rounded text-xs font-medium">
                  🍌 Nano Banana Speed
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">Created in {item.speed}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline">
            Try Nano Banana Generator
          </Button>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">User Reviews</h2>
          <p className="text-xl text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: "AIArtistPro",
              role: "Digital Creator",
              review:
                '"This editor completely changed my workflow. The character consistency is incredible - miles ahead of competitors!"',
            },
            {
              name: "ContentCreator",
              role: "UGC Specialist",
              review:
                '"Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!"',
            },
            {
              name: "PhotoEditor",
              role: "Professional Editor",
              review:
                '"One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!"',
            },
          ].map((review, idx) => (
            <Card key={idx} className="p-6 bg-card border-border">
              <p className="text-sm mb-4 italic text-muted-foreground">{review.review}</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-banana/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-banana" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">FAQs</h2>
          <p className="text-xl text-muted-foreground">Frequently Asked Questions</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What is Nano Banana?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                It's a revolutionary AI image editing model that transforms photos using natural language prompts. This
                is currently one of the most powerful image editing models available, with exceptional consistency and
                superior performance for character editing and scene preservation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Simply upload an image and describe your desired edits in natural language. The AI understands complex
                instructions like "place the creature in a snowy mountain" or "imagine the whole face and create it". It
                processes your text prompt and generates perfectly edited images.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                How is it better than competitors?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                This model excels in character consistency, scene blending, and one-shot editing. Users report superior
                performance in preserving facial features and seamlessly integrating edits with backgrounds. It also
                supports multi-image context, making it ideal for creating consistent AI content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                Can I use it for commercial projects?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! It's perfect for creating AI UGC content, social media campaigns, and marketing materials. Many
                users leverage it for creating consistent AI influencers and product photography. The high-quality
                outputs are suitable for professional use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                What types of edits can it handle?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The editor handles complex edits including face completion, background changes, object placement, style
                transfers, and character modifications. It excels at understanding contextual instructions while
                maintaining photorealistic quality.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>🍌 Nano Banana - Transform images with AI-powered editing</p>
          <p className="mt-2">NanoBanana is not related to Google or other AI companies.</p>
        </div>
      </footer>
    </div>
  )
}
