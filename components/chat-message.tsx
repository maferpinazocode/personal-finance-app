import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ShoppingCart, Car, Utensils, Tv, Lightbulb, Heart, GraduationCap, Package } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  expense?: {
    id: string
    amount: number
    description: string
    category: string
    timestamp: number
  }
}

interface ChatMessageProps {
  message: Message
}

const categoryIcons: Record<string, any> = {
  Transporte: Car,
  Alimentación: Utensils,
  Entretenimiento: Tv,
  Servicios: Lightbulb,
  Compras: ShoppingCart,
  Salud: Heart,
  Educación: GraduationCap,
  Otros: Package,
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <Card
        className={cn(
          "max-w-[80%] px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        {message.expense && !isUser && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs">
              {(() => {
                const Icon = categoryIcons[message.expense.category] || Package
                return <Icon className="w-3 h-3" />
              })()}
              <span className="opacity-75">{message.expense.category}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
