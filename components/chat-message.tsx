import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  expense?: {
    id: string
    amount: number
    description: string
    timestamp: number
  }
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === "user"

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <Card
        className={cn(
          "max-w-[80%] px-4 py-3",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
      </Card>
    </div>
  )
}
