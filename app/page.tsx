"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, FileText } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { ExpenseReport } from "@/components/expense-report"

interface Expense {
  id: string
  amount: number
  description: string
  timestamp: number
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  expense?: Expense
}

export default function FinanzasChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showReport, setShowReport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Cargar gastos desde localStorage al iniciar
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses)
      setExpenses(parsed)

      // Crear mensajes iniciales de bienvenida
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content:
            '¡Hola! Soy tu asistente de finanzas. Escribe tus gastos como "Gasté 10 soles en taxi" y yo los registraré por ti. 💰',
        },
      ])
    } else {
      setMessages([
        {
          id: "welcome",
          type: "assistant",
          content:
            '¡Hola! Soy tu asistente de finanzas. Escribe tus gastos como "Gasté 10 soles en taxi" y yo los registraré por ti. 💰',
        },
      ])
    }
  }, [])

  // Guardar gastos en localStorage cuando cambien
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    }
  }, [expenses])

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const parseExpense = (text: string): { amount: number; description: string } | null => {
    // Patrones para detectar gastos: "Gasté X soles en Y" o "X soles en Y"
    const patterns = [
      /gast[eé]\s+(\d+(?:\.\d+)?)\s+soles?\s+en\s+(.+)/i,
      /(\d+(?:\.\d+)?)\s+soles?\s+en\s+(.+)/i,
      /gast[eé]\s+s\/?\s*(\d+(?:\.\d+)?)\s+en\s+(.+)/i,
      /s\/?\s*(\d+(?:\.\d+)?)\s+en\s+(.+)/i,
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return {
          amount: Number.parseFloat(match[1]),
          description: match[2].trim(),
        }
      }
    }

    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    }

    const parsedExpense = parseExpense(input)

    if (parsedExpense) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: parsedExpense.amount,
        description: parsedExpense.description,
        timestamp: Date.now(),
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Gasto registrado: S/${parsedExpense.amount.toFixed(2)} en ${parsedExpense.description}`,
        expense: newExpense,
      }

      setExpenses((prev) => [...prev, newExpense])
      setMessages((prev) => [...prev, userMessage, assistantMessage])
    } else {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          'No pude entender ese gasto. Intenta escribir algo como "Gasté 10 soles en taxi" o "15 soles en almuerzo".',
      }
      setMessages((prev) => [...prev, userMessage, assistantMessage])
    }

    setInput("")
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Finanzas Chat</h1>
            <p className="text-sm text-muted-foreground">Tu asistente personal de gastos</p>
          </div>
          <Button onClick={() => setShowReport(!showReport)} variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            {showReport ? "Ver Chat" : "Ver Reporte"}
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {showReport ? (
            <ExpenseReport expenses={expenses} />
          ) : (
            <div className="flex flex-col h-full">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border bg-card px-6 py-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ej: Gasté 10 soles en taxi..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
