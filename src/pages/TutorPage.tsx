import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { ArrowLeft, Send, Bot, User, Sparkles, BookOpen, Calculator, GraduationCap, Image, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

const suggestions = [
  { icon: Calculator, text: 'Explique fração', color: 'from-emerald-500 to-teal-400' },
  { icon: BookOpen, text: 'Como usar Present Perfect?', color: 'from-blue-500 to-cyan-400' },
  { icon: GraduationCap, text: 'O que é álgebra?', color: 'from-amber-500 to-orange-400' },
  { icon: BookOpen, text: 'Resolva esse exercício', color: 'from-pink-500 to-rose-400' },
]

export function TutorPage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `Olá${profile?.name ? `, ${profile.name}` : ''}! 👋 Sou seu **Tutor IA**. Posso te ajudar com Inglês, Matemática, Português, Química e Física. Pode me perguntar qualquer coisa — inclusive enviar foto de exercício! 📸`
  }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande! Máximo 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      setImage(base64)
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() && !image) return
    const sanitized = text.replace(/<[^>]*>/g, '').trim()

    const userMsg: Message = { role: 'user', content: sanitized, image: imagePreview || undefined }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setImage(null)
    setImagePreview(null)
    setTyping(true)

    try {
      const history = [...messages, userMsg].map(m => {
        if (m.image) {
          return {
            role: m.role,
            content: [
              { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: image } },
              { type: 'text', text: m.content || 'O que você vê nessa imagem? Me ajude a entender.' }
            ]
          }
        }
        return { role: m.role, content: m.content }
      })

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `Você é o Tutor IA do StudyBoost AI, especialista em inglês, matemática, português, química e física para estudantes brasileiros. 
          Explique de forma clara, didática e motivadora. Use exemplos práticos e linguagem simples. 
          Quando receber imagem de exercício, resolva passo a passo.
          Use **negrito** para destacar pontos importantes.
          Responda sempre em português brasileiro.
          Seja animado e encoraje o aluno!`,
          messages: history
        })
      })

      const data = await response.json()
      const aiText = data.content?.[0]?.text || 'Desculpe, não consegui processar sua pergunta. Tente novamente!'
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ops! Não consegui me conectar agora. Verifique sua conexão e tente novamente. 😅'
      }])
    } finally {
      setTyping(false)
    }
  }

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/^- /, '<span class="text-primary-400 mr-2">•</span>')
      return (
        <p key={i} className={`${line.startsWith('- ') ? 'ml-2' : ''} ${line === '' ? 'h-2' : ''}`}
          dangerouslySetInnerHTML={{ __html: processed }} />
      )
    })
  }

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col pb-24">
      <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">Tutor IA</div>
            <div className="text-success-400 text-xs flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse" />
              Online 24/7
            </div>
          </div>
          <button onClick={() => setMessages([{ role: 'assistant', content: 'Nova conversa iniciada! Como posso te ajudar? 😊' }])}
            className="ml-auto text-dark-400 hover:text-white text-xs transition-colors">
            Nova conversa
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto max-w-lg mx-auto w-full px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'gradient-purple' : 'bg-dark-600'}`}>
              {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-dark-300" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant' ? 'glass text-dark-200 rounded-tl-sm p-4' : 'bg-primary-500/20 border border-primary-500/20 text-dark-100 rounded-tr-sm p-4'}`}>
              {msg.image && (
                <img src={msg.image} alt="enviada" className="w-full rounded-xl mb-3 max-h-48 object-cover" />
              )}
              {renderText(msg.content)}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="glass p-4 rounded-2xl rounded-tl-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <div className="text-dark-400 text-xs mt-1">Tutor digitando...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="max-w-lg mx-auto w-full px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.text)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass glass-hover shrink-0 text-sm text-dark-200 hover:text-white transition-all">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon size={12} className="text-white" />
                </div>
                {s.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="max-w-lg mx-auto w-full px-4 pb-2">
          <div className="relative inline-block">
            <img src={imagePreview} alt="preview" className="h-20 rounded-xl object-cover border border-white/10" />
            <button onClick={() => { setImage(null); setImagePreview(null) }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <X size={12} className="text-white" />
            </button>
            <p className="text-dark-400 text-xs mt-1">📷 Imagem pronta para enviar</p>
          </div>
        </div>
      )}

      <div className="sticky bottom-20 bg-dark-900/80 backdrop-blur-xl border-t border-white/5">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
          className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleImageSelect}
            accept="image/*" capture="environment" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 glass rounded-xl flex items-center justify-center text-dark-300 hover:text-white transition-colors shrink-0">
            <Image size={18} />
          </button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Tutor IA..." className="input-field flex-1" disabled={typing} />
          <button type="submit" disabled={(!input.trim() && !image) || typing}
            className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-primary-500/30 active:scale-95">
            <Send size={18} className="text-white" />
          </button>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
